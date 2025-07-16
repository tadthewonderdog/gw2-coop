import type { Achievement, AchievementCategory, AccountAchievement } from "@/types/achievements";
import type { AchievementGroup } from "@/types/achievements";

/**
 * Extracts a flat array of achievement IDs from a category's achievements property.
 */
export function extractAchievementIds(achievements: AchievementCategory["achievements"]): number[] {
  return achievements.map((a) => (typeof a === "number" ? a : a.id));
}

/**
 * Returns all achievements for a given category ID.
 */
export function getAchievementsForCategory(
  allAchievements: Achievement[] | null,
  categories: AchievementCategory[] | null,
  categoryId: number | null
): Achievement[] {
  if (!allAchievements || !categories || !categoryId) return [];
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) return [];
  const achievementIds = extractAchievementIds(category.achievements);
  return allAchievements.filter((a) => achievementIds.includes(a.id));
}

/**
 * Maps account achievements by their ID for fast lookup.
 */
export function mapAccountAchievementsById(
  accountAchievements: AccountAchievement[] | null
): Record<number, AccountAchievement> {
  const map: Record<number, AccountAchievement> = {};
  (accountAchievements ?? []).forEach((a) => {
    map[a.id] = a;
  });
  return map;
}

/**
 * Filters and sorts achievements based on filters and sort order.
 */
export function filterAndSortAchievements(
  achievements: Achievement[],
  accountAchievementMap: Record<number, AccountAchievement>,
  filters: {
    showCompleted: boolean;
    showIncomplete: boolean;
    searchQuery: string;
  },
  sort: "alphabetical" | "percentComplete"
): Achievement[] {
  const filtered = achievements.filter((achievement) => {
    const accountAchievement = accountAchievementMap[achievement.id];
    const isCompleted = accountAchievement?.done;

    // Apply completion filters
    if (isCompleted && !filters.showCompleted) return false;
    if (!isCompleted && !filters.showIncomplete) return false;

    // Apply search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesName = achievement.name.toLowerCase().includes(searchLower);
      const matchesDesc = achievement.description?.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesDesc) return false;
    }

    return true;
  });

  // Apply sorting
  return filtered.sort((a, b) => {
    const accountA = accountAchievementMap[a.id];
    const accountB = accountAchievementMap[b.id];

    if (sort === "percentComplete") {
      // Calculate completion percentages
      const percentA =
        accountA?.current && accountA?.max ? (accountA.current / accountA.max) * 100 : 0;
      const percentB =
        accountB?.current && accountB?.max ? (accountB.current / accountB.max) * 100 : 0;
      return percentB - percentA;
    }
    // Default to alphabetical sorting
    return a.name.localeCompare(b.name);
  });
}

// Get category by ID
export function getCategoryById(categories: AchievementCategory[] | null, categoryId: number | null): AchievementCategory | undefined {
  if (!categories || !categoryId) return undefined;
  return categories.find((cat) => cat.id === categoryId);
}

// Get group by ID
export function getGroupById(groups: AchievementGroup[] | null, groupId: string | null): AchievementGroup | undefined {
  if (!groups || !groupId) return undefined;
  return groups.find((group) => group.id === groupId);
}

// Get achievement by ID
export function getAchievementById(allAchievements: Achievement[] | null, achievementId: number | null): Achievement | undefined {
  if (!allAchievements || !achievementId) return undefined;
  return allAchievements.find((a) => a.id === achievementId);
}

// Get account achievement by achievement ID
export function getAccountAchievementById(accountAchievements: AccountAchievement[] | null, achievementId: number | null): AccountAchievement | undefined {
  if (!accountAchievements || !achievementId) return undefined;
  return accountAchievements.find((a) => a.id === achievementId);
}

// Get category name by ID
export function getCategoryName(categories: AchievementCategory[] | null, categoryId: number | null): string {
  if (!categoryId || !categories) return "Achievements";
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.name || "Achievements";
}

// Get group name by ID
export function getGroupName(groups: AchievementGroup[] | null, groupId: string | null): string {
  if (!groupId || !groups) return "Group";
  const group = groups.find((g) => g.id === groupId);
  return group?.name || "Group";
}

// Check achievement flags
export function isRepeatable(achievement: Achievement): boolean {
  return achievement.flags?.includes("Repeatable") ?? false;
}
export function isLocked(achievement: Achievement): boolean {
  return achievement.flags?.includes("RequiresUnlock") ?? false;
}

// Progress calculation
export function getCompletionPercent(accountAchievement?: AccountAchievement): number {
  if (!accountAchievement?.current || !accountAchievement?.max) return 0;
  return (accountAchievement.current / accountAchievement.max) * 100;
}

// Get all achievements for a group
export function getAchievementsForGroup(
  allAchievements: Achievement[] | null,
  categories: AchievementCategory[] | null,
  groups: AchievementGroup[] | null,
  groupId: string | null
): Achievement[] {
  if (!allAchievements || !categories || !groups || !groupId) return [];
  const group = groups.find((g) => g.id === groupId);
  if (!group) return [];
  const groupCategoryIds = group.categories.map((id) => typeof id === 'string' ? parseInt(id, 10) : id);
  return groupCategoryIds.flatMap((catId) =>
    getAchievementsForCategory(allAchievements, categories, catId)
  );
}
 