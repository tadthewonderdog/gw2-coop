# Code Cleanup TODO - Remaining Tasks

## Overview

This document outlines the remaining code cleanup tasks after completing Phases 1-3. The current status shows all major type safety, error handling, and performance tasks are complete. The next steps focus on polish, documentation, testing, and ongoing improvements.

## Current Status

- **Total warnings reduced:** 66 → 0 (100% improvement)
- **Completed phases:** 1-5 (Unused variables, Type safety basics, React hooks, Advanced Type Safety, Performance)
- **Completed tasks:** 4.1.1, 4.1.2, 4.2.1, 4.2.2, 4.3.1, 4.4.1, 5.1.1, 5.1.2, 5.2.1 (see below)
- **Remaining warnings:** 0
- **Next:** See 'Next Steps: Post-Cleanup Roadmap' below

- **Total warnings reduced:** 66 → 2 (97% improvement)
- **Completed phases:** 1-3 (Unused variables, Type safety basics, React hooks)
- **Completed tasks:** 4.1.1, 4.1.2, 4.2.1, 4.2.2, 4.3.1 (Custom Type Guards, Category Type Safety, Error Types, Error Boundaries, Safe Achievement Processing)
- **Remaining warnings:** 2 (all in `src/pages/Achievements.tsx`)

## Phase 4: Advanced Type Safety & Error Handling

### 4.1 Deep Type Inference Improvements

#### ✅ Task 4.1.1: Create Custom Type Guards

**File:** `src/types/achievement-schemas.ts`
**Status:** COMPLETED
**Goal:** Create proper type guards for runtime validation

```typescript
// ✅ Added these type guard functions
export function isAchievementCategory(obj: unknown): obj is AchievementCategory {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "achievements" in obj &&
    Array.isArray((obj as Record<string, unknown>).achievements)
  );
}

export function isAchievementArray(arr: unknown): arr is Achievement[] {
  return Array.isArray(arr) && arr.every((item) => AchievementSchema.safeParse(item).success);
}
```

#### ✅ Task 4.1.2: Improve Category Type Safety

**File:** `src/pages/Achievements.tsx`
**Status:** COMPLETED
**Goal:** Replace unsafe member access with proper type guards

```typescript
// ✅ Replaced current validation with:
const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
if (!selectedCategory || !isAchievementCategory(selectedCategory)) {
  throw new Error("Category not found or invalid");
}

// Now TypeScript knows selectedCategory.achievements is properly typed
const achievementIds = selectedCategory.achievements.map((a: number | { id: number }) =>
  typeof a === "number" ? a : a.id
);
```

### 4.2 Error Handling Pattern Standardization

#### ✅ Task 4.2.1: Create Error Types

**File:** `src/types/errors.ts` (new file)
**Status:** COMPLETED
**Goal:** Define proper error types for better type safety

```typescript
// ✅ Added comprehensive error types and type guards
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

export interface ValidationError {
  message: string;
  field?: string;
  value?: unknown;
}

export type AppError = APIError | ValidationError | Error;

export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
```

#### ✅ Task 4.2.2: Implement Error Boundaries

**File:** `src/components/ErrorBoundary.tsx`
**Status:** COMPLETED
**Goal:** Improve error boundary with proper typing

```typescript
// ✅ Added proper error handling with type guards
interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorInfo?: React.ErrorInfo;
}

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  const appError: AppError = error;
  this.setState({ error: appError, errorInfo });
}

private getErrorMessage(): string {
  if (!this.state.error || !this.state.error.message) {
    return "We're sorry, but something went wrong. Please try refreshing the page.";
  }
  return this.state.error.message;
}
```

### 4.3 Achievement Data Processing Improvements

#### ✅ Task 4.3.1: Safe Achievement Processing

**File:** `src/pages/Achievements.tsx`
**Lines:** 165
**Status:** COMPLETED
**Goal:** Fix unsafe return and member access

