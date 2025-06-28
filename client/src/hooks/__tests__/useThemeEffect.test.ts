import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useThemeEffect } from "../useThemeEffect";

// Mock the theme files
vi.mock("@/styles/themes/dark", () => ({
  darkTheme: {
    "--background": "#000000",
    "--foreground": "#ffffff",
  },
}));

vi.mock("@/styles/themes/light", () => ({
  lightTheme: {
    "--background": "#ffffff",
    "--foreground": "#000000",
  },
}));

describe("useThemeEffect", () => {
  let mockDocumentElement: HTMLElement;
  let mockSetProperty: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetProperty = vi.fn();
    mockDocumentElement = {
      style: {
        setProperty: mockSetProperty,
      },
    } as unknown as HTMLElement;

    Object.defineProperty(window, "document", {
      value: {
        documentElement: mockDocumentElement,
      },
      writable: true,
    });
  });

  it("should apply dark theme CSS variables", () => {
    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
  });

  it("should apply light theme CSS variables", () => {
    renderHook(() => useThemeEffect(false));

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#000000");
  });

  it("should apply theme variables when isDark changes", () => {
    const { rerender } = renderHook(({ isDark }) => useThemeEffect(isDark), {
      initialProps: { isDark: true },
    });

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");

    mockSetProperty.mockClear();

    rerender({ isDark: false });

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#000000");
  });

  it("should apply all theme variables from the theme object", () => {
    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledTimes(2);
    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
  });

  it("should handle theme with many CSS variables", () => {
    // Mock a theme with many variables
    vi.mocked(require("@/styles/themes/dark")).darkTheme = {
      "--background": "#000000",
      "--foreground": "#ffffff",
      "--primary": "#3b82f6",
      "--secondary": "#64748b",
      "--accent": "#f1f5f9",
      "--muted": "#f8fafc",
      "--border": "#e2e8f0",
    };

    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledTimes(7);
    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--primary", "#3b82f6");
    expect(mockSetProperty).toHaveBeenCalledWith("--secondary", "#64748b");
    expect(mockSetProperty).toHaveBeenCalledWith("--accent", "#f1f5f9");
    expect(mockSetProperty).toHaveBeenCalledWith("--muted", "#f8fafc");
    expect(mockSetProperty).toHaveBeenCalledWith("--border", "#e2e8f0");
  });

  it("should handle empty theme object", () => {
    vi.mocked(require("@/styles/themes/dark")).darkTheme = {};

    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).not.toHaveBeenCalled();
  });

  it("should handle theme with non-string values", () => {
    vi.mocked(require("@/styles/themes/dark")).darkTheme = {
      "--background": "#000000",
      "--foreground": "#ffffff",
      "--number": 123,
      "--boolean": true,
      "--null": null,
      "--undefined": undefined,
    };

    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--number", 123);
    expect(mockSetProperty).toHaveBeenCalledWith("--boolean", true);
    expect(mockSetProperty).toHaveBeenCalledWith("--null", null);
    expect(mockSetProperty).toHaveBeenCalledWith("--undefined", undefined);
  });

  it("should handle theme with special characters in property names", () => {
    vi.mocked(require("@/styles/themes/dark")).darkTheme = {
      "--background": "#000000",
      "--foreground": "#ffffff",
      "--special-char": "#123456",
      "--camelCase": "#abcdef",
      "--UPPER_CASE": "#fedcba",
    };

    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--special-char", "#123456");
    expect(mockSetProperty).toHaveBeenCalledWith("--camelCase", "#abcdef");
    expect(mockSetProperty).toHaveBeenCalledWith("--UPPER_CASE", "#fedcba");
  });

  it("should handle theme with very long CSS values", () => {
    const longValue = "a".repeat(1000);
    vi.mocked(require("@/styles/themes/dark")).darkTheme = {
      "--background": "#000000",
      "--foreground": "#ffffff",
      "--long-value": longValue,
    };

    renderHook(() => useThemeEffect(true));

    expect(mockSetProperty).toHaveBeenCalledWith("--background", "#000000");
    expect(mockSetProperty).toHaveBeenCalledWith("--foreground", "#ffffff");
    expect(mockSetProperty).toHaveBeenCalledWith("--long-value", longValue);
  });

  it("should handle rapid theme changes", () => {
    const { rerender } = renderHook(({ isDark }) => useThemeEffect(isDark), {
      initialProps: { isDark: true },
    });

    // Rapidly change themes
    for (let i = 0; i < 10; i++) {
      rerender({ isDark: i % 2 === 0 });
    }

    // Should have been called for each change
    expect(mockSetProperty).toHaveBeenCalledTimes(20); // 10 changes * 2 properties each
  });

  it("should handle document element not being available", () => {
    // Mock document element as null
    Object.defineProperty(window, "document", {
      value: {
        documentElement: null,
      },
      writable: true,
    });

    // Should not throw
    expect(() => {
      renderHook(() => useThemeEffect(true));
    }).not.toThrow();
  });

  it("should handle setProperty method not being available", () => {
    // Mock setProperty as undefined
    mockDocumentElement = {
      style: {
        setProperty: undefined,
      },
    } as unknown as HTMLElement;

    Object.defineProperty(window, "document", {
      value: {
        documentElement: mockDocumentElement,
      },
      writable: true,
    });

    // Should not throw
    expect(() => {
      renderHook(() => useThemeEffect(true));
    }).not.toThrow();
  });
}); 