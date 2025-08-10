import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { AchievementGroup, AchievementCategory } from "@/types/achievements";

interface AchievementsAccordionGroupProps {
  groups: AchievementGroup[];
  categories: AchievementCategory[];
  selectedGroupId: string | null;
  selectedCategoryId: number | null;
  onSelectGroup: (groupId: string) => void;
  onSelectCategory: (catId: number, groupId: string) => void;
}

export function AchievementsAccordionGroup({
  groups,
  categories,
  selectedGroupId,
  selectedCategoryId,
  onSelectGroup,
  onSelectCategory,
}: AchievementsAccordionGroupProps) {
  // Map categories by id for fast lookup
  const categoryMap = categories.reduce(
    (acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    },
    {} as Record<number, AchievementCategory>
  );

  return (
    <Accordion
      collapsible
      className="w-full"
      type="single"
      value={selectedGroupId || ""}
      onValueChange={(groupId) => {
        onSelectGroup(groupId || "");
      }}
    >
      {groups
        .sort((a, b) => a.order - b.order)
        .map((group) => (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                {group.icon && (
                  <img alt="" className="w-5 h-5 inline-block mr-1" src={group.icon} />
                )}
                {group.name}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-1">
                {group.categories
                  .map(
                    (catId) => categoryMap[typeof catId === "string" ? parseInt(catId, 10) : catId]
                  )
                  .filter((cat): cat is AchievementCategory => Boolean(cat))
                  .sort((a, b) => a.order - b.order)
                  .map((cat) => (
                    <li key={cat.id}>
                      <button
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors text-left ${
                          selectedCategoryId === cat.id ? "bg-accent/60 font-semibold" : ""
                        }`}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id, group.id);
                        }}
                      >
                        {cat.icon && (
                          <img alt="" className="w-4 h-4 inline-block mr-1" src={cat.icon} />
                        )}
                        {cat.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
