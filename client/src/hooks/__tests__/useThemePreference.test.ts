import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

import { localStorageMock } from "../../test/setup";
import { useThemePreference } from "../useThemePreference";

// Mock matchMedia with proper MediaQueryList interface
const createMockMediaQuery = (matches: boolean) => ({
  matches,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

const matchMediaMock = vi.fn();

describe("useThemePreference", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let originalLocalStorage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let originalMatchMedia: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Save originals
    originalLocalStorage = window.localStorage;
    originalMatchMedia = window.matchMedia;

    // Setup matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaMock,
      writable: true,
    });

    // Mock only the document.documentElement.classList properties that the hook uses
    if (window.document && window.document.documentElement) {
      Object.defineProperty(window.document.documentElement, "classList", {
        value: {
          remove: vi.fn(),
          add: vi.fn(),
        },
        writable: true,
      });
    }
  });

  afterEach(() => {
    // Restore global mocks
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
    Object.defineProperty(window, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
    });
  });

  describe("Initialization", () => {
    it("should initialize with default theme when no localStorage value", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("system");
      expect(result.current.isSystemTheme).toBe(true);
    });

    it("should initialize with custom default theme", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference("custom-key", "dark"));

      expect(result.current.theme).toBe("dark");
      expect(result.current.isSystemTheme).toBe(false);
    });

    it("should initialize with stored theme from localStorage", () => {
      localStorageMock.getItem.mockReturnValue("light");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("light");
      expect(result.current.isSystemTheme).toBe(false);
    });

    it("should handle invalid stored theme gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid-theme");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("system");
      expect(result.current.isSystemTheme).toBe(true);
    });
  });

  describe("Theme Application", () => {
    it("should apply light theme when theme is light", () => {
      localStorageMock.getItem.mockReturnValue("light");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("light");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "light");
    });

    it("should apply dark theme when theme is dark", () => {
      localStorageMock.getItem.mockReturnValue("dark");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "dark");
    });

    it("should apply dark theme when system theme is dark", () => {
      localStorageMock.getItem.mockReturnValue("system");
      matchMediaMock.mockReturnValue(createMockMediaQuery(true));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("system");
      expect(result.current.isSystemTheme).toBe(true);
    });

    it("should apply light theme when system theme is light", () => {
      localStorageMock.getItem.mockReturnValue("system");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("system");
      expect(result.current.isSystemTheme).toBe(true);
    });
  });

  describe("Theme Changes", () => {
    it("should update theme when setTheme is called", () => {
      localStorageMock.getItem.mockReturnValue("light");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(result.current.isSystemTheme).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "dark");
    });

    it("should update theme when setTheme is called with system", () => {
      localStorageMock.getItem.mockReturnValue("light");
      matchMediaMock.mockReturnValue(createMockMediaQuery(true));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        result.current.setTheme("system");
      });

      expect(result.current.theme).toBe("system");
      expect(result.current.isSystemTheme).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "system");
    });

    it("should handle rapid theme changes", () => {
      localStorageMock.getItem.mockReturnValue("light");
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        result.current.setTheme("dark");
        result.current.setTheme("light");
        result.current.setTheme("system");
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2); // React batches state updates
    });
  });

  describe("System Theme Detection", () => {
    it("should respond to system theme changes when using system theme", () => {
      localStorageMock.getItem.mockReturnValue("system");
      const mockMediaQuery = createMockMediaQuery(false);
      matchMediaMock.mockReturnValue(mockMediaQuery);

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("system");

      // Simulate system theme change
      act(() => {
        mockMediaQuery.matches = true;
        // Trigger the change event
        const changeEvent = new Event("change");
        mockMediaQuery.dispatchEvent(changeEvent);
      });

      expect(result.current.theme).toBe("system");
    });

    it("should not respond to system theme changes when using explicit theme", () => {
      localStorageMock.getItem.mockReturnValue("light");
      const mockMediaQuery = createMockMediaQuery(false);
      matchMediaMock.mockReturnValue(mockMediaQuery);

      const { result } = renderHook(() => useThemePreference());

      expect(result.current.theme).toBe("light");

      // Simulate system theme change
      act(() => {
        mockMediaQuery.matches = true;
        const changeEvent = new Event("change");
        mockMediaQuery.dispatchEvent(changeEvent);
      });

      expect(result.current.theme).toBe("light");
    });
  });

  describe("Custom Storage Key", () => {
    it("should use custom storage key", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      renderHook(() => useThemePreference("custom-theme-key", "dark"));

      expect(localStorageMock.getItem).toHaveBeenCalledWith("custom-theme-key");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("custom-theme-key", "dark");
    });

    it("should handle different storage keys independently", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result: result1 } = renderHook(() => useThemePreference("key1", "light"));
      const { result: result2 } = renderHook(() => useThemePreference("key2", "dark"));

      expect(result1.current.theme).toBe("light");
      expect(result2.current.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("key1", "light");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("key2", "dark");
    });
  });

  describe("Edge Cases", () => {
    it("should handle localStorage not being available", () => {
      Object.defineProperty(window, "localStorage", {
        value: undefined,
        writable: true,
      });
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      expect(() => {
        renderHook(() => useThemePreference());
      }).not.toThrow();
    });

    it("should handle matchMedia not being available", () => {
      localStorageMock.getItem.mockReturnValue("system");
      Object.defineProperty(window, "matchMedia", {
        value: undefined,
        writable: true,
      });

      expect(() => {
        renderHook(() => useThemePreference());
      }).not.toThrow();
    });

    it("should handle very long theme names", () => {
      const longTheme = "a".repeat(1000);
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result.current.setTheme(longTheme as "dark" | "light" | "system");
      });

      expect(result.current.theme).toBe(longTheme);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", longTheme);
    });

    it("should handle special characters in theme names", () => {
      const specialTheme = "theme@#$%^&*()";
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result.current.setTheme(specialTheme as "dark" | "light" | "system");
      });

      expect(result.current.theme).toBe(specialTheme);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", specialTheme);
    });

    it("should handle empty theme name", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result.current.setTheme("" as "dark" | "light" | "system");
      });

      expect(result.current.theme).toBe("");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", "");
    });

    it("should handle null and undefined theme values", () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(createMockMediaQuery(false));

      const { result } = renderHook(() => useThemePreference());

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result.current.setTheme(null as unknown as "dark" | "light" | "system");
      });

      expect(result.current.theme).toBe(null);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", null);

      act(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        result.current.setTheme(undefined as unknown as "dark" | "light" | "system");
      });

      expect(result.current.theme).toBe(undefined);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("vite-ui-theme", undefined);
    });
  });

  describe("Cleanup", () => {
    it("should remove event listener on unmount", () => {
      const mockMediaQuery = createMockMediaQuery(false);
      matchMediaMock.mockReturnValue(mockMediaQuery);
      localStorageMock.getItem.mockReturnValue("system");

      const { unmount } = renderHook(() => useThemePreference());

      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });
  });
});
