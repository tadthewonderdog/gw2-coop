import { describe, it, expect } from "vitest";

import {
  extractAchievementIds,
  getAchievementsForCategory,
  mapAccountAchievementsById,
  filterAndSortAchievements,
  getCategoryById,
  getGroupById,
  getAchievementById,
  getAccountAchievementById,
  getCategoryName,
  getGroupName,
  isRepeatable,
  isLocked,
  getCompletionPercent,
  getAchievementsForGroup,
} from "../achievement-utils";

describe("achievement-utils", () => {
  const achievements = [
    {
      id: 1,
      name: "A1",
      type: "Default",
      flags: ["Repeatable"],
      description: "",
      requirement: "",
      locked_text: "",
    },
    {
      id: 2,
      name: "A2",
      type: "Default",
      flags: ["RequiresUnlock"],
      description: "",
      requirement: "",
      locked_text: "",
    },
    {
      id: 3,
      name: "A3",
      type: "Default",
      flags: [],
      description: "",
      requirement: "",
      locked_text: "",
    },
  ];
  const categories = [
    { id: 10, name: "Cat1", achievements: [1, 2], order: 0, icon: "", description: "" },
    { id: 20, name: "Cat2", achievements: [3], order: 1, icon: "", description: "" },
  ];
  const groups = [
    { id: "g1", name: "Group1", categories: [10, 20], order: 0, icon: "", description: "" },
  ];
  const accountAchievements = [
    { id: 1, done: true, current: 5, max: 10 },
    { id: 2, done: false, current: 2, max: 4 },
  ];

  it("extractAchievementIds returns correct ids", () => {
    expect(extractAchievementIds([1, { id: 2 }])).toEqual([1, 2]);
  });

  it("getAchievementsForCategory returns correct achievements", () => {
    expect(getAchievementsForCategory(achievements, categories, 10)).toEqual([
      achievements[0],
      achievements[1],
    ]);
  });

  it("mapAccountAchievementsById returns correct map", () => {
    expect(mapAccountAchievementsById(accountAchievements)).toEqual({
      1: accountAchievements[0],
      2: accountAchievements[1],
    });
  });

  it("filterAndSortAchievements filters and sorts", () => {
    const map = mapAccountAchievementsById(accountAchievements);
    const filtered = filterAndSortAchievements(
      achievements,
      map,
      { showCompleted: true, showIncomplete: false, searchQuery: "" },
      "alphabetical"
    );
    expect(filtered).toEqual([achievements[0]]);
    const sorted = filterAndSortAchievements(
      achievements,
      map,
      { showCompleted: true, showIncomplete: true, searchQuery: "" },
      "percentComplete"
    );
    expect(sorted[0].id).toBe(1); // higher percent first
  });

  it("getCategoryById returns correct category", () => {
    expect(getCategoryById(categories, 10)).toEqual(categories[0]);
    expect(getCategoryById(categories, 999)).toBeUndefined();
  });

  it("getGroupById returns correct group", () => {
    expect(getGroupById(groups, "g1")).toEqual(groups[0]);
    expect(getGroupById(groups, "bad")).toBeUndefined();
  });

  it("getAchievementById returns correct achievement", () => {
    expect(getAchievementById(achievements, 2)).toEqual(achievements[1]);
    expect(getAchievementById(achievements, 999)).toBeUndefined();
  });

  it("getAccountAchievementById returns correct account achievement", () => {
    expect(getAccountAchievementById(accountAchievements, 2)).toEqual(accountAchievements[1]);
    expect(getAccountAchievementById(accountAchievements, 999)).toBeUndefined();
  });

  it("getCategoryName returns correct name or fallback", () => {
    expect(getCategoryName(categories, 10)).toBe("Cat1");
    expect(getCategoryName(categories, 999)).toBe("Achievements");
  });

  it("getGroupName returns correct name or fallback", () => {
    expect(getGroupName(groups, "g1")).toBe("Group1");
    expect(getGroupName(groups, "bad")).toBe("Group");
  });

  it("isRepeatable and isLocked work", () => {
    expect(isRepeatable(achievements[0])).toBe(true);
    expect(isRepeatable(achievements[1])).toBe(false);
    expect(isLocked(achievements[1])).toBe(true);
    expect(isLocked(achievements[0])).toBe(false);
  });

  it("getCompletionPercent calculates correctly", () => {
    expect(getCompletionPercent(accountAchievements[0])).toBe(50);
    expect(getCompletionPercent(accountAchievements[1])).toBe(50);
    expect(getCompletionPercent(undefined)).toBe(0);
  });

  it("getAchievementsForGroup returns all achievements in group", () => {
    expect(getAchievementsForGroup(achievements, categories, groups, "g1")).toEqual(achievements);
    expect(getAchievementsForGroup(achievements, categories, groups, "bad")).toEqual([]);
  });

  it("handles null/empty input gracefully", () => {
    expect(getAchievementsForCategory(null, null, null)).toEqual([]);
    expect(getCategoryById(null, null)).toBeUndefined();
    expect(getGroupById(null, null)).toBeUndefined();
    expect(getAchievementById(null, null)).toBeUndefined();
    expect(getAccountAchievementById(null, null)).toBeUndefined();
    expect(getCategoryName(null, null)).toBe("Achievements");
    expect(getGroupName(null, null)).toBe("Group");
    expect(getAchievementsForGroup(null, null, null, null)).toEqual([]);
  });
});
