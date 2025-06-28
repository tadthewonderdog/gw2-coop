import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { Header } from "../Header";
import { ThemeProvider } from "../ui/theme-provider";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {ui}
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Header", () => {
  it("renders the header with navigation links", () => {
    renderWithProviders(<Header />);

    // Check for main navigation links
    expect(
      screen.getByRole("link", { name: /achievement analytics interface logo/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /groups/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /api keys/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /achievements/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /components/i })).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("renders with correct styling classes", () => {
    renderWithProviders(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("bg-background/80", "backdrop-blur-sm");
  });

  it("navigates to correct routes when links are clicked", () => {
    renderWithProviders(<Header />);

    const groupsLink = screen.getByRole("link", { name: /groups/i });
    const apiKeysLink = screen.getByRole("link", { name: /api keys/i });
    const achievementsLink = screen.getByRole("link", { name: /achievements/i });
    const componentsLink = screen.getByRole("link", { name: /components/i });

    expect(groupsLink).toHaveAttribute("href", "/group-management");
    expect(apiKeysLink).toHaveAttribute("href", "/key-management");
    expect(achievementsLink).toHaveAttribute("href", "/achievements");
    expect(componentsLink).toHaveAttribute("href", "/showcase");
  });

  it("toggles theme when theme button is clicked", () => {
    renderWithProviders(<Header />);
    const themeToggle = screen.getByRole("button", { name: /toggle theme/i });

    // Initial state should be dark theme
    expect(document.documentElement).toHaveClass("dark");

    // Click to toggle theme
    fireEvent.click(themeToggle);

    // Theme should be light now
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
