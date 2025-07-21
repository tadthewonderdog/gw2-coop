import { describe, it, expect } from "vitest";

import { cn } from "../lib/theme-utils";

describe("theme-utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-primary", "text-primary-foreground")).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("should handle conditional classes", () => {
      expect(
        cn("bg-primary", { "text-primary-foreground": true, "text-secondary-foreground": false })
      ).toBe("bg-primary text-primary-foreground");
    });

    it("should handle undefined or null values", () => {
      expect(cn("bg-primary", undefined, null)).toBe("bg-primary");
    });

    it("should handle empty strings", () => {
      expect(cn("bg-primary", "", "text-primary-foreground")).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("should handle arrays of class names", () => {
      expect(cn(["bg-primary", "text-primary-foreground"])).toBe(
        "bg-primary text-primary-foreground"
      );
    });

    it("should handle nested arrays", () => {
      expect(cn(["bg-primary", ["text-primary-foreground", "hover:bg-primary/90"]])).toBe(
        "bg-primary text-primary-foreground hover:bg-primary/90"
      );
    });

    it("should handle objects with nested arrays", () => {
      expect(
        cn("bg-primary", {
          "text-primary-foreground": true,
          "hover:bg-primary/90": ["bg-secondary", "text-secondary-foreground"],
        })
      ).toBe("bg-primary text-primary-foreground hover:bg-primary/90");
    });
  });
});
