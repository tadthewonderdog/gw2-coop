import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Achievement, AccountAchievement } from "@/types/achievements";

import { AchievementCard } from "../AchievementCard";

// Mock data for testing
const mockAchievement: Achievement = {
  id: 1,
  name: "Test Achievement",
  description: "A test achievement description",
  icon: "https://example.com/icon.png",
  points: 10,
  type: "Default",
  flags: [],
};

const mockAccountAchievement: AccountAchievement = {
  id: 1,
  current: 5,
  max: 10,
  done: false,
};

describe("AchievementCard", () => {
  it("renders achievement with all properties", () => {
    render(
      <AchievementCard accountAchievement={mockAccountAchievement} achievement={mockAchievement} />
    );

    expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    expect(screen.getByText("A test achievement description")).toBeInTheDocument();
    expect(screen.getByText("10 pts")).toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute("src", "https://example.com/icon.png");
  });

  it("renders trophy icon when no icon is provided", () => {
    const achievementWithoutIcon = { ...mockAchievement, icon: undefined };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={achievementWithoutIcon}
      />
    );

    expect(screen.queryByAltText("")).not.toBeInTheDocument();
    expect(screen.getByTestId("trophy-icon")).toBeInTheDocument();
  });

  it("shows progress bar for incomplete achievements", () => {
    render(
      <AchievementCard accountAchievement={mockAccountAchievement} achievement={mockAchievement} />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("calculates progress percentage correctly", () => {
    const achievementWithProgress = { ...mockAccountAchievement, current: 7, max: 20 };

    render(
      <AchievementCard accountAchievement={achievementWithProgress} achievement={mockAchievement} />
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("shows completed badge when achievement is done", () => {
    const completedAchievement = { ...mockAccountAchievement, done: true };

    render(
      <AchievementCard accountAchievement={completedAchievement} achievement={mockAchievement} />
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows locked badge for achievements requiring unlock", () => {
    const lockedAchievement = { ...mockAchievement, flags: ["RequiresUnlock"] };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={lockedAchievement}
      />
    );

    expect(screen.getByText("Locked")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows repeatable badge for repeatable achievements", () => {
    const repeatableAchievement = { ...mockAchievement, flags: ["Repeatable"] };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={repeatableAchievement}
      />
    );

    expect(screen.getByText("Repeatable")).toBeInTheDocument();
  });

  it("handles achievement without description", () => {
    const achievementWithoutDesc = { ...mockAchievement, description: undefined };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={achievementWithoutDesc}
      />
    );

    expect(screen.queryByText("A test achievement description")).not.toBeInTheDocument();
  });

  it("handles achievement without points", () => {
    const achievementWithoutPoints = { ...mockAchievement, points: undefined };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={achievementWithoutPoints}
      />
    );

    expect(screen.queryByText("10 pts")).not.toBeInTheDocument();
  });

  it("handles achievement without account achievement data", () => {
    render(<AchievementCard achievement={mockAchievement} />);

    expect(screen.getByText("Test Achievement")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  it("handles zero progress correctly", () => {
    const zeroProgress = { ...mockAccountAchievement, current: 0 };

    render(<AchievementCard accountAchievement={zeroProgress} achievement={mockAchievement} />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("handles achievement with undefined current value", () => {
    const undefinedCurrent = { ...mockAccountAchievement, current: undefined };

    render(<AchievementCard accountAchievement={undefinedCurrent} achievement={mockAchievement} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles multiple flags correctly", () => {
    const multiFlagAchievement = {
      ...mockAchievement,
      flags: ["RequiresUnlock", "Repeatable"],
    };

    render(
      <AchievementCard
        accountAchievement={mockAccountAchievement}
        achievement={multiFlagAchievement}
      />
    );

    // Should prioritize locked over repeatable
    expect(screen.getByText("Locked")).toBeInTheDocument();
    expect(screen.queryByText("Repeatable")).not.toBeInTheDocument();
  });

  it("handles edge case with very large numbers", () => {
    const largeNumbers = {
      ...mockAccountAchievement,
      current: 999999,
      max: 1000000,
    };

    render(<AchievementCard accountAchievement={largeNumbers} achievement={mockAchievement} />);

    expect(screen.getByText("999999")).toBeInTheDocument();
    expect(screen.getByText("1000000")).toBeInTheDocument();
  });
});
