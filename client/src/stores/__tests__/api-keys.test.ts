import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useAPIKeyStore } from "../api-keys";
import type { APIKey } from "../api-keys";

describe("API Key Store", () => {
  const mockAPIKey: APIKey = {
    id: "test-id-1",
    name: "Test Key 1",
    key: "test-key-1",
    accountId: "account-1",
    accountName: "Test Account",
    permissions: ["account", "characters"],
    isSelected: false,
    isInvalid: false,
    characters: [],
  };

  const mockAPIKey2: APIKey = {
    id: "test-id-2",
    name: "Test Key 2",
    key: "test-key-2",
    accountId: "account-2",
    accountName: "Test Account 2",
    permissions: ["account"],
    isSelected: true,
    isInvalid: false,
    characters: [],
  };

  beforeEach(() => {
    // Reset store state
    act(() => {
      useAPIKeyStore.setState({
        keys: [],
        currentKeyId: null,
      });
    });
  });

  describe("Initial State", () => {
    it("should have empty initial state", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      expect(result.current.keys).toEqual([]);
      expect(result.current.currentKeyId).toBeNull();
    });
  });

  describe("addKey", () => {
    it("should add a new key to the store", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
      });
      
      expect(result.current.keys).toHaveLength(1);
      expect(result.current.keys[0]).toEqual({
        ...mockAPIKey,
        isSelected: false,
        isInvalid: false,
        characters: [],
      });
    });

    it("should set current key when adding first key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
      });
      
      expect(result.current.currentKeyId).toBe(mockAPIKey.id);
    });

    it("should not change current key when adding subsequent keys", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
      });
      
      expect(result.current.currentKeyId).toBe(mockAPIKey.id);
      expect(result.current.keys).toHaveLength(2);
    });

    it("should handle key with existing isSelected and isInvalid values", () => {
      const keyWithValues = { ...mockAPIKey, isSelected: true, isInvalid: true };
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(keyWithValues);
      });
      
      expect(result.current.keys[0].isSelected).toBe(true);
      expect(result.current.keys[0].isInvalid).toBe(true);
    });

    it("should handle key with existing characters", () => {
      const keyWithCharacters = { 
        ...mockAPIKey, 
        characters: [{ name: "TestChar", level: 80, profession: "Warrior" }] 
      };
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(keyWithCharacters);
      });
      
      expect(result.current.keys[0].characters).toHaveLength(1);
    });
  });

  describe("updateKey", () => {
    it("should update an existing key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateKey(mockAPIKey.id, { name: "Updated Name" });
      });
      
      expect(result.current.keys[0].name).toBe("Updated Name");
      expect(result.current.keys[0].key).toBe(mockAPIKey.key); // Other properties unchanged
    });

    it("should not update non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateKey("non-existent-id", { name: "Updated Name" });
      });
      
      expect(result.current.keys[0].name).toBe(mockAPIKey.name);
    });

    it("should handle partial updates", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateKey(mockAPIKey.id, { 
          isSelected: true, 
          isInvalid: true 
        });
      });
      
      expect(result.current.keys[0].isSelected).toBe(true);
      expect(result.current.keys[0].isInvalid).toBe(true);
    });
  });

  describe("removeKey", () => {
    it("should remove an existing key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.removeKey(mockAPIKey.id);
      });
      
      expect(result.current.keys).toHaveLength(1);
      expect(result.current.keys[0].id).toBe(mockAPIKey2.id);
    });

    it("should set new current key when removing current key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.removeKey(mockAPIKey.id); // This was the current key
      });
      
      expect(result.current.currentKeyId).toBe(mockAPIKey2.id);
    });

    it("should set current key to null when removing last key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.removeKey(mockAPIKey.id);
      });
      
      expect(result.current.currentKeyId).toBeNull();
      expect(result.current.keys).toHaveLength(0);
    });

    it("should not change current key when removing non-current key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.removeKey(mockAPIKey2.id); // Not the current key
      });
      
      expect(result.current.currentKeyId).toBe(mockAPIKey.id);
    });

    it("should handle removing non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.removeKey("non-existent-id");
      });
      
      expect(result.current.keys).toHaveLength(1);
      expect(result.current.currentKeyId).toBe(mockAPIKey.id);
    });
  });

  describe("getKey", () => {
    it("should return existing key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
      });
      
      const retrievedKey = result.current.getKey(mockAPIKey.id);
      expect(retrievedKey).toEqual(result.current.keys[0]);
    });

    it("should return undefined for non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      const retrievedKey = result.current.getKey("non-existent-id");
      expect(retrievedKey).toBeUndefined();
    });
  });

  describe("setCurrentKey", () => {
    it("should set current key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.setCurrentKey(mockAPIKey2.id);
      });
      
      expect(result.current.currentKeyId).toBe(mockAPIKey2.id);
    });

    it("should handle setting current key to non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.setCurrentKey("non-existent-id");
      });
      
      expect(result.current.currentKeyId).toBe("non-existent-id");
    });
  });

  describe("toggleSelected", () => {
    it("should toggle key selection", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.toggleSelected(mockAPIKey.id);
      });
      
      expect(result.current.keys[0].isSelected).toBe(true);
      
      act(() => {
        result.current.toggleSelected(mockAPIKey.id);
      });
      
      expect(result.current.keys[0].isSelected).toBe(false);
    });

    it("should not affect other keys when toggling selection", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.toggleSelected(mockAPIKey.id);
      });
      
      expect(result.current.keys[0].isSelected).toBe(true);
      expect(result.current.keys[1].isSelected).toBe(true); // Unchanged
    });

    it("should handle toggling non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.toggleSelected("non-existent-id");
      });
      
      expect(result.current.keys[0].isSelected).toBe(false); // Unchanged
    });
  });

  describe("markInvalid", () => {
    it("should mark key as invalid", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.markInvalid(mockAPIKey.id);
      });
      
      expect(result.current.keys[0].isInvalid).toBe(true);
    });

    it("should not affect other keys when marking invalid", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.markInvalid(mockAPIKey.id);
      });
      
      expect(result.current.keys[0].isInvalid).toBe(true);
      expect(result.current.keys[1].isInvalid).toBe(false); // Unchanged
    });

    it("should handle marking non-existent key as invalid", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.markInvalid("non-existent-id");
      });
      
      expect(result.current.keys[0].isInvalid).toBe(false); // Unchanged
    });
  });

  describe("updateCharacters", () => {
    it("should update characters for a key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      const newCharacters = [
        { name: "NewChar", level: 80, profession: "Guardian" }
      ];
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateCharacters(mockAPIKey.id, newCharacters);
      });
      
      expect(result.current.keys[0].characters).toEqual(newCharacters);
    });

    it("should not affect other keys when updating characters", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      const newCharacters = [
        { name: "NewChar", level: 80, profession: "Guardian" }
      ];
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.updateCharacters(mockAPIKey.id, newCharacters);
      });
      
      expect(result.current.keys[0].characters).toEqual(newCharacters);
      expect(result.current.keys[1].characters).toEqual([]); // Unchanged
    });

    it("should handle updating characters for non-existent key", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      const newCharacters = [
        { name: "NewChar", level: 80, profession: "Guardian" }
      ];
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateCharacters("non-existent-id", newCharacters);
      });
      
      expect(result.current.keys[0].characters).toEqual([]); // Unchanged
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple rapid operations", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.addKey(mockAPIKey2);
        result.current.toggleSelected(mockAPIKey.id);
        result.current.markInvalid(mockAPIKey2.id);
        result.current.setCurrentKey(mockAPIKey2.id);
      });
      
      expect(result.current.keys).toHaveLength(2);
      expect(result.current.keys[0].isSelected).toBe(true);
      expect(result.current.keys[1].isInvalid).toBe(true);
      expect(result.current.currentKeyId).toBe(mockAPIKey2.id);
    });

    it("should handle empty characters array", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        result.current.addKey(mockAPIKey);
        result.current.updateCharacters(mockAPIKey.id, []);
      });
      
      expect(result.current.keys[0].characters).toEqual([]);
    });

    it("should handle large number of keys", () => {
      const { result } = renderHook(() => useAPIKeyStore());
      
      act(() => {
        // Add 100 keys
        for (let i = 0; i < 100; i++) {
          result.current.addKey({
            ...mockAPIKey,
            id: `key-${i}`,
            name: `Key ${i}`,
          });
        }
      });
      
      expect(result.current.keys).toHaveLength(100);
      expect(result.current.currentKeyId).toBe("key-0"); // First key should be current
    });
  });
}); 