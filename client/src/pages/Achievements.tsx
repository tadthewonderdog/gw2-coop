import { Cloud, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useCallback, lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AchievementsAccordionGroup } from "@/components/achievements/AchievementsAccordionGroup";
import { ErrorState } from "@/components/achievements/ErrorState";
import { LoadingState } from "@/components/achievements/LoadingState";
import { PartyCard } from "@/components/PartyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAchievementsForCategory,
  useCategoryName,
  useAccountAchievements,
} from "@/selectors/achievement-selectors";
import {
  getAchievementCategories,
  getAccountAchievements,
  getAchievementGroups,
  getAllAchievements,
} from "@/services/gw2-api";
import { useAchievementsStore } from "@/stores/achievements";
import { useAchievementsUIStore } from "@/stores/achievements-ui";
import { useAPIKeyStore } from "@/stores/api-keys";
import type { AccountAchievement } from "@/types/achievements";

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
    useCache,
    setUseCache,
  } = useAchievementsUIStore();

  // Get cached data and loading states
  const {
    groups,
    categories,
    isLoadingGroups,
    isLoadingCategories,
    isLoadingAchievements,
    groupsError,
    categoriesError,
    achievementsError,
    setGroups,
    setCategories,
    setAccountAchievements,
    setLoadingGroups,
    setLoadingCategories,
    setLoadingAccountAchievements,
    setGroupsError,
    setCategoriesError,
    setAccountAchievementsError,
    setAllAchievements,
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
  const accountAchievements = useAccountAchievements();

  // Add a refresh state to trigger reloads
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to clear in-memory caches (for refresh)
  const { reset } = useAchievementsStore.getState();
  const clearAchievementCaches = () => {
    reset();
  };

  const loadInitialData = useCallback(async () => {
    try {
      // Load groups if not cached, only once per key
      if (!hasFetchedGroups.current && !groups) {
        hasFetchedGroups.current = true;
        setLoadingGroups(true);
        try {
          const groupsData = await getAchievementGroups(useCache);
          setGroups(groupsData);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setGroupsError(error.message);
          } else {
            setGroupsError("Unknown error loading groups");
          }
        } finally {
          setLoadingGroups(false);
        }
      }

      // Load categories if not cached, only once per key
      if (!hasFetchedCategories.current && !categories) {
        hasFetchedCategories.current = true;
        setLoadingCategories(true);
        try {
          const categoriesData = await getAchievementCategories(useCache);
          setCategories(categoriesData);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setCategoriesError(error.message);
          } else {
            setCategoriesError("Unknown error loading categories");
          }
        } finally {
          setLoadingCategories(false);
        }
      }

      // Load account achievements if not cached, only once per key
      if (!hasFetchedAccountAchievements.current && !accountAchievements) {
        hasFetchedAccountAchievements.current = true;
        setLoadingAccountAchievements(true);
        try {
          const accountAchievementsData = await getAccountAchievements(currentKey!.key);
          setAccountAchievements(accountAchievementsData);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setAccountAchievementsError(error.message);
          } else {
            setAccountAchievementsError("Unknown error loading account achievements");
          }
        } finally {
          setLoadingAccountAchievements(false);
        }
      }

      // Load all achievements from cache
      try {
        const allAchievements = await getAllAchievements();
        setAllAchievements(allAchievements);
      } catch (error) {
        // Optionally: handle error, e.g. set an error state or log
        console.error("Failed to load all achievements cache:", error);
      }
    } catch (error: unknown) {
      // This should not happen, but just in case
      if (error instanceof Error) {
        setGroupsError(error.message);
      } else {
        setGroupsError("Unknown error");
      }
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
    useCache,
    setAllAchievements,
  ]);

  useEffect(() => {
    if (!currentKey?.key) return;

    void loadInitialData();
  }, [currentKey?.key, loadInitialData]);

  // Get current category's achievements using selector
  const currentAchievements = useAchievementsForCategory(selectedCategoryId);
  // Category name using selector
  const categoryName = useCategoryName(selectedCategoryId);
  // Build a map of account achievements for fast lookup
  const accountAchievementsMap = useMemo(() => {
    const map = new Map<number, AccountAchievement>();
    (accountAchievements || []).forEach((aa) => {
      map.set(aa.id, aa);
    });
    return map;
  }, [accountAchievements]);

  // Add a handler for refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    clearAchievementCaches();
    hasFetchedGroups.current = false;
    hasFetchedCategories.current = false;
    hasFetchedAccountAchievements.current = false;
    await loadInitialData();
    setIsRefreshing(false);
  };

  return (
    <>
      {/* Top right controls - Hidden by default */}
      <div className="hidden flex justify-end items-center gap-2 mb-2">
        <button
          className={`p-2 rounded-full border transition-colors ${useCache ? "bg-blue-100 text-blue-600 border-blue-300" : "bg-background text-muted-foreground border-muted"}`}
          title={
            useCache
              ? "Using cached data (click to use live)"
              : "Using live data (click to use cache)"
          }
          type="button"
          onClick={() => setUseCache(!useCache)}
        >
          <Cloud className={useCache ? "fill-blue-400" : ""} size={22} />
        </button>
        <button
          className="p-2 rounded-full border bg-background text-muted-foreground border-muted transition-colors disabled:opacity-50"
          disabled={isRefreshing}
          title="Refresh achievement data"
          type="button"
          onClick={() => {
            void handleRefresh();
          }}
        >
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={22} />
        </button>
      </div>
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
              {(() => {
                if (isLoadingGroups || isLoadingCategories) {
                  return <LoadingState message="Loading groups..." />;
                }

                if (groupsError || categoriesError) {
                  return (
                    <ErrorState
                      message={groupsError || categoriesError || "Failed to load groups"}
                    />
                  );
                }

                if (groups && categories) {
                  return (
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
                  );
                }

                return null;
              })()}
            </CardContent>
          </Card>
        </aside>

        {/* Right: Achievements List */}
        <main className="flex-1 min-w-0">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground font-serif text-lg">
                {selectedCategoryId ? categoryName : "Select a Category"}
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
                        accountAchievement={accountAchievementsMap.get(achievement.id)}
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
