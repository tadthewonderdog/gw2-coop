import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-destructive">
      <AlertCircle className="h-6 w-6 mb-2" />
      <p>{message}</p>
    </div>
  );
}
