import { z } from "zod";

export const AchievementCategorySchema = z.object({
  id: z.number().positive("Category ID must be a positive number"),
  name: z.string().min(1, "Category name cannot be empty"),
  description: z.string().optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
  icon: z.string().optional(),
  achievements: z.array(
    z.union([
      z.number().positive("Achievement ID must be a positive number"),
      z.object({
        id: z.number().positive("Achievement ID must be a positive number"),
        required_access: z
          .object({
            product: z.string().min(1, "Product cannot be empty"),
            condition: z.string().min(1, "Condition cannot be empty"),
          })
          .optional(),
        flags: z.array(z.string()).optional(),
        level: z.tuple([z.number(), z.number()]).optional(),
      }),
    ])
  ),
  tomorrow: z
    .array(
      z.object({
        id: z.number().positive("Achievement ID must be a positive number"),
        required_access: z
          .object({
            product: z.string().min(1, "Product cannot be empty"),
            condition: z.string().min(1, "Condition cannot be empty"),
          })
          .optional(),
        flags: z.array(z.string()).optional(),
        level: z.tuple([z.number(), z.number()]).optional(),
      })
    )
    .optional(),
});

export const AchievementSchema = z.object({
  id: z.number().positive("Achievement ID must be a positive number"),
  name: z.string().min(1, "Achievement name cannot be empty"),
  description: z.string().optional(),
  requirement: z.string().optional(),
  locked_text: z.string().optional(),
  type: z.string().min(1, "Achievement type cannot be empty"),
  flags: z.array(z.string()),
  tiers: z
    .array(
      z.object({
        count: z.number().int().min(0, "Tier count must be zero or greater"),
        points: z.number().int().min(0, "Tier points must be non-negative"),
      })
    )
    .optional(),
  rewards: z
    .array(
      z.object({
        type: z.string().min(1, "Reward type cannot be empty"),
        id: z.number().positive("Reward ID must be a positive number").optional(),
        count: z.number().int().positive("Reward count must be a positive integer").optional(),
      })
    )
    .optional(),
  icon: z.string().optional(),
  prerequisites: z
    .array(z.number().positive("Prerequisite ID must be a positive number"))
    .optional(),
  point_cap: z.number().int().optional(),
  category: z.number().positive("Category ID must be a positive number").optional(),
  points: z.number().int().min(0, "Points must be non-negative").optional(),
});

export const AccountAchievementSchema = z.object({
  id: z.number().positive("Account achievement ID must be a positive number"),
  current: z.number().int().min(0, "Current progress must be non-negative").optional(),
  max: z.number().int().positive("Max progress must be positive").optional(),
  done: z.boolean(),
  bits: z.array(z.number().int().min(0, "Bit values must be non-negative")).optional(),
  repeated: z.number().int().min(0, "Repeated count must be non-negative").optional(),
  unlocked: z.boolean().optional(),
});

export const AchievementGroupSchema = z.object({
  id: z.string().min(1, "Group ID cannot be empty"),
  name: z.string().min(1, "Group name cannot be empty"),
  description: z.string().optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
  categories: z.array(
    z.union([
      z.string().min(1, "Category ID cannot be empty"),
      z.number().positive("Category ID must be a positive number"),
    ])
  ),
  icon: z.string().optional(),
});

// Runtime validation helpers
export function validateAchievementCategory(
  data: unknown
): import("./achievements").AchievementCategory {
  return AchievementCategorySchema.parse(data);
}

export function validateAchievement(data: unknown): import("./achievements").Achievement {
  return AchievementSchema.parse(data);
}

export function validateAccountAchievement(
  data: unknown
): import("./achievements").AccountAchievement {
  return AccountAchievementSchema.parse(data);
}

export function validateAchievementGroup(data: unknown): import("./achievements").AchievementGroup {
  return AchievementGroupSchema.parse(data);
}

// Type guard functions for runtime validation
export function isAchievementCategory(
  obj: unknown
): obj is import("./achievements").AchievementCategory {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "achievements" in obj &&
    Array.isArray((obj as Record<string, unknown>).achievements)
  );
}

export function isAchievementArray(arr: unknown): arr is import("./achievements").Achievement[] {
  return Array.isArray(arr) && arr.every((item) => AchievementSchema.safeParse(item).success);
}

export function isAccountAchievement(
  obj: unknown
): obj is import("./achievements").AccountAchievement {
  const typedObj = obj as Record<string, unknown>;
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "done" in obj &&
    typeof typedObj.id === "number" &&
    typeof typedObj.done === "boolean"
  );
}

export function isAchievementGroup(obj: unknown): obj is import("./achievements").AchievementGroup {
  const typedObj = obj as Record<string, unknown>;
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "categories" in obj &&
    typeof typedObj.id === "string" &&
    typeof typedObj.name === "string" &&
    Array.isArray(typedObj.categories)
  );
}
