// @vitest-environment jsdom
import { render, waitFor, act } from "@testing-library/react";
import { describe, beforeEach, it, expect, vi } from "vitest";

import { useAchievementsStore } from "@/stores/achievements";

import { AchievementDataProvider } from "../AchievementDataProvider";

// Mock the API functions
vi.mock("../../services/gw2-api", () => ({
  getAchievementGroups: vi.fn(),
  getAchievementCategories: vi.fn(),
  getAllAchievements: vi.fn(),
}));

const mockGroups = [{ id: "1", name: "Group 1", categories: [] }];
const mockCategories = [{ id: 1, name: "Category 1", achievements: [] }];
const mockAchievements = [{ id: 1, name: "Achievement 1" }];

describe("AchievementDataProvider", () => {
  beforeEach(() => {
    // Reset Zustand store
    const {
      setGroups,
      setCategories,
      setAllAchievements,
      setGroupsError,
      setCategoriesError,
      setAchievementsError,
    } = useAchievementsStore.getState();
    setGroups(null);
    setCategories(null);
    setAllAchievements(null);
    setGroupsError(null);
    setCategoriesError(null);
    setAchievementsError(null);
    vi.clearAllMocks();
  });

  it("fetches and sets public achievement data on mount", async () => {
    act(() => {
      render(
        <AchievementDataProvider>
          <div data-testid="child">Child</div>
        </AchievementDataProvider>
      );
    });
    await waitFor(() => {
      const { groups, categories, allAchievements } = useAchievementsStore.getState();
      expect(groups).toEqual(mockGroups);
      expect(categories).toEqual(mockCategories);
      expect(allAchievements).toEqual(mockAchievements);
    });
  });

  it("sets error state if a fetch fails", async () => {
    act(() => {
      render(
        <AchievementDataProvider>
          <div data-testid="child">Child</div>
        </AchievementDataProvider>
      );
    });
    await waitFor(() => {
      const { groupsError, categoriesError, achievementsError } = useAchievementsStore.getState();
      expect(groupsError).toMatch(/fail groups/);
      expect(categoriesError).toMatch(/fail categories/);
      expect(achievementsError).toMatch(/fail achievements/);
    });
  });
});
