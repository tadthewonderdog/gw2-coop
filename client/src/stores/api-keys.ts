import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CharacterInfo } from "@/services/gw2-api";

export interface APIKey {
  id: string;
  name: string;
  key: string;
  accountId: string;
  accountName: string;
  permissions: string[];
  isSelected: boolean;
  isInvalid: boolean;
  characters: CharacterInfo[];
}

/**
 * Zustand store state for GW2 API keys, including key management and selection.
 */
interface APIKeyStore {
  keys: APIKey[];
  currentKeyId: string | null;
  addKey: (key: APIKey) => void;
  updateKey: (id: string, key: Partial<APIKey>) => void;
  removeKey: (id: string) => void;
  getKey: (id: string) => APIKey | undefined;
  setCurrentKey: (id: string) => void;
  toggleSelected: (id: string) => void;
  markInvalid: (id: string) => void;
  updateCharacters: (id: string, characters: CharacterInfo[]) => void;
}

/**
 * Zustand store for managing GW2 API keys, selection, and persistence.
 * Persists keys to localStorage.
 */
export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      keys: [],
      currentKeyId: null,
      addKey: (key) =>
        set((state) => ({
          keys: [
            ...state.keys,
            {
              ...key,
              isSelected: key.isSelected ?? false,
              isInvalid: key.isInvalid ?? false,
              characters: key.characters ?? [],
            },
          ],
          // If this is the first key, set it as current
          currentKeyId: state.keys.length === 0 ? key.id : state.currentKeyId,
        })),
      updateKey: (id, key) =>
        set((state) => ({
          keys: state.keys.map((k) => (k.id === id ? { ...k, ...key } : k)),
        })),
      removeKey: (id) =>
        set((state) => {
          const newKeys = state.keys.filter((k) => k.id !== id);
          // If we removed the current key, set the first remaining key as current
          const newCurrentKeyId =
            state.currentKeyId === id ? newKeys[0]?.id || null : state.currentKeyId;
          return {
            keys: newKeys,
            currentKeyId: newCurrentKeyId,
          };
        }),
      getKey: (id) => get().keys.find((k) => k.id === id),
      setCurrentKey: (id) => set({ currentKeyId: id }),
      toggleSelected: (id) =>
        set((state) => ({
          keys: state.keys.map((k) => (k.id === id ? { ...k, isSelected: !k.isSelected } : k)),
        })),
      markInvalid: (id) =>
        set((state) => ({
          keys: state.keys.map((k) => (k.id === id ? { ...k, isInvalid: true } : k)),
        })),
      updateCharacters: (id, characters) =>
        set((state) => ({
          keys: state.keys.map((k) => (k.id === id ? { ...k, characters } : k)),
        })),
    }),
    {
      name: "gw2-api-keys",
    }
  )
);
