export interface Achievement {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  points?: number;
  type: string;
  flags: string[];
  requirement?: string;
  locked_text?: string;
  requirements?: Array<{
    type: string;
    text: string;
  }>;
  rewards?: Array<{
    type: string;
    id?: number;
    count?: number;
  }>;
  category?: number;
}

export interface AchievementCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  achievements: Array<
    | number
    | {
        id: number;
        required_access?: {
          product: string;
          condition: string;
        };
        flags?: string[];
        level?: [number, number];
      }
  >;
  tomorrow?: Array<{
    id: number;
    required_access?: {
      product: string;
      condition: string;
    };
  }>;
}

export interface AchievementGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  categories: Array<string | number>;
}

export interface AccountAchievement {
  id: number;
  current?: number;
  max?: number;
  done: boolean;
  repeated?: number;
  unlocked?: boolean;
  bits?: number[];
}
