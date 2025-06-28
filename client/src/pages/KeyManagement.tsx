import { useState } from "react";

import { APIKeyDialog } from "@/components/api-key/APIKeyDialog";
import { APIKeyList } from "@/components/api-key/APIKeyList";
import { useAPIKeyStore, type APIKey } from "@/stores/api-keys";

export default function KeyManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addKey } = useAPIKeyStore();

  const handleAddKey = async (key: APIKey) => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.resolve(addKey(key));
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <APIKeyList onAddKey={() => setIsDialogOpen(true)} />
      <APIKeyDialog
        error={error}
        isLoading={isLoading}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddKey}
      />
    </div>
  );
}
