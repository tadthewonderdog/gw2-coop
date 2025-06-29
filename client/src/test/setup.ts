import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi, expect } from "vitest";
import "axe-core";
import type { StateCreator, StoreApi } from "zustand";
import type { PersistOptions } from "zustand/middleware";

// Custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
export const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

// Shared in-memory storage for Zustand persist middleware
export const testStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (i: number): string | null => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  };
})();

// Custom persist mock for Zustand using testStorage
vi.mock("zustand/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("zustand/middleware")>();
  const persistImpl = vi.fn(
    (config: StateCreator<unknown, [], [], unknown>, options: PersistOptions<unknown, unknown>) => {
      const storage = testStorage;
      return (set: (state: unknown) => void, get: () => unknown, api: StoreApi<unknown>) => {
        const state = config(
          (updates: unknown) => {
            set(updates);
            const currentState = get();
            const value = JSON.stringify({
              state: options?.partialize ? options.partialize(currentState) : currentState,
              version: 0,
            });
            storage.setItem(options?.name || "zustand", value);
          },
          get,
          api
        );
        return state;
      };
    }
  );
  return {
    ...actual,
    persist: persistImpl,
  };
});

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
