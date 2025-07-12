import { z } from "zod";

import { retryAsync } from "../lib/utils.js";
import {
  AchievementCategorySchema,
  AchievementSchema,
  AccountAchievementSchema,
  AchievementGroupSchema,
} from "../types/achievement-schemas.ts";
import type {
  Achievement,
  AchievementCategory,
  AccountAchievement,
  AchievementGroup,
} from "../types/achievements.ts";

// Re-export schemas and types for use by other modules
export {
  AchievementCategorySchema,
  AchievementSchema,
  AccountAchievementSchema,
  AchievementGroupSchema,
};

export type { Achievement, AchievementCategory, AccountAchievement, AchievementGroup };

const GW2_API_BASE = "https://api.guildwars2.com/v2";

// Schema for account info response
const AccountInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  world: z.number(),
  guilds: z.array(z.string()).optional(),
  guild_leader: z.array(z.string()).optional(),
  created: z.string(),
  access: z.array(z.string()),
  commander: z.boolean(),
  fractal_level: z.number().optional(),
  daily_ap: z.number().optional(),
  monthly_ap: z.number().optional(),
  wvw_rank: z.number().optional(),
});

export type AccountInfo = z.infer<typeof AccountInfoSchema>;

// Schema for character info response
const CharacterInfoSchema = z.object({
  name: z.string(),
});

export type CharacterInfo = z.infer<typeof CharacterInfoSchema>;

// Schema for user profile response
const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  world: z.number(),
  guilds: z.array(z.string()).optional(),
  guild_leader: z.array(z.string()).optional(),
  created: z.string(),
  access: z.array(z.string()),
  commander: z.boolean(),
  fractal_level: z.number().optional(),
  daily_ap: z.number().optional(),
  monthly_ap: z.number().optional(),
  wvw_rank: z.number().optional(),
  characters: z.array(CharacterInfoSchema).optional(),
  achievements: z.array(AccountAchievementSchema).optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Cache duration constants
const ACHIEVEMENT_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const ACHIEVEMENT_CATEGORY_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const ACHIEVEMENT_GROUP_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Cache storage
let achievementsCache: { data: Achievement[]; timestamp: number } | null = null;
let categoriesCache: { data: AchievementCategory[]; timestamp: number } | null = null;
let groupsCache: { data: AchievementGroup[]; timestamp: number } | null = null;

export class GW2ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "GW2ApiError";
  }
}

// Add targeted logging to all exported API functions
export async function verifyApiKey(apiKey: string): Promise<AccountInfo> {
  try {
    // Use the latest schema version (2024-07-20T01:00:00.000Z)
    const response = await retryAsync(
      () => fetch(`${GW2_API_BASE}/account?access_token=${apiKey}&v=2024-07-20T01:00:00.000Z`),
      3,
      500
    );
    if (!response.ok) {
      throw new GW2ApiError("Invalid API key", response.status);
    }
    const data = (await response.json()) as unknown;
    return AccountInfoSchema.parse(data);
  } catch (error) {
    if (error instanceof GW2ApiError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new GW2ApiError("Invalid response format from GW2 API");
    }
    throw new GW2ApiError("Failed to verify API key");
  }
}

export async function getCharacters(apiKey: string): Promise<CharacterInfo[]> {
  // Fetch just the character names using /v2/characters (no ids=all)
  const url = `${GW2_API_BASE}/characters?access_token=${apiKey}`;
  const response = await retryAsync(() => fetch(url), 3, 500);
  if (!response.ok) {
    throw new GW2ApiError("Failed to fetch characters", response.status);
  }
  const data = (await response.json()) as unknown;
  // The response is an array of names (strings)
  return (data as string[]).map((name) => ({ name }));
}

// Helper to batch fetch details by IDs
async function batchFetch<T>(
  endpoint: string,
  ids: (string | number)[],
  versionParam: string,
  schema: z.ZodTypeAny
): Promise<T[]> {
  const BATCH_SIZE = 200;
  const results: T[] = [];
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const url = `${endpoint}?ids=${batch.join(",")}${versionParam}`;
    const response = await retryAsync(() => fetch(url), 3, 500);
    const data = (await response.json()) as unknown;
    results.push(...(schema.array().parse(data) as T[]));
  }
  return results;
}

// Helper to fetch from public/data/*.json
async function fetchCachedJson<T>(path: string): Promise<T> {
  try {
    // Use the new base URL for cached data
    const baseUrl = "https://tadthewonderdog.github.io/gw2-coop/data/";
    const url = baseUrl + path;
    const res = await fetch(url);
    if (!res.ok) {
      throw new GW2ApiError(`Failed to fetch cached data: ${url}`, res.status);
    }
    const data = (await res.json()) as T;
    return data;
  } catch (err) {
    if (err instanceof GW2ApiError) throw err;
    throw new GW2ApiError(`Network error fetching cached data: ${path}`);
  }
}

