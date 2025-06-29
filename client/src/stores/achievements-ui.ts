import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Zustand store for managing UI state of the Achievements page (expansion, selection, filters, sorting).
 * Persists relevant UI state to localStorage.
 */
interface AchievementsUIState {
  /** Expanded achievement group IDs (persisted) */
  expandedGroups: string[];
  /** Expanded achievement category IDs (persisted) */
  expandedCategories: number[];
  /** Currently selected group ID */
  selectedGroupId: string | null;
  /** Currently selected category ID */
  selectedCategoryId: number | null;
  /** Filters for the achievement list (persisted) */
  filters: {
    showCompleted: boolean;
    showIncomplete: boolean;
    searchQuery: string;
    rewardTypes: string[];
  };
  /** Sort order for the achievement list (persisted) */
  sort: "alphabetical" | "percentComplete";
  /** Whether to use cached achievement data (persisted) */
  useCache: boolean;
  /** Set expanded group IDs */
  setExpandedGroups: (ids: string[]) => void;
  /** Set expanded category IDs */
  setExpandedCategories: (ids: number[]) => void;
  /** Set selected group ID */
  setSelectedGroupId: (id: string | null) => void;
  /** Set selected category ID */
  setSelectedCategoryId: (id: number | null) => void;
  /** Set filters */
  setFilters: (filters: Partial<AchievementsUIState["filters"]>) => void;
  /** Set sort order */
  setSort: (sort: "alphabetical" | "percentComplete") => void;
  /** Set show completed */
  setShowCompleted: (show: boolean) => void;
  /** Set show incomplete */
  setShowIncomplete: (show: boolean) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set reward types */
  setRewardTypes: (types: string[]) => void;
  /** Reset filters */
  resetFilters: () => void;
  /** Set useCache */
  setUseCache: (use: boolean) => void;
}

export const useAchievementsUIStore = create<AchievementsUIState>()(
  persist(
    (set) => ({
      expandedGroups: [],
      expandedCategories: [],
      selectedGroupId: null,
      selectedCategoryId: null,
      filters: {
        showCompleted: true,
        showIncomplete: true,
        searchQuery: "",
        rewardTypes: [],
      },
      sort: "alphabetical",
      useCache: true,
      setExpandedGroups: (ids) => set({ expandedGroups: ids }),
      setExpandedCategories: (ids) => set({ expandedCategories: ids }),
      setSelectedGroupId: (id) => set({ selectedGroupId: id }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      setSort: (sort) => set({ sort }),
      setShowCompleted: (show) =>
        set((state) => ({
          filters: { ...state.filters, showCompleted: show },
        })),
      setShowIncomplete: (show) =>
        set((state) => ({
          filters: { ...state.filters, showIncomplete: show },
        })),
      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),
      setRewardTypes: (types) =>
        set((state) => ({
          filters: { ...state.filters, rewardTypes: types },
        })),
      resetFilters: () =>
        set({
          filters: {
            showCompleted: true,
            showIncomplete: true,
            searchQuery: "",
            rewardTypes: [],
          },
        }),
      setUseCache: (use) => set({ useCache: use }),
    }),
    {
      name: "gw2-achievements-ui",
      partialize: (state) => ({
        expandedGroups: state.expandedGroups,
        expandedCategories: state.expandedCategories,
        selectedGroupId: state.selectedGroupId,
        selectedCategoryId: state.selectedCategoryId,
        filters: {
          showCompleted: state.filters.showCompleted,
          showIncomplete: state.filters.showIncomplete,
          rewardTypes: state.filters.rewardTypes,
        },
        sort: state.sort,
        useCache: state.useCache,
      }),
    }
  )
);
