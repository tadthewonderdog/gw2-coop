import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AchievementsAccordionGroup } from './AchievementsAccordionGroup';
import type { AchievementGroup, AchievementCategory } from '@/types/achievements';

const mockGroups: AchievementGroup[] = [
  {
    id: '1',
    name: 'Group 1',
    icon: '',
    order: 1,
    categories: [1, 2],
  },
  {
    id: '2',
    name: 'Group 2',
    icon: '',
    order: 2,
    categories: [3],
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
  {
    id: 3,
    name: 'Category 3',
    icon: '',
    order: 1,
    achievements: [104],
  },
];

const meta: Meta<typeof AchievementsAccordionGroup> = {
  title: 'Achievements/MasterAccordion',
  component: AchievementsAccordionGroup,
};
export default meta;

type Story = StoryObj<typeof AchievementsAccordionGroup>;

export const Default: Story = {
  render: () => {
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>('1');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(1);
    return (
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
    );
  },
}; 