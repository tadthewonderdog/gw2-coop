import { renderHook } from "@testing-library/react";
import { describe, beforeEach, it, expect } from "vitest";

import { useAchievementsStore } from "@/stores/achievements";

import {
  useAchievementsForCategory,
  useAchievementsForGroup,
  useAccountAchievementForId,
  useCategoryName,
  useAccountAchievements,
  getAchievementsForCategoryFromState,
  getAchievementsForGroupFromState,
  getAccountAchievementForIdFromState,
  getCategoryNameFromState,
  getAccountAchievementsFromState,
} from "../achievement-selectors";

describe("achievement-selectors", () => {
  const mockAchievements = [
    {
      id: 1,
      name: "A1",
      type: "Default",
      flags: [],
      description: "",
      requirement: "",
      locked_text: "",
    },
    {
      id: 2,
      name: "A2",
      type: "Default",
      flags: [],
      description: "",
      requirement: "",
      locked_text: "",
    },
  ];
  const mockCategories = [
    { id: 10, name: "Cat1", achievements: [1, 2], order: 0, icon: "", description: "" },
    { id: 20, name: "Cat2", achievements: [], order: 1, icon: "", description: "" },
  ];
  const mockGroups = [
    { id: "g1", name: "Group1", categories: [10], order: 0, icon: "", description: "" },
  ];
  const mockAccountAchievements = [
    { id: 1, done: true },
    { id: 2, done: false },
  ];

  beforeEach(() => {
    useAchievementsStore.setState({
      allAchievements: mockAchievements,
      categories: mockCategories,
      groups: mockGroups,
      accountAchievements: mockAccountAchievements,
    });
  });

  it("useAchievementsForCategory returns correct achievements", () => {
    const { result } = renderHook(() => useAchievementsForCategory(10));
    expect(result.current).toEqual(mockAchievements);
  });

  it("useAchievementsForGroup returns correct achievements", () => {
    const { result } = renderHook(() => useAchievementsForGroup("g1"));
    expect(result.current).toEqual(mockAchievements);
  });

  it("useAccountAchievementForId returns correct account achievement", () => {
    const { result } = renderHook(() => useAccountAchievementForId(1));
    expect(result.current).toEqual({ id: 1, done: true });
  });

  it("useCategoryName returns correct name", () => {
    const { result } = renderHook(() => useCategoryName(10));
    expect(result.current).toBe("Cat1");
  });

  it("useAccountAchievements returns all account achievements", () => {
    const { result } = renderHook(() => useAccountAchievements());
    expect(result.current).toEqual(mockAccountAchievements);
  });

  it("getAchievementsForCategoryFromState returns correct achievements", () => {
    expect(getAchievementsForCategoryFromState(10)).toEqual(mockAchievements);
  });

  it("getAchievementsForGroupFromState returns correct achievements", () => {
    expect(getAchievementsForGroupFromState("g1")).toEqual(mockAchievements);
  });

  it("getAccountAchievementForIdFromState returns correct account achievement", () => {
    expect(getAccountAchievementForIdFromState(2)).toEqual({ id: 2, done: false });
  });

  it("getCategoryNameFromState returns correct name", () => {
    expect(getCategoryNameFromState(20)).toBe("Cat2");
  });

  it("getAccountAchievementsFromState returns all account achievements", () => {
    expect(getAccountAchievementsFromState()).toEqual(mockAccountAchievements);
  });

  it("returns empty or undefined for missing/null input", () => {
    useAchievementsStore.setState({
      allAchievements: null,
      categories: null,
      groups: null,
      accountAchievements: null,
    });
    expect(getAchievementsForCategoryFromState(10)).toEqual([]);
    expect(getAchievementsForGroupFromState("g1")).toEqual([]);
    expect(getAccountAchievementForIdFromState(1)).toBeUndefined();
    expect(getCategoryNameFromState(10)).toBe("Achievements");
    expect(getAccountAchievementsFromState()).toBeNull();
  });
});
