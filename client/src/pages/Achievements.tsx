import { useEffect, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import { AchievementsAccordionGroup } from "@/components/achievements/AchievementsAccordionGroup";
import { ErrorState } from "@/components/achievements/ErrorState";
import { LoadingState } from "@/components/achievements/LoadingState";
import { PartyCard } from "@/components/PartyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAchievementCategories,
  getAccountAchievements,
  getAchievementGroups,
} from "@/services/gw2-api";
import { useAchievementsStore } from "@/stores/achievements";
import { useAchievementsUIStore } from "@/stores/achievements-ui";
import { useAPIKeyStore } from "@/stores/api-keys";
import {
  AchievementSchema,
  isAchievementCategory,
  isAchievementArray,
  isAccountAchievement,
} from "@/types/achievement-schemas";
import type { Achievement, AccountAchievement, AchievementCategory } from "@/types/achievements";

// Lazy load heavy components
const AchievementCard = lazy(() =>
  import("@/components/achievements/AchievementCard").then((module) => ({
    default: module.AchievementCard,
  }))
);
const AchievementFilters = lazy(() =>
  import("@/components/achievements/AchievementFilters").then((module) => ({
    default: module.AchievementFilters,
  }))
);

// Helper functions with proper typing
function extractAchievementIds(achievements: AchievementCategory["achievements"]): number[] {
  return achievements.map((a) => {
    if (typeof a === "number") return a;
    return a.id;
  });
}

function getCategoryName(
  categories: AchievementCategory[] | null,
  categoryId: number | null
): string {
  if (!categoryId || !categories) return "Achievements";
  const category = categories.find((cat) => cat.id === categoryId);
  return category?.name || "Achievements";
}

