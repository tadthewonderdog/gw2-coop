import {
  getAchievementsForCategory,
  getAchievementsForGroup,
  getAccountAchievementById,
  getCategoryName,
} from "@/lib/achievement-utils";
import { useAchievementsStore } from "@/stores/achievements";

// React hook selector: Achievements for a category
export function useAchievementsForCategory(categoryId: number | null) {
  const allAchievements = useAchievementsStore((s) => s.allAchievements);
  const categories = useAchievementsStore((s) => s.categories);
  return getAchievementsForCategory(allAchievements, categories, categoryId);
}

// React hook selector: Achievements for a group
export function useAchievementsForGroup(groupId: string | null) {
  const allAchievements = useAchievementsStore((s) => s.allAchievements);
  const categories = useAchievementsStore((s) => s.categories);
  const groups = useAchievementsStore((s) => s.groups);
  return getAchievementsForGroup(allAchievements, categories, groups, groupId);
}

// React hook selector: Account achievement for an achievement ID
export function useAccountAchievementForId(achievementId: number | null) {
  const accountAchievements = useAchievementsStore((s) => s.accountAchievements);
  return getAccountAchievementById(accountAchievements, achievementId);
}

// React hook selector: Category name by ID
export function useCategoryName(categoryId: number | null) {
  const categories = useAchievementsStore((s) => s.categories);
  return getCategoryName(categories, categoryId);
}

// React hook selector: All account achievements
export function useAccountAchievements() {
  return useAchievementsStore((s) => s.accountAchievements);
}

// Non-hook selector: Achievements for a category from Zustand state
export function getAchievementsForCategoryFromState(categoryId: number | null) {
  const { allAchievements, categories } = useAchievementsStore.getState();
  return getAchievementsForCategory(allAchievements, categories, categoryId);
}

// Non-hook selector: Achievements for a group from Zustand state
export function getAchievementsForGroupFromState(groupId: string | null) {
  const { allAchievements, categories, groups } = useAchievementsStore.getState();
  return getAchievementsForGroup(allAchievements, categories, groups, groupId);
}

// Non-hook selector: Account achievement for an achievement ID from Zustand state
export function getAccountAchievementForIdFromState(achievementId: number | null) {
  const { accountAchievements } = useAchievementsStore.getState();
  return getAccountAchievementById(accountAchievements, achievementId);
}

// Non-hook selector: Category name by ID from Zustand state
export function getCategoryNameFromState(categoryId: number | null) {
  const { categories } = useAchievementsStore.getState();
  return getCategoryName(categories, categoryId);
}

// Non-hook selector: All account achievements from Zustand state
export function getAccountAchievementsFromState() {
  return useAchievementsStore.getState().accountAchievements;
} 