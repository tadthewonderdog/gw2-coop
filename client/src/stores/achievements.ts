import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AchievementGroup,
  AchievementCategory,
  Achievement,
  AccountAchievement,
} from "@/types/achievements";

/**
 * Zustand store state for GW2 achievement data, loading, and error states.
 */
interface AchievementsState {
  // Cache
  groups: AchievementGroup[] | null;
  categories: AchievementCategory[] | null;
  achievements: Record<number, Achievement[]>; // Keyed by category ID
  accountAchievements: AccountAchievement[] | null;
  allAchievements: Achievement[] | null;

  // Loading states
  isLoadingGroups: boolean;
  isLoadingCategories: boolean;
  isLoadingAchievements: boolean;
  isLoadingAccountAchievements: boolean;

  // Error states
  groupsError: string | null;
  categoriesError: string | null;
  achievementsError: string | null;
  accountAchievementsError: string | null;

  // Actions
  setGroups: (groups: AchievementGroup[] | null) => void;
  setCategories: (categories: AchievementCategory[] | null) => void;
  setAchievements: (categoryId: number, achievements: Achievement[]) => void;
  setAccountAchievements: (achievements: AccountAchievement[] | null) => void;
  setAllAchievements: (achievements: Achievement[] | null) => void;

  // Loading actions
  setLoadingGroups: (loading: boolean) => void;
  setLoadingCategories: (loading: boolean) => void;
  setLoadingAchievements: (loading: boolean) => void;
  setLoadingAccountAchievements: (loading: boolean) => void;

  // Error actions
  setGroupsError: (error: string | null) => void;
  setCategoriesError: (error: string | null) => void;
  setAchievementsError: (error: string | null) => void;
  setAccountAchievementsError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  groups: null,
  categories: null,
  achievements: {},
  accountAchievements: null,
  allAchievements: null,
  isLoadingGroups: false,
  isLoadingCategories: false,
  isLoadingAchievements: false,
  isLoadingAccountAchievements: false,
  groupsError: null,
  categoriesError: null,
  achievementsError: null,
  accountAchievementsError: null,
};

/**
 * Zustand store for managing GW2 achievement data, loading, and error states.
 * Persists cache to localStorage.
 */
export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set) => ({
      ...initialState,

      setGroups: (groups) => {
        set({ groups });
      },
      setCategories: (categories) => {
        set({ categories });
      },
      setAchievements: (categoryId, achievements) => {
        set((state) => ({
          achievements: { ...state.achievements, [categoryId]: achievements },
        }));
      },
      setAccountAchievements: (accountAchievements) => {
        set({ accountAchievements });
      },
      setAllAchievements: (allAchievements) => {
        set({ allAchievements });
      },

      setLoadingGroups: (loading) => set({ isLoadingGroups: loading }),
      setLoadingCategories: (loading) => set({ isLoadingCategories: loading }),
      setLoadingAchievements: (loading) => set({ isLoadingAchievements: loading }),
      setLoadingAccountAchievements: (loading) => set({ isLoadingAccountAchievements: loading }),

      setGroupsError: (error) => set({ groupsError: error }),
      setCategoriesError: (error) => set({ categoriesError: error }),
      setAchievementsError: (error) => set({ achievementsError: error }),
      setAccountAchievementsError: (error) => set({ accountAchievementsError: error }),

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "gw2-achievements-cache",
      partialize: (state) => ({
        groups: state.groups,
        categories: state.categories,
        achievements: state.achievements,
        accountAchievements: state.accountAchievements,
        allAchievements: state.allAchievements,
      }),
    }
  )
);