```typescript
// ✅ Replaced currentAchievements useMemo with:
const currentAchievements = useMemo((): Achievement[] | null => {
  if (!selectedCategoryId || !achievements[selectedCategoryId]) return null;

  const categoryAchievements = achievements[selectedCategoryId];
  if (!isAchievementArray(categoryAchievements)) {
    console.error("Invalid achievement data for category:", selectedCategoryId);
    return null;
  }

  const filteredAchievements = categoryAchievements.filter((achievement: Achievement) => {
    const accountAchievement = accountAchievementMap[achievement.id];
    const isCompleted = accountAchievement?.done;

    // Apply filters with proper typing
    if (isCompleted && !filters.showCompleted) return false;
    if (!isCompleted && !filters.showIncomplete) return false;

    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesName = achievement.name.toLowerCase().includes(searchLower);
      const matchesDesc = achievement.description?.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesDesc) return false;
    }

    return true;
  });

  return filteredAchievements.sort((a: Achievement, b: Achievement) => {
    // ... existing sorting logic with proper typing
  });
}, [selectedCategoryId, achievements, accountAchievementMap, filters, sort]);
```

### 4.4 Zod Schema Enhancements

#### Task 4.4.1: Improve Achievement Schemas

**File:** `src/types/achievement-schemas.ts`
**Goal:** Add more specific validation rules

```typescript
// Enhance existing schemas with better validation
export const AchievementCategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  description: z.string().optional(),
  achievements: z.array(z.union([z.number(), z.object({ id: z.number() })])),
  order: z.number().optional(),
});

// Add runtime validation helpers
export function validateAchievementCategory(data: unknown): AchievementCategory {
  return AchievementCategorySchema.parse(data);
}
```

## Phase 5: Performance Optimizations

### 5.1 React Performance Improvements

#### Task 5.1.1: Memoize Expensive Components

**File:** `src/components/achievements/AchievementCard.tsx`
**Goal:** Add React.memo for performance

```typescript
export const AchievementCard = React.memo<AchievementCardProps>(
  ({ achievement, accountAchievement }) => {
    // Component implementation
  }
);
```

#### Task 5.1.2: Optimize Achievement Filters

**File:** `src/components/achievements/AchievementFilters.tsx`
**Goal:** Memoize filter calculations

```typescript
const filteredAchievements = useMemo(() => {
  // Filter logic
}, [achievements, filters]);
```

### 5.2 Code Splitting

#### Task 5.2.1: Lazy Load Heavy Components

**File:** `src/pages/Achievements.tsx`
**Goal:** Implement lazy loading for better performance

```typescript
const AchievementCard = lazy(() => import("@/components/achievements/AchievementCard"));
const AchievementFilters = lazy(() => import("@/components/achievements/AchievementFilters"));
```

## Implementation Priority

### High Priority (Fix remaining warnings)

1. ✅ **Task 4.1.1** - Create Custom Type Guards
2. ✅ **Task 4.1.2** - Improve Category Type Safety
3. ✅ **Task 4.3.1** - Safe Achievement Processing

### Medium Priority (Improve robustness)

4. ✅ **Task 4.2.1** - Create Error Types
5. ✅ **Task 4.2.2** - Implement Error Boundaries
6. **Task 4.4.1** - Improve Achievement Schemas

### Low Priority (Performance)

7. **Task 5.1.1** - Memoize Expensive Components
8. **Task 5.1.2** - Optimize Achievement Filters
9. **Task 5.2.1** - Lazy Load Heavy Components

## Testing Strategy

### For Each Task:

1. **Unit Tests:** Add/update tests for new type guards and error handling
2. **Integration Tests:** Verify error boundaries work correctly
3. **Type Tests:** Ensure TypeScript compilation passes
4. **Lint Tests:** Verify warnings are reduced

### Test Files to Update:

- `src/test/achievements-ui.test.ts`
- `src/pages/__tests__/Achievements.test.tsx`
- `src/components/__tests__/ErrorBoundary.test.tsx`

## Success Criteria

### Phase 4 Complete When:

- [ ] All 4 remaining warnings are resolved
- [ ] Type safety is improved without breaking functionality
- [ ] Error handling is more robust and type-safe
- [ ] All tests continue to pass

### Phase 5 Complete When:

- [ ] Performance is measurably improved
- [ ] Bundle size is optimized
- [ ] User experience is enhanced

## Notes

- **Conservative Approach:** Each change should be made incrementally with thorough testing
- **Backward Compatibility:** Ensure all changes maintain existing functionality
- **Documentation:** Update relevant documentation as changes are made
- **Code Review:** Each major change should be reviewed before merging

## Estimated Effort

- **Phase 4:** 1-2 days (remaining type safety work)
- **Phase 5:** 1-2 days (performance optimizations)

**Total Estimated Effort:** 2-4 days for complete cleanup