export default function Achievements() {
  const keys = useAPIKeyStore((s) => s.keys);
  const currentKeyId = useAPIKeyStore((s) => s.currentKeyId);
  const currentKey = useMemo(() => keys.find((k) => k.id === currentKeyId), [keys, currentKeyId]);

  // Get UI state
  const {
    selectedGroupId,
    selectedCategoryId,
    setSelectedGroupId,
    setSelectedCategoryId,
    filters,
    sort,
  } = useAchievementsUIStore();

  // Get cached data and loading states
  const {
    groups,
    categories,
    achievements,
    accountAchievements,
    isLoadingGroups,
    isLoadingCategories,
    isLoadingAchievements,
    groupsError,
    categoriesError,
    achievementsError,
    setGroups,
    setCategories,
    setAchievements,
    setAccountAchievements,
    setLoadingGroups,
    setLoadingCategories,
    setLoadingAchievements,
    setLoadingAccountAchievements,
    setGroupsError,
    setCategoriesError,
    setAchievementsError,
    setAccountAchievementsError,
  } = useAchievementsStore();

  const navigate = useNavigate();

  // Redirect if no API key
  useEffect(() => {
    if (!currentKeyId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigate("/key-management");
    }
  }, [currentKeyId, navigate]);

  // Load groups, categories, and account achievements on mount
  const hasFetchedAccountAchievements = useRef(false);
  const hasFetchedCategories = useRef(false);
  const hasFetchedGroups = useRef(false);

  const loadInitialData = useCallback(async () => {
    try {
      // Load groups if not cached, only once per key
      if (!hasFetchedGroups.current && !groups) {
        hasFetchedGroups.current = true;
        setLoadingGroups(true);
        const groupsData = await getAchievementGroups();
        setGroups(groupsData);
        setLoadingGroups(false);
      }
      // Load categories if not cached, only once per key
      if (!hasFetchedCategories.current && !categories) {
        hasFetchedCategories.current = true;
        setLoadingCategories(true);
        const categoriesData = await getAchievementCategories();
        setCategories(categoriesData);
        setLoadingCategories(false);
      }
      // Load account achievements if not cached, only once per key
      if (!hasFetchedAccountAchievements.current && !accountAchievements) {
        hasFetchedAccountAchievements.current = true;
        setLoadingAccountAchievements(true);
        const accountAchievementsData = await getAccountAchievements(currentKey!.key);
        setAccountAchievements(accountAchievementsData);
        setLoadingAccountAchievements(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to load data";
      if (!groups) setGroupsError(error);
      if (!categories) setCategoriesError(error);
      if (!accountAchievements) setAccountAchievementsError(error);
    }
  }, [
    groups,
    categories,
    accountAchievements,
    currentKey,
    setGroups,
    setCategories,
    setAccountAchievements,
    setLoadingGroups,
    setLoadingCategories,
    setLoadingAccountAchievements,
    setGroupsError,
    setCategoriesError,
    setAccountAchievementsError,
  ]);

  useEffect(() => {
    if (!currentKey?.key) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    void loadInitialData();
  }, [currentKey?.key, loadInitialData]);

  // Load achievements when a category is selected
  useEffect(() => {
    if (!currentKey?.key || !selectedCategoryId || !categories) return;

    const loadCategoryAchievements = async () => {
      // Skip if already cached
      if (achievements[selectedCategoryId]) return;

      try {
        setLoadingAchievements(true);
        // Find the selected category
        const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
        if (!selectedCategory || !isAchievementCategory(selectedCategory)) {
          throw new Error("Category not found or invalid");
        }

        // Get achievement IDs for this category
        const achievementIds = extractAchievementIds(selectedCategory.achievements);

        if (achievementIds.length === 0) {
          setAchievements(selectedCategoryId, []);
          setLoadingAchievements(false);
          return;
        }

        // Fetch only the needed achievements
        const idsParam = achievementIds.join(",");
        const versionParam = "&v=2024-07-20T01:00:00.000Z";
        const response = await fetch(
          `https://api.guildwars2.com/v2/achievements?ids=${idsParam}${versionParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch achievements");
        const data = (await response.json()) as unknown;
        const parsed = AchievementSchema.array().safeParse(data);
        if (!parsed.success) throw new Error("Invalid achievement data");
        setAchievements(selectedCategoryId, parsed.data);
        setLoadingAchievements(false);
      } catch (err) {
        const error = err instanceof Error ? err.message : "Failed to load achievements";
        setAchievementsError(error);
        setLoadingAchievements(false);
      }
    };

    void loadCategoryAchievements();
  }, [
    currentKey?.key,
    selectedCategoryId,
    categories,
    achievements,
    setAchievements,
    setLoadingAchievements,
    setAchievementsError,
  ]);

  // Map account achievements by id for fast lookup
  const accountAchievementMap = useMemo(() => {
    const map: Record<number, AccountAchievement> = {};
    (accountAchievements ?? []).filter(isAccountAchievement).forEach((a) => {
      map[a.id] = a;
    });
    return map;
  }, [accountAchievements]);

  // Get current category's achievements and apply filters
  const currentAchievements = useMemo((): Achievement[] | null => {
    if (!selectedCategoryId || !achievements[selectedCategoryId]) return null;

    const categoryAchievements = achievements[selectedCategoryId];
    if (!isAchievementArray(categoryAchievements)) {
      console.error("Invalid achievement data for category:", selectedCategoryId);
      return null;
    }

    const filteredAchievements = categoryAchievements.filter((achievement: Achievement) => {
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
    return filteredAchievements.sort((a: Achievement, b: Achievement) => {
      const accountA = accountAchievementMap[a.id];
      const accountB = accountAchievementMap[b.id];

      if (sort === "percentComplete") {
        // Calculate completion percentages
        const percentA =
          accountA?.current && accountA?.max ? (accountA.current / accountA.max) * 100 : 0;
        const percentB =
          accountB?.current && accountB?.max ? (accountB.current / accountB.max) * 100 : 0;

        // Sort by completion percentage (descending)
        return percentB - percentA;
      }

      // Default to alphabetical sorting
      return a.name.localeCompare(b.name);
    });
  }, [selectedCategoryId, achievements, accountAchievementMap, filters, sort]);

  return (
    <>
      {/* Current Party Card at the top */}
      {keys.length > 0 && <PartyCard apiKeys={keys} />}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Accordion View */}
        <aside className="w-full md:w-80 max-w-xs">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground font-serif text-lg">
                Achievement Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingGroups || isLoadingCategories ? (
                <LoadingState message="Loading groups..." />
              ) : groupsError || categoriesError ? (
                <ErrorState message={groupsError || categoriesError || "Failed to load groups"} />
              ) : groups && categories ? (
                <AchievementsAccordionGroup
                  categories={categories}
                  groups={groups}
                  selectedCategoryId={selectedCategoryId}
                  selectedGroupId={selectedGroupId}
                  onSelectCategory={(catId, groupId) => {
                    setSelectedGroupId(groupId);
                    setSelectedCategoryId(catId);
                  }}
                  onSelectGroup={setSelectedGroupId}
                />
              ) : null}
            </CardContent>
          </Card>
        </aside>

        {/* Right: Achievements List */}
        <main className="flex-1 min-w-0">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground font-serif text-lg">
                {selectedCategoryId
                  ? getCategoryName(categories, selectedCategoryId)
                  : "Select a Category"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              {selectedCategoryId && (
                <Suspense fallback={<LoadingState message="Loading filters..." />}>
                  <AchievementFilters />
                </Suspense>
              )}

              {/* Achievement List */}
              {isLoadingAchievements ? (
                <LoadingState message="Loading achievements..." />
              ) : achievementsError ? (
                <ErrorState message={achievementsError} />
              ) : !selectedCategoryId ? (
                <div className="text-center text-muted-foreground">
                  Select a category to view achievements
                </div>
              ) : !currentAchievements ? (
                <div className="text-center text-muted-foreground">No achievements found</div>
              ) : currentAchievements.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No achievements match the current filters
                </div>
              ) : (
                <div className="space-y-4">
                  {currentAchievements.map((achievement) => (
                    <Suspense
                      key={achievement.id}
                      fallback={<LoadingState message="Loading achievement card..." />}
                    >
                      <AchievementCard
                        accountAchievement={accountAchievementMap[achievement.id]}
                        achievement={achievement}
                      />
                    </Suspense>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
