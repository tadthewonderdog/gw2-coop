import { describe, it, expect } from "vitest";

import { cn, hsl } from "../theme-utils";

describe("theme-utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("bg-primary", "text-primary-foreground")).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("handles conditional classes", () => {
      expect(
        cn("bg-primary", { "text-primary-foreground": true, "text-secondary-foreground": false })
      ).toBe("bg-primary text-primary-foreground");
    });

    it("handles undefined or null values", () => {
      expect(cn("bg-primary", undefined, null)).toBe("bg-primary");
    });

    it("handles empty strings", () => {
      expect(cn("bg-primary", "", "text-primary-foreground")).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("handles arrays of class names", () => {
      expect(cn(["bg-primary", "text-primary-foreground"])).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("handles nested arrays", () => {
      expect(cn(["bg-primary", ["text-primary-foreground", "hover:bg-primary/90"]])).toBe(
        "bg-primary text-primary-foreground hover:bg-primary/90"
      );
    });

    it("handles objects with nested arrays", () => {
      expect(
        cn("bg-primary", {
          "text-primary-foreground": true,
          "hover:bg-primary/90": ["bg-secondary", "text-secondary-foreground"],
        })
      ).toBe("bg-primary text-primary-foreground hover:bg-primary/90");
    });
  });

  describe("hsl", () => {
    it("converts CSS HSL variable to HSL color string", () => {
      expect(hsl("--primary")).toBe("hsl(var(--primary) / 1)");
    });

    it("handles custom opacity", () => {
      expect(hsl("--primary", 0.5)).toBe("hsl(var(--primary) / 0.5)");
    });

    it("handles zero opacity", () => {
      expect(hsl("--primary", 0)).toBe("hsl(var(--primary) / 0)");
    });

    it("handles full opacity", () => {
      expect(hsl("--primary", 1)).toBe("hsl(var(--primary) / 1)");
    });
  });
});
