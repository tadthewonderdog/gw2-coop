import { useEffect } from "react";

import {
  getAchievementGroups,
  getAchievementCategories,
  getAllAchievements,
} from "@/services/gw2-api";
import { useAchievementsStore } from "@/stores/achievements";

/**
 * Preloads public achievement data (groups, categories, all achievements) on app startup.
 * Does NOT fetch any user-specific/account data.
 */
export function AchievementDataProvider({ children }: { children: React.ReactNode }) {
  const {
    setGroups,
    setCategories,
    setAllAchievements,
    setLoadingGroups,
    setLoadingCategories,
    setLoadingAchievements,
    setGroupsError,
    setCategoriesError,
    setAchievementsError,
  } = useAchievementsStore();

  useEffect(() => {
    // Groups
    setLoadingGroups(true);
    getAchievementGroups(true)
      .then(setGroups)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load groups";
        setGroupsError(msg);
      })
      .finally(() => setLoadingGroups(false));

    // Categories
    setLoadingCategories(true);
    getAchievementCategories(true)
      .then(setCategories)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load categories";
        setCategoriesError(msg);
      })
      .finally(() => setLoadingCategories(false));

    // All Achievements
    setLoadingAchievements(true);
    getAllAchievements()
      .then(setAllAchievements)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load achievements";
        setAchievementsError(msg);
      })
      .finally(() => setLoadingAchievements(false));
  }, [
    setGroups,
    setCategories,
    setAllAchievements,
    setLoadingGroups,
    setLoadingCategories,
    setLoadingAchievements,
    setGroupsError,
    setCategoriesError,
    setAchievementsError,
  ]);

  return <>{children}</>;
}
