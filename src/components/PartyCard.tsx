import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { APIKey } from "@/stores/api-keys";

const PARTY_COLORS = [
  "#e57373",
  "#64b5f6",
  "#81c784",
  "#ffd54f",
  "#ba68c8",
  "#4db6ac",
  "#ffb74d",
  "#a1887f",
];

function getTextColor(bg: string) {
  if (!bg.startsWith("#") || bg.length !== 7) return "text-white";
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "text-black" : "text-white";
}

interface PartyCardProps {
  apiKeys: APIKey[];
}

export function PartyCard({ apiKeys }: PartyCardProps) {
  const selectedKeys = apiKeys.filter((key) => key.isSelected);

  return (
    <div className="w-full flex justify-center mt-2 mb-4">
      <Card className="max-w-md w-auto bg-card/80 border border-primary/20 shadow-md rounded-xl px-4 py-2">
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wide text-center">
            Party
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center">
          {selectedKeys.length === 0 ? (
            <div className="text-xs text-muted-foreground py-2">No selected party members</div>
          ) : (
            <ul className="flex flex-wrap gap-2 justify-center py-1">
              {selectedKeys.map((key, idx) => {
                const bg = PARTY_COLORS[idx % PARTY_COLORS.length];
                const text = getTextColor(bg);
                return (
                  <li
                    key={key.id}
                    className={`flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm border border-white/30`}
                    style={{ background: bg, color: text === "text-white" ? "#fff" : "#222" }}
                  >
                    {key.accountName}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
