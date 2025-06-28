import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface GroupMember {
  id: string;
  name: string;
  isLeader: boolean;
}

interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  maxSize: number;
}

const MAX_GROUPS_PER_USER = 3;
const MAX_GROUP_SIZE = 10;

const pageHeaderClasses = cn("text-center mb-12", "text-4xl font-bold font-serif tracking-wider");

const headerAccentClasses = cn("w-24 h-1 mx-auto mb-6", "bg-primary animate-shimmer");

const errorMessageClasses = cn(
  "mt-4 p-4",
  "bg-destructive/20 border-2 border-destructive/40",
  "rounded-md text-destructive",
  "shadow-lg shadow-destructive/20 backdrop-blur-sm"
);

const cardBaseClasses = cn(
  "bg-card/90 backdrop-blur-sm",
  "border-2 border-primary/30",
  "hover:border-primary/50",
  "transition-all duration-300",
  "shadow-lg shadow-primary/10"
);

const inputBaseClasses = cn(
  "w-full p-2",
  "bg-background/80",
  "border-2 border-primary/30",
  "rounded-md",
  "text-foreground placeholder-muted-foreground",
  "focus:border-primary focus:ring-1 focus:ring-primary",
  "transition-all"
);

const memberCountBadgeClasses = cn(
  "px-2 py-1 rounded-full text-sm",
  "bg-primary/10",
  "border border-primary/30",
  "text-primary/70"
);

const memberItemClasses = cn(
  "flex items-center justify-between",
  "p-2 rounded-md",
  "bg-background/50",
  "border border-primary/20"
);

export function GroupManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const validateGroupCreation = (groupName: string) => {
    if (groups.length >= MAX_GROUPS_PER_USER) {
      throw new Error(
        `Wow, you've reached the limit of ${MAX_GROUPS_PER_USER} groups! Time to join some adventures!`
      );
    }
    if (!groupName?.trim()) {
      throw new Error("Please give your group a name!");
    }
    if (groups.some((g) => g.name.toLowerCase() === groupName.toLowerCase())) {
      throw new Error("This group name is already taken. Try another one!");
    }
  };

  const validateMemberAddition = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) {
      throw new Error("Oops! We couldn't find this group.");
    }
    if (group.members.length >= group.maxSize) {
      throw new Error(`This group is full! The maximum is ${group.maxSize} members.`);
    }
    if (!newMemberName.trim()) {
      throw new Error("Please enter a name for the new member!");
    }
    if (group.members.some((m) => m.name.toLowerCase() === newMemberName.toLowerCase())) {
      throw new Error("Someone in the group already has this name. Try another one!");
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setDialogError(null);
      validateGroupCreation(newGroupName);

      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        members: [
          {
            id: "leader-" + Date.now(),
            name: "You",
            isLeader: true,
          },
        ],
        maxSize: MAX_GROUP_SIZE,
      };

      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setIsCreateDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create group";
      setDialogError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) return;

    try {
      setIsLoading(true);
      setError(null);
      validateMemberAddition(selectedGroupId);

      const updatedGroups = groups.map((group) => {
        if (group.id === selectedGroupId) {
          return {
            ...group,
            members: [
              ...group.members,
              {
                id: Date.now().toString(),
                name: newMemberName.trim(),
                isLeader: false,
              },
            ],
          };
        }
        return group;
      });

      setGroups(updatedGroups);
      setNewMemberName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleGroupKeyDown = (e: React.KeyboardEvent, groupId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleGroupClick(groupId);
    }
  };

  return (
    <main className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={cn(pageHeaderClasses, "text-primary")}>Group Manager</h1>
          <div className={headerAccentClasses}></div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create and manage your adventuring groups!
          </p>
          {error && (
            <div className={errorMessageClasses}>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Groups</h2>
          <Button
            className={cn(
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "shadow-lg shadow-primary/30",
              "border border-primary/50",
              "transform hover:scale-105 transition-all"
            )}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={cardBaseClasses}>
            <CardHeader>
              <CardTitle className="text-primary font-serif">Your Groups</CardTitle>
              <CardDescription>Select a group to manage members</CardDescription>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <p className="text-muted-foreground">
                  No groups yet! Create one to start adventuring together!
                </p>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={cn(
                        "p-4 rounded-md transition-all duration-300",
                        "border-2",
                        selectedGroupId === group.id
                          ? "border-primary/50 bg-primary/10"
                          : "border-primary/20 hover:border-primary/40"
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleGroupClick(group.id)}
                      onKeyDown={(e) => handleGroupKeyDown(e, group.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{group.name}</h3>
                        <span className={memberCountBadgeClasses}>
                          {group.members.length}/{group.maxSize}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedGroupId && (
            <Card className={cardBaseClasses}>
              <CardHeader>
                <CardTitle className="text-primary font-serif">Group Members</CardTitle>
                <CardDescription>Manage your group members</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleAddMember}>
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Add Member</Label>
                    <Input
                      className={inputBaseClasses}
                      id="memberName"
                      placeholder="Enter member name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={isLoading || !newMemberName.trim()}
                    type="submit"
                  >
                    Add Member
                  </Button>
                </form>
                {error && (
                  <div className={errorMessageClasses}>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div className="mt-6 space-y-2">
                  {groups
                    .find((g) => g.id === selectedGroupId)
                    ?.members.map((member) => (
                      <div key={member.id} className={memberItemClasses}>
                        <span>{member.name}</span>
                        {member.isLeader && <span className="text-xs text-primary">Leader</span>}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateGroup}>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                className={inputBaseClasses}
                id="groupName"
                placeholder="enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            {dialogError && (
              <div className={errorMessageClasses}>
                <p className="text-sm">{dialogError}</p>
              </div>
            )}
            <DialogFooter>
              <Button disabled={isLoading || !newGroupName.trim()} type="submit">
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
