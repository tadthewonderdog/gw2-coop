import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Achievement, AccountAchievement } from "@/types/achievements";

interface AchievementCardProps {
  achievement: Achievement;
  accountAchievement?: AccountAchievement;
}

export const AchievementCard = memo(function AchievementCard({
  achievement,
  accountAchievement,
}: AchievementCardProps) {
  // Calculate progress percentage
  const progress =
    accountAchievement?.current && accountAchievement?.max
      ? (accountAchievement.current / accountAchievement.max) * 100
      : 0;

  // Determine achievement status
  const isCompleted = accountAchievement?.done;
  const isLocked = achievement.flags?.includes("RequiresUnlock");
  const isRepeatable = achievement.flags?.includes("Repeatable");

  return (
    <div className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        {achievement.icon ? (
          <img alt="" className="w-8 h-8 rounded-sm" src={achievement.icon} />
        ) : (
          <div className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center">
            <Trophy className="w-5 h-5 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{achievement.name}</h3>
            {achievement.points !== undefined && (
              <Badge className="ml-auto" variant="secondary">
                {achievement.points} pts
              </Badge>
            )}
          </div>

          {/* Description */}
          {achievement.description && (
            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
          )}

          {/* Progress */}
          {!isCompleted && !isLocked && accountAchievement?.max && (
            <div className="mt-2">
              <Progress className="h-2" value={progress} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{accountAchievement.current || 0}</span>
                <span>{accountAchievement.max}</span>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            {isCompleted ? (
              <Badge
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
                variant="default"
              >
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </Badge>
            ) : isLocked ? (
              <Badge className="flex items-center gap-1" variant="destructive">
                <Lock className="w-3 h-3" />
                Locked
              </Badge>
            ) : isRepeatable ? (
              <Badge className="flex items-center gap-1" variant="secondary">
                <Trophy className="w-3 h-3" />
                Repeatable
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});
