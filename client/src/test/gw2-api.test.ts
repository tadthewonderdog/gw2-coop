import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  getUserProfile,
  GW2ApiError,
  getAchievementCategories,
  getAchievements,
  getAchievementGroups,
  __resetAchievementGroupCacheForTest,
} from "../services/gw2-api";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GW2 API", () => {
  const mockApiKey = "test-api-key";
  const mockAccountInfo = {
    id: "test-id",
    name: "Test User",
    world: 1001,
    guilds: ["guild1", "guild2"],
    guild_leader: ["guild1"],
    created: "2024-01-01T00:00:00.000Z",
    access: ["account", "characters", "achievements"],
    commander: true,
    fractal_level: 100,
    daily_ap: 1000,
    monthly_ap: 5000,
    wvw_rank: 100,
  };

  const mockCharacters = ["Character1"];

  const mockAchievements = [
    {
      id: 1,
      current: 100,
      max: 100,
      done: true,
      bits: [1, 2, 3],
      repeated: 1,
      unlocked: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    __resetAchievementGroupCacheForTest();
  });

  describe("getUserProfile", () => {
    it("should return a complete user profile", async () => {
      // Mock the API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAccountInfo),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharacters),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAchievements),
        });

      const result = await getUserProfile(mockApiKey);

      expect(result).toEqual({
        ...mockAccountInfo,
        characters: [{ name: "Character1" }],
        achievements: mockAchievements,
      });

      // Verify fetch was called with correct URLs
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/account?access_token=" + mockApiKey)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/characters?access_token=" + mockApiKey)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/account/achievements?access_token=" + mockApiKey)
      );
    });

    it("should throw GW2ApiError when account info fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(getUserProfile(mockApiKey)).rejects.toThrow(GW2ApiError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw GW2ApiError when characters fetch fails", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAccountInfo),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      await expect(getUserProfile(mockApiKey)).rejects.toThrow(GW2ApiError);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should throw GW2ApiError when achievements fetch fails", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAccountInfo),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCharacters),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      await expect(getUserProfile(mockApiKey)).rejects.toThrow(GW2ApiError);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("GW2 API cache toggle", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      global.fetch = mockFetch;
    });

    it("should fetch from cache when useCache is true", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "group1",
              name: "Group 1",
              description: "Test group",
              order: 1,
              categories: [],
            },
          ]),
      });
      const groups = await getAchievementGroups(true);
      expect(groups).toEqual([
        {
          id: "group1",
          name: "Group 1",
          description: "Test group",
          order: 1,
          categories: [],
        },
      ]);
      expect(mockFetch).toHaveBeenCalledWith("https://tadthewonderdog.github.io/gw2-coop/data/achievement-groups.json");
    });

    it("should fetch from live API when useCache is false", async () => {
      // Mock the IDs fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["group1"]),
      });
      // Mock the details fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "group1",
              name: "Group 1",
              description: "Test group",
              order: 1,
              categories: [],
            },
          ]),
      });
      const groups = await getAchievementGroups(false);
      expect(groups).toEqual([
        {
          id: "group1",
          name: "Group 1",
          description: "Test group",
          order: 1,
          categories: [],
        },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/achievements/groups?v="));
    });

    it("should fallback to live API if cache fetch fails", async () => {
      // First call (cache) fails
      mockFetch.mockResolvedValueOnce({ ok: false });
      // Second call (live API IDs) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["group1"]),
      });
      // Third call (live API details) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "group1",
              name: "Group 1",
              description: "Test group",
              order: 1,
              categories: [],
            },
          ]),
      });
      const groups = await getAchievementGroups(true);
      expect(groups).toEqual([
        {
          id: "group1",
          name: "Group 1",
          description: "Test group",
          order: 1,
          categories: [],
        },
      ]);
    });

    it("should throw if both cache and live API fail", async () => {
      // Cache fetch fails
      mockFetch.mockRejectedValue(new Error("Cache fetch failed"));
      // Live API fetch also fails
      mockFetch.mockRejectedValue(new Error("Live API fetch failed"));

      await expect(getAchievementGroups(true)).rejects.toThrow(GW2ApiError);
    });

    it("should fetch from live API if useCache is false", async () => {
      // Mock the IDs fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["group1"]),
      });
      // Mock the details fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "group1",
              name: "Group 1",
              description: "Test group",
              order: 1,
              categories: [],
            },
          ]),
      });
      const groups = await getAchievementGroups(false);
      expect(groups).toEqual([
        {
          id: "group1",
          name: "Group 1",
          description: "Test group",
          order: 1,
          categories: [],
        },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/achievements/groups?v="));
    });

    it("should fetch achievement categories from cache when useCache is true", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: "Category 1",
              description: "Test category",
              order: 1,
              icon: "icon.png",
              achievements: [1, 2, 3],
            },
          ]),
      });
      const categories = await getAchievementCategories(true);
      expect(categories).toEqual([
        {
          id: 1,
          name: "Category 1",
          description: "Test category",
          order: 1,
          icon: "icon.png",
          achievements: [1, 2, 3],
        },
      ]);
      expect(mockFetch).toHaveBeenCalledWith("https://tadthewonderdog.github.io/gw2-coop/data/achievement-categories.json");
    });

    it("should fetch achievements from cache when useCache is true", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([{ id: 1, name: "Achievement 1", description: "Test achievement" }]),
      });
      const achs = await getAchievements(undefined, true);
      expect(achs).toEqual([{ id: 1, name: "Achievement 1", description: "Test achievement" }]);
      expect(mockFetch).toHaveBeenCalledWith("https://tadthewonderdog.github.io/gw2-coop/data/achievements.json");
    });
  });
});
