import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "@/components/ui/theme-provider";

import { ComponentShowcase } from "../ComponentShowcase";

function renderWithThemeProvider(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ComponentShowcase", () => {
  it("renders all sections", () => {
    renderWithThemeProvider(<ComponentShowcase />);
    expect(screen.getByText("Buttons")).toBeInTheDocument();
    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Badges")).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Typography")).toBeInTheDocument();
  });

  it("renders all button variants", () => {
    renderWithThemeProvider(<ComponentShowcase />);
    expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Secondary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Destructive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ghost" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Learn More" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  it("renders all badge variants", () => {
    renderWithThemeProvider(<ComponentShowcase />);
    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(5); // 4 badge variants + 1 in the interactive card
  });

  it("renders typography examples", () => {
    renderWithThemeProvider(<ComponentShowcase />);
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
    expect(screen.getByText("Heading 2")).toBeInTheDocument();
    expect(screen.getByText("Heading 3")).toBeInTheDocument();
    expect(screen.getByText("Regular paragraph text")).toBeInTheDocument();
    expect(screen.getByText("Small muted text")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    renderWithThemeProvider(<ComponentShowcase />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });
});
