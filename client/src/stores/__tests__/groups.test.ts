import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useGroupStore } from "../groups";

describe("Group Store", () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useGroupStore.setState({
        groups: [],
      });
    });
  });

  describe("Initial State", () => {
    it("should have empty initial state", () => {
      const { result } = renderHook(() => useGroupStore());
      
      expect(result.current.groups).toEqual([]);
    });
  });

  describe("addGroup", () => {
    it("should add a new group to the store", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe("Test Group");
      expect(result.current.groups[0].members).toEqual([]);
      expect(result.current.groups[0].id).toBeDefined();
      expect(result.current.groups[0].createdAt).toBeDefined();
    });

    it("should add multiple groups", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        result.current.addGroup("Group 3");
      });
      
      expect(result.current.groups).toHaveLength(3);
      expect(result.current.groups[0].name).toBe("Group 1");
      expect(result.current.groups[1].name).toBe("Group 2");
      expect(result.current.groups[2].name).toBe("Group 3");
    });

    it("should handle empty group name", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("");
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe("");
    });

    it("should handle very long group name", () => {
      const { result } = renderHook(() => useGroupStore());
      const longName = "a".repeat(1000);
      
      act(() => {
        result.current.addGroup(longName);
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe(longName);
    });

    it("should handle special characters in group name", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test@#$%^&*() Group");
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe("Test@#$%^&*() Group");
    });
  });

  describe("addMember", () => {
    it("should add a member to an existing group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Test Member");
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[0].members[0].name).toBe("Test Member");
      expect(result.current.groups[0].members[0].id).toBeDefined();
      expect(result.current.groups[0].members[0].joinedAt).toBeDefined();
    });

    it("should add multiple members to a group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        result.current.addMember(groupId, "Member 2");
        result.current.addMember(groupId, "Member 3");
      });
      
      expect(result.current.groups[0].members).toHaveLength(3);
      expect(result.current.groups[0].members[0].name).toBe("Member 1");
      expect(result.current.groups[0].members[1].name).toBe("Member 2");
      expect(result.current.groups[0].members[2].name).toBe("Member 3");
    });

    it("should not affect other groups when adding member", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        const group1Id = result.current.groups[0].id;
        result.current.addMember(group1Id, "Member 1");
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[1].members).toHaveLength(0);
    });

    it("should handle adding member to non-existent group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        result.current.addMember("non-existent-id", "Test Member");
      });
      
      expect(result.current.groups[0].members).toHaveLength(0);
    });

    it("should handle empty member name", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "");
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[0].members[0].name).toBe("");
    });

    it("should handle very long member name", () => {
      const { result } = renderHook(() => useGroupStore());
      const longName = "a".repeat(1000);
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, longName);
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[0].members[0].name).toBe(longName);
    });
  });

  describe("removeGroup", () => {
    it("should remove an existing group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        const group1Id = result.current.groups[0].id;
        result.current.removeGroup(group1Id);
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe("Group 2");
    });

    it("should remove group with all its members", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        result.current.addMember(groupId, "Member 2");
        result.current.removeGroup(groupId);
      });
      
      expect(result.current.groups).toHaveLength(0);
    });

    it("should handle removing non-existent group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        result.current.removeGroup("non-existent-id");
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].name).toBe("Test Group");
    });

    it("should handle removing from empty store", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.removeGroup("some-id");
      });
      
      expect(result.current.groups).toHaveLength(0);
    });
  });

  describe("removeMember", () => {
    it("should remove a member from a group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        result.current.addMember(groupId, "Member 2");
        const member1Id = result.current.groups[0].members[0].id;
        result.current.removeMember(groupId, member1Id);
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[0].members[0].name).toBe("Member 2");
    });

    it("should not affect other groups when removing member", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        const group1Id = result.current.groups[0].id;
        const group2Id = result.current.groups[1].id;
        result.current.addMember(group1Id, "Member 1");
        result.current.addMember(group2Id, "Member 2");
        const member1Id = result.current.groups[0].members[0].id;
        result.current.removeMember(group1Id, member1Id);
      });
      
      expect(result.current.groups[0].members).toHaveLength(0);
      expect(result.current.groups[1].members).toHaveLength(1);
    });

    it("should handle removing member from non-existent group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        const memberId = result.current.groups[0].members[0].id;
        result.current.removeMember("non-existent-group-id", memberId);
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
    });

    it("should handle removing non-existent member", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        result.current.removeMember(groupId, "non-existent-member-id");
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
    });

    it("should handle removing member from empty group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.removeMember(groupId, "some-member-id");
      });
      
      expect(result.current.groups[0].members).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple rapid operations", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        const group1Id = result.current.groups[0].id;
        const group2Id = result.current.groups[1].id;
        result.current.addMember(group1Id, "Member 1");
        result.current.addMember(group2Id, "Member 2");
        result.current.removeMember(group1Id, result.current.groups[0].members[0].id);
        result.current.removeGroup(group2Id);
      });
      
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].members).toHaveLength(0);
    });

    it("should handle large number of groups", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        // Add 100 groups
        for (let i = 0; i < 100; i++) {
          result.current.addGroup(`Group ${i}`);
        }
      });
      
      expect(result.current.groups).toHaveLength(100);
    });

    it("should handle large number of members in a group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        // Add 100 members
        for (let i = 0; i < 100; i++) {
          result.current.addMember(groupId, `Member ${i}`);
        }
      });
      
      expect(result.current.groups[0].members).toHaveLength(100);
    });

    it("should handle removing all members from a group", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Test Group");
        const groupId = result.current.groups[0].id;
        result.current.addMember(groupId, "Member 1");
        result.current.addMember(groupId, "Member 2");
        result.current.addMember(groupId, "Member 3");
        
        // Remove all members
        result.current.groups[0].members.forEach(member => {
          result.current.removeMember(groupId, member.id);
        });
      });
      
      expect(result.current.groups[0].members).toHaveLength(0);
    });

    it("should handle concurrent operations on different groups", () => {
      const { result } = renderHook(() => useGroupStore());
      
      act(() => {
        result.current.addGroup("Group 1");
        result.current.addGroup("Group 2");
        const group1Id = result.current.groups[0].id;
        const group2Id = result.current.groups[1].id;
        
        // Add members to both groups
        result.current.addMember(group1Id, "Member 1");
        result.current.addMember(group2Id, "Member 2");
        result.current.addMember(group1Id, "Member 3");
        result.current.addMember(group2Id, "Member 4");
        
        // Remove from both groups
        result.current.removeMember(group1Id, result.current.groups[0].members[0].id);
        result.current.removeMember(group2Id, result.current.groups[1].members[0].id);
      });
      
      expect(result.current.groups[0].members).toHaveLength(1);
      expect(result.current.groups[1].members).toHaveLength(1);
    });
  });
}); 