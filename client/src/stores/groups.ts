import { create } from "zustand";

/**
 * Zustand store state for user groups and group membership management.
 */
export interface GroupMember {
  id: string;
  name: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  createdAt: string;
}

/**
 * Zustand store for managing user groups and group members.
 */
interface GroupStore {
  groups: Group[];
  addGroup: (name: string) => void;
  addMember: (groupId: string, name: string) => void;
  removeGroup: (id: string) => void;
  removeMember: (groupId: string, memberId: string) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  addGroup: (name) =>
    set((state) => ({
      groups: [
        ...state.groups,
        {
          id: Math.random().toString(),
          name,
          members: [],
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  addMember: (groupId, name) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: [
                ...group.members,
                {
                  id: Math.random().toString(),
                  name,
                  joinedAt: new Date().toISOString(),
                },
              ],
            }
          : group
      ),
    })),
  removeGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    })),
  removeMember: (groupId, memberId) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter((member) => member.id !== memberId),
            }
          : group
      ),
    })),
}));
