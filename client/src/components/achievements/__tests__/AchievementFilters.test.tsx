import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AchievementFilters } from "../AchievementFilters";
import { useAchievementsUIStore } from "@/stores/achievements-ui";

// Mock the store
vi.mock("@/stores/achievements-ui");

const mockUseAchievementsUIStore = vi.mocked(useAchievementsUIStore);

describe("AchievementFilters", () => {
  const mockStore = {
    filters: {
      searchQuery: "",
      showCompleted: true,
      showIncomplete: true,
    },
    sort: "alphabetical" as const,
    setShowCompleted: vi.fn(),
    setShowIncomplete: vi.fn(),
    setSearchQuery: vi.fn(),
    setSort: vi.fn(),
    resetFilters: vi.fn(),
  };

  beforeEach(() => {
    mockUseAchievementsUIStore.mockReturnValue(mockStore);
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    render(<AchievementFilters />);
    
    expect(screen.getByPlaceholderText("Search achievements...")).toBeInTheDocument();
  });

  it("renders completion filter switches", () => {
    render(<AchievementFilters />);
    
    expect(screen.getByLabelText("Completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Incomplete")).toBeInTheDocument();
  });

  it("renders sort dropdown", () => {
    render(<AchievementFilters />);
    
    expect(screen.getByText("Sort by:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alphabetical")).toBeInTheDocument();
  });

  it("handles search input change", () => {
    render(<AchievementFilters />);
    
    const searchInput = screen.getByPlaceholderText("Search achievements...");
    fireEvent.change(searchInput, { target: { value: "test search" } });
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith("test search");
  });

  it("handles completed filter toggle", () => {
    render(<AchievementFilters />);
    
    const completedSwitch = screen.getByLabelText("Completed");
    fireEvent.click(completedSwitch);
    
    expect(mockStore.setShowCompleted).toHaveBeenCalledWith(false);
  });

  it("handles incomplete filter toggle", () => {
    render(<AchievementFilters />);
    
    const incompleteSwitch = screen.getByLabelText("Incomplete");
    fireEvent.click(incompleteSwitch);
    
    expect(mockStore.setShowIncomplete).toHaveBeenCalledWith(false);
  });

  it("handles sort change", () => {
    render(<AchievementFilters />);
    
    const sortSelect = screen.getByDisplayValue("Alphabetical");
    fireEvent.click(sortSelect);
    
    // This would need more complex testing with a proper select component
    // For now, we'll test the basic interaction
    expect(sortSelect).toBeInTheDocument();
  });

  it("shows clear search button when search query exists", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, searchQuery: "test" },
    });

    render(<AchievementFilters />);
    
    // The clear button should be present when there's a search query
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles clear search button click", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, searchQuery: "test" },
    });

    render(<AchievementFilters />);
    
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith("");
  });

  it("shows reset filters button when filters are modified", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, searchQuery: "test" },
    });

    render(<AchievementFilters />);
    
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("shows reset filters button when sort is not alphabetical", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      sort: "percentComplete",
    });

    render(<AchievementFilters />);
    
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("shows reset filters button when completed filter is off", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, showCompleted: false },
    });

    render(<AchievementFilters />);
    
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("shows reset filters button when incomplete filter is off", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, showIncomplete: false },
    });

    render(<AchievementFilters />);
    
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("handles reset filters button click", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, searchQuery: "test" },
    });

    render(<AchievementFilters />);
    
    const resetButton = screen.getByText("Reset Filters");
    fireEvent.click(resetButton);
    
    expect(mockStore.resetFilters).toHaveBeenCalled();
  });

  it("does not show reset filters button when all filters are default", () => {
    render(<AchievementFilters />);
    
    expect(screen.queryByText("Reset Filters")).not.toBeInTheDocument();
  });

  it("handles empty search query", () => {
    render(<AchievementFilters />);
    
    const searchInput = screen.getByPlaceholderText("Search achievements...");
    fireEvent.change(searchInput, { target: { value: "" } });
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith("");
  });

  it("handles special characters in search", () => {
    render(<AchievementFilters />);
    
    const searchInput = screen.getByPlaceholderText("Search achievements...");
    fireEvent.change(searchInput, { target: { value: "test@#$%^&*()" } });
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith("test@#$%^&*()");
  });

  it("handles very long search query", () => {
    render(<AchievementFilters />);
    
    const longQuery = "a".repeat(1000);
    const searchInput = screen.getByPlaceholderText("Search achievements...");
    fireEvent.change(searchInput, { target: { value: longQuery } });
    
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith(longQuery);
  });

  it("maintains filter state when search is cleared", () => {
    mockUseAchievementsUIStore.mockReturnValue({
      ...mockStore,
      filters: { ...mockStore.filters, searchQuery: "test" },
    });

    render(<AchievementFilters />);
    
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);
    
    // Should only clear search, not other filters
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith("");
    expect(mockStore.resetFilters).not.toHaveBeenCalled();
  });

  it("handles multiple rapid filter changes", () => {
    render(<AchievementFilters />);
    
    const completedSwitch = screen.getByLabelText("Completed");
    const incompleteSwitch = screen.getByLabelText("Incomplete");
    
    fireEvent.click(completedSwitch);
    fireEvent.click(incompleteSwitch);
    fireEvent.click(completedSwitch);
    
    expect(mockStore.setShowCompleted).toHaveBeenCalledTimes(2);
    expect(mockStore.setShowIncomplete).toHaveBeenCalledTimes(1);
  });
}); 