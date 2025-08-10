import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { APIKey } from "@/stores/api-keys";

const keyCardClasses = cn(
  "bg-background",
  "border-2 border-border",
  "shadow-lg",
  "hover:border-primary/50 transition-all duration-300",
  "hover:scale-105 group"
);

interface APIKeyCardProps {
  apiKey: APIKey;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function APIKeyCard({ apiKey, onEdit, onRemove }: APIKeyCardProps) {
  return (
    <Card className={keyCardClasses} data-testid="api-key-item">
      <CardHeader>
        <CardTitle
          className="text-foreground font-serif group-hover:text-primary/70 transition-colors"
          data-testid={`key-name-${apiKey.id}`}
        >
          {apiKey.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          <span className="text-foreground">Account:</span>{" "}
          <span className="font-mono text-sm">{apiKey.accountName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2">
          <Button
            className="text-foreground hover:text-primary"
            size="sm"
            variant="outline"
            onClick={() => onEdit(apiKey.id)}
          >
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onRemove(apiKey.id)}>
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