export async function getAchievementCategories(useCache = false): Promise<AchievementCategory[]> {
  if (useCache) {
    try {
      return await fetchCachedJson<AchievementCategory[]>("achievement-categories.json");
    } catch {
      // If cache fails, proceed to live API, but if that also fails, the error will be thrown from there.
    }
  }
  if (
    categoriesCache &&
    Date.now() - categoriesCache.timestamp < ACHIEVEMENT_CATEGORY_CACHE_DURATION
  ) {
    return categoriesCache.data;
  }
  try {
    // 1. Fetch IDs
    const versionParam = "&v=2024-07-20T01:00:00.000Z";
    const idsRes = await retryAsync(
      () => fetch(`${GW2_API_BASE}/achievements/categories?v=2024-07-20T01:00:00.000Z`),
      3,
      500
    );
    const ids: number[] = (await idsRes.json()) as unknown as number[];
    // 2. Fetch details
    const categories = await batchFetch<AchievementCategory>(
      `${GW2_API_BASE}/achievements/categories`,
      ids,
      versionParam,
      AchievementCategorySchema
    );
    categoriesCache = { data: categories, timestamp: Date.now() };
    return categories;
  } catch (error) {
    if (error instanceof GW2ApiError) throw error;
    if (error instanceof z.ZodError) throw new GW2ApiError("Invalid response format from GW2 API");
    throw new GW2ApiError(
      "Failed to fetch achievement categories",
      error instanceof GW2ApiError ? error.status : undefined
    );
  }
}

export async function getAchievements(ids?: number[], useCache = false): Promise<Achievement[]> {
  if (useCache && !ids) {
    try {
      return await fetchCachedJson<Achievement[]>("achievements.json");
    } catch {
      // If cache fails, proceed to live API, but if that also fails, the error will be thrown from there.
    }
  }
  if (achievementsCache && Date.now() - achievementsCache.timestamp < ACHIEVEMENT_CACHE_DURATION) {
    return achievementsCache.data;
  }
  try {
    // 1. Fetch IDs
    const versionParam = "&v=2024-07-20T01:00:00.000Z";
    const idsRes = await retryAsync(
      () => fetch(`${GW2_API_BASE}/achievements?v=2024-07-20T01:00:00.000Z`),
      3,
      500
    );
    const ids: number[] = (await idsRes.json()) as unknown as number[];
    // 2. Fetch details
    const achievements = await batchFetch<Achievement>(
      `${GW2_API_BASE}/achievements`,
      ids,
      versionParam,
      AchievementSchema
    );
    achievementsCache = { data: achievements, timestamp: Date.now() };
    return achievements;
  } catch (error) {
    if (error instanceof GW2ApiError) throw error;
    if (error instanceof z.ZodError) throw new GW2ApiError("Invalid response format from GW2 API");
    throw new GW2ApiError(
      "Failed to fetch achievements",
      error instanceof GW2ApiError ? error.status : undefined
    );
  }
}

export async function getAccountAchievements(apiKey: string): Promise<AccountAchievement[]> {
  try {
    const response = await retryAsync(
      () => fetch(`${GW2_API_BASE}/account/achievements?access_token=${apiKey}`),
      3,
      500
    );
    if (!response.ok) {
      throw new GW2ApiError("Failed to fetch account achievements", response.status);
    }
    const data = (await response.json()) as unknown;
    return z.array(AccountAchievementSchema).parse(data);
  } catch (error) {
    if (error instanceof GW2ApiError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new GW2ApiError("Invalid response format from GW2 API");
    }
    throw new GW2ApiError(
      "Failed to fetch account achievements",
      error instanceof GW2ApiError ? error.status : undefined
    );
  }
}

export async function getUserProfile(apiKey: string): Promise<UserProfile> {
  try {
    // Fetch account info
    const accountInfo = await verifyApiKey(apiKey);

    // Fetch characters
    const characters = await getCharacters(apiKey);

    // Fetch achievements
    const achievements = await getAccountAchievements(apiKey);

    // Combine all data into a user profile
    const userProfile: UserProfile = {
      ...accountInfo,
      characters,
      achievements,
    };

    return UserProfileSchema.parse(userProfile);
  } catch (error) {
    if (error instanceof GW2ApiError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new GW2ApiError("Invalid response format from GW2 API");
    }
    throw new GW2ApiError(
      "Failed to fetch user profile",
      error instanceof GW2ApiError ? error.status : undefined
    );
  }
}

export async function getAchievementGroups(useCache = false): Promise<AchievementGroup[]> {
  if (useCache) {
    try {
      return await fetchCachedJson<AchievementGroup[]>("achievement-groups.json");
    } catch {
      // If cache fails, proceed to live API, but if that also fails, the error will be thrown from there.
    }
  }
  if (groupsCache && Date.now() - groupsCache.timestamp < ACHIEVEMENT_GROUP_CACHE_DURATION) {
    return groupsCache.data;
  }
  try {
    // 1. Fetch IDs
    const versionParam = "&v=2024-07-20T01:00:00.000Z";
    const idsRes = await retryAsync(
      () => fetch(`${GW2_API_BASE}/achievements/groups?v=2024-07-20T01:00:00.000Z`),
      3,
      500
    );
    if (!idsRes.ok) throw new GW2ApiError("Failed to fetch group IDs", idsRes.status);
    const ids: string[] = (await idsRes.json()) as unknown as string[];
    // 2. Fetch details
    const groups = await batchFetch<AchievementGroup>(
      `${GW2_API_BASE}/achievements/groups`,
      ids,
      versionParam,
      AchievementGroupSchema
    );
    groupsCache = { data: groups, timestamp: Date.now() };
    return groups;
  } catch (error) {
    if (error instanceof GW2ApiError) throw error;
    if (error instanceof z.ZodError) throw new GW2ApiError("Invalid response format from GW2 API");
    throw new GW2ApiError(
      "Failed to fetch achievement groups",
      error instanceof GW2ApiError ? error.status : undefined
    );
  }
}

// Test-only: reset the in-memory cache for achievement groups
export function __resetAchievementGroupCacheForTest() {
  groupsCache = null;
}
