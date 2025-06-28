import { Search, X } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAchievementsUIStore } from "@/stores/achievements-ui";

export const AchievementFilters = memo(function AchievementFilters() {
  const {
    filters,
    sort,
    setShowCompleted,
    setShowIncomplete,
    setSearchQuery,
    setSort,
    resetFilters,
  } = useAchievementsUIStore();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search achievements..."
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filters.searchQuery && (
          <Button
            className="absolute right-1 top-1 h-7 w-7"
            size="icon"
            variant="ghost"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-4">
        {/* Completion Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.showCompleted}
              id="show-completed"
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed">Completed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.showIncomplete}
              id="show-incomplete"
              onCheckedChange={setShowIncomplete}
            />
            <Label htmlFor="show-incomplete">Incomplete</Label>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <Label className="whitespace-nowrap" htmlFor="sort">
            Sort by:
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]" id="sort">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="percentComplete">Completion %</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Button */}
      {(filters.searchQuery ||
        !filters.showCompleted ||
        !filters.showIncomplete ||
        sort !== "alphabetical") && (
        <Button className="w-full" size="sm" variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      )}
    </div>
  );
});
