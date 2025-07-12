import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyApiKey, getCharacters } from "@/services/gw2-api";
import type { CharacterInfo } from "@/services/gw2-api";
import { type APIKey } from "@/stores/api-keys";

interface APIKeyDialogProps {
  error: string | null;
  initialData?: APIKey;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (key: APIKey) => void | Promise<void>;
  open: boolean;
}

export function APIKeyDialog({
  error,
  initialData,
  isLoading,
  onOpenChange,
  onSubmit,
  open,
}: APIKeyDialogProps) {
  const [nameInput, setNameInput] = useState(initialData?.name || "");
  const [keyInput, setKeyInput] = useState(initialData?.key || "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNameInput(initialData.name);
      setKeyInput(initialData.key);
    } else {
      // Reset form when adding a new key
      setNameInput("");
      setKeyInput("");
      setLocalError(null);
    }
  }, [initialData, open]); // Add open to dependencies to reset when dialog opens

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validate name first
    if (!nameInput.trim()) {
      setLocalError("Please enter a name for your API key");
      return;
    }

    // Validate API key format
    const keyRegex =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{20}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    if (!keyRegex.test(keyInput)) {
      setLocalError(
        "API key must follow the format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
      );
      return;
    }

    try {
      // Verify the API key and get account info
      const accountInfo = await verifyApiKey(keyInput);
      let characters: CharacterInfo[] = [];
      let isInvalid = false;
      try {
        characters = await getCharacters(keyInput);
      } catch {
        isInvalid = true;
        characters = [];
        // Optionally, set a local error or log
      }
      const newKey: APIKey = {
        id: initialData?.id || Date.now().toString(),
        name: nameInput,
        key: keyInput,
        accountId: accountInfo.id,
        accountName: accountInfo.name,
        permissions: accountInfo.access || [],
        isSelected: initialData?.isSelected || false,
        isInvalid,
        characters,
      };
      await onSubmit(newKey);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("maximum number of keys")) {
        setLocalError("You have reached the maximum number of keys.");
      } else {
        setLocalError("Failed to verify API key. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit API Key" : "Add New API Key"}</DialogTitle>
          <DialogDescription>Enter your Guild Wars 2 API key details below.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          data-testid="api-key-form"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              required
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="key">API Key</Label>
            <Input
              required
              id="key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Required permissions: account, characters, guilds, progression
          </p>
          {(error || localError) && (
            <div
              className="p-4 bg-destructive/10 text-destructive rounded-md"
              data-testid="error-message"
            >
              {error || localError}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
