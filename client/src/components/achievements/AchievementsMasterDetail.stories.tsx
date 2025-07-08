import { useState } from 'react';
import { AchievementsAccordionGroup } from './AchievementsAccordionGroup';
import { AchievementCard } from './AchievementCard';
import type { AchievementGroup, AchievementCategory, Achievement, AccountAchievement } from '@/types/achievements';

const mockGroups: AchievementGroup[] = [
  {
    id: '1',
    name: 'Group 1',
    icon: '',
    order: 1,
    categories: [1, 2],
  },
];

const mockCategories: AchievementCategory[] = [
  {
    id: 1,
    name: 'Category 1',
    icon: '',
    order: 1,
    achievements: [101, 102],
  },
  {
    id: 2,
    name: 'Category 2',
    icon: '',
    order: 2,
    achievements: [103],
  },
];

const mockAchievements: Achievement[] = [
  {
    id: 101,
    name: 'Defeat the Dragon',
    description: 'Slay the legendary dragon in the mountains.',
    icon: '',
    points: 10,
    type: 'Combat',
    flags: [],
  },
  {
    id: 102,
    name: 'Secret Achievement',
    description: 'Find the hidden cave.',
    icon: '',
    points: 5,
    type: 'Exploration',
    flags: ['RequiresUnlock'],
  },
  {
    id: 103,
    name: 'Speed Runner',
    description: 'Complete the dungeon in under 10 minutes.',
    icon: '',
    points: 15,
    type: 'Challenge',
    flags: [],
  },
];

const mockAccountAchievements: AccountAchievement[] = [
  { id: 101, current: 1, max: 1, done: true },
  { id: 102, current: 0, max: 1, done: false },
  { id: 103, current: 0, max: 1, done: false },
];

export default {
  title: 'Achievements/MasterDetail',
};

export const MasterDetail = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('1');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(1);

  // Filter achievements for selected category
  const currentCategory = mockCategories.find((cat) => cat.id === selectedCategoryId);
  const achievementIds = currentCategory?.achievements.map((a) => (typeof a === 'number' ? a : a.id)) || [];
  const currentAchievements = mockAchievements.filter((a) => achievementIds.includes(a.id));

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 320 }}>
        <AchievementsAccordionGroup
          groups={mockGroups}
          categories={mockCategories}
          selectedGroupId={selectedGroupId}
          selectedCategoryId={selectedCategoryId}
          onSelectGroup={setSelectedGroupId}
          onSelectCategory={(catId, groupId) => {
            setSelectedGroupId(groupId);
            setSelectedCategoryId(catId);
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        {currentAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            accountAchievement={mockAccountAchievements.find((aa) => aa.id === achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}; 