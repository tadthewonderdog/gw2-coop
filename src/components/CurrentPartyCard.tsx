import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { APIKey } from "@/stores/api-keys";

// Placeholder type for party member info (future: move to types/party.ts)
export interface PartyMemberInfo {
  name: string;
  accountName?: string;
  color: string;
  isCurrentPlayer: boolean;
}

// Utility: assign a color to each member (simple palette)
const PARTY_COLORS = [
  "#e57373", // red
  "#64b5f6", // blue
  "#81c784", // green
  "#ffd54f", // yellow
  "#ba68c8", // purple
  "#4db6ac", // teal
  "#ffb74d", // orange
  "#a1887f", // brown
];

interface CurrentPartyCardProps {
  apiKey: string;
  allApiKeys: APIKey[];
}

export function CurrentPartyCard({ apiKey, allApiKeys }: CurrentPartyCardProps) {
  const [partyMembers, setPartyMembers] = useState<PartyMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPartyMembers([]);

    function fetchParty() {
      try {
        // Placeholder: Simulate fetching current character
        // Replace with real API call in the future
        const char = { name: "Unknown Character" };
        if (!isMounted) return;
        const accountName = allApiKeys.find((k) => k.key === apiKey)?.accountName;
        const members: PartyMemberInfo[] = [
          {
            name: char.name,
            accountName,
            color: PARTY_COLORS[0],
            isCurrentPlayer: true,
          },
        ];
        setPartyMembers(members);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load party info");
      } finally {
        setLoading(false);
      }
    }
    fetchParty();
    return () => {
      isMounted = false;
    };
  }, [apiKey, allApiKeys]);

  return (
    <Card className="mb-6 bg-background/70 backdrop-blur-sm border-primary/30">
      <CardHeader>
        <CardTitle className="text-foreground font-serif text-base">Current Party</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading party info...</div>
        ) : error ? (
          <div className="text-destructive text-sm">{error}</div>
        ) : partyMembers.length === 0 ? (
          <div className="text-muted-foreground text-sm">No party members found.</div>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {partyMembers.map((member) => (
              <li
                key={member.name}
                className="flex items-center gap-2 px-3 py-1 rounded-md border"
                style={{ borderColor: member.color, background: member.color + "22" }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: member.color }}
                />
                <span className="font-medium">{member.name}</span>
                {member.accountName && (
                  <span className="text-xs text-muted-foreground ml-1">({member.accountName})</span>
                )}
                {member.isCurrentPlayer && <span className="ml-2 text-xs text-primary">You</span>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
