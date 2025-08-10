import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mb-2" />
      <p>{message}</p>
    </div>
  );
}
