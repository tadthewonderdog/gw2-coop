import type { Meta, StoryObj } from "@storybook/react-vite";

import type { Achievement, AccountAchievement } from "@/types/achievements";

import { AchievementCard } from "./AchievementCard";

const mockAchievement: Achievement = {
  id: 101,
  name: "Defeat the Dragon",
  description: "Slay the legendary dragon in the mountains.",
  icon: "",
  points: 10,
  type: "Combat",
  flags: [],
};

const completedAccount: AccountAchievement = {
  id: 101,
  current: 1,
  max: 1,
  done: true,
};

const lockedAchievement: Achievement = {
  ...mockAchievement,
  id: 102,
  name: "Secret Achievement",
  flags: ["RequiresUnlock"],
};

const meta: Meta<typeof AchievementCard> = {
  title: "Achievements/DetailCard",
  component: AchievementCard,
};
export default meta;

type Story = StoryObj<typeof AchievementCard>;

export const Default: Story = {
  args: {
    achievement: mockAchievement,
    accountAchievement: { id: 101, current: 0, max: 1, done: false },
  },
};

export const Completed: Story = {
  args: {
    achievement: mockAchievement,
    accountAchievement: completedAccount,
  },
};

export const Locked: Story = {
  args: {
    achievement: lockedAchievement,
    accountAchievement: undefined,
  },
};
