import {
  Check,
  Star,
  Edit,
  Trash2,
  ArrowUpDown,
  Plus,
  XCircle,
  RotateCcw,
  Loader2,
  Download,
  Copy,
  Upload,
} from "lucide-react";
import * as React from "react";
import { useState, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { verifyApiKey, getCharacters } from "@/services/gw2-api";
import type { CharacterInfo } from "@/services/gw2-api";
import { useAPIKeyStore, type APIKey } from "@/stores/api-keys";

import { APIKeyDialog } from "./APIKeyDialog";

const emptyStateClasses = cn(
  "text-center p-8",
  "text-muted-foreground",
  "border-2 border-border",
  "rounded-lg",
  "bg-background",
  "shadow-lg"
);

const permissionBadgeClasses = cn(
  "inline-flex items-center",
  "px-2.5 py-1 rounded-full",
  "text-xs font-medium",
  "bg-muted text-muted-foreground",
  "border border-border"
);

// Utility class for character pills
const characterPillClass = "whitespace-nowrap truncate max-w-[10rem] h-7";

type SortField = "name" | "accountName";
type SortDirection = "asc" | "desc";

type ImportedApiKey = { name: string; key: string };
function isImportedApiKey(obj: unknown): obj is ImportedApiKey {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    typeof (obj as { name: unknown }).name === "string" &&
    "key" in obj &&
    typeof (obj as { key: unknown }).key === "string"
  );
}

/**
 * Main API Key management component that displays a table of API keys
 * with filtering, sorting, and management capabilities.
 */
export function APIKeyList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterText, setFilterText] = useState("");
  const {
    keys,
    addKey,
    batchAddKeys,
    updateKey,
    removeKey,
    setCurrentKey,
    toggleSelected,
    currentKeyId,
  } = useAPIKeyStore();
  const [refreshingKeyId, setRefreshingKeyId] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importFileError, setImportFileError] = useState<string | null>(null);
  const [parsedImportKeys, setParsedImportKeys] = useState<ImportedApiKey[]>([]);

  /**
   * Handles form submission for adding/editing API keys
   */
  const handleSubmit = (key: APIKey): void => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingKey) {
        updateKey(editingKey, {
          name: key.name,
          key: key.key,
          accountId: key.accountId,
          accountName: key.accountName,
          permissions: key.permissions,
        });
      } else {
        addKey(key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key");
    } finally {
      setIsLoading(false);
      setEditingKey(null);
      setIsAddDialogOpen(false);
    }
  };

  const handleDelete = (keyId: string) => {
    removeKey(keyId);
    setDeleteConfirmKey(null);
  };

  const handleSetCurrent = (keyId: string) => {
    setCurrentKey(keyId);
  };

  const handleToggleSelected = (keyId: string) => {
    toggleSelected(keyId);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /**
   * Refreshes account and character data for a specific API key
   * Validates the key and fetches updated information from GW2 API
   */
  const handleRefresh = async (key: APIKey) => {
    setRefreshingKeyId(key.id);
    try {
      // Re-verify the API key and fetch characters
      const accountInfo = await verifyApiKey(key.key);
      let characters: CharacterInfo[] = [];
      let isInvalid = false;
      try {
        characters = await getCharacters(key.key);
      } catch {
        isInvalid = true;
        characters = [] as CharacterInfo[];
      }
      updateKey(key.id, {
        accountId: accountInfo.id,
        accountName: accountInfo.name,
        permissions: accountInfo.access || [],
        isInvalid,
        characters,
      });
    } catch {
      updateKey(key.id, { isInvalid: true });
    } finally {
      setRefreshingKeyId(null);
    }
  };

  /**
   * Filters and sorts API keys based on current filter text and sort settings
   * Prioritizes current key, then selected keys, then applies sorting
   */
  const sortedAndFilteredKeys = useMemo(() => {
    const filtered = keys.filter((key) => {
      const searchText = filterText.toLowerCase();
      const matchesKeyName = key.name.toLowerCase().includes(searchText);
      const matchesAccountName = key.accountName.toLowerCase().includes(searchText);
      const matchesCharacter = Array.isArray(key.characters)
        ? key.characters.some((c) => c.name.toLowerCase().includes(searchText))
        : false;
      return matchesKeyName || matchesAccountName || matchesCharacter;
    });

    return filtered.sort((a, b) => {
      // Current key always comes first
      if (a.id === currentKeyId) return -1;
      if (b.id === currentKeyId) return 1;

      // Selected keys come next
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;

      // Then apply sorting
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [keys, filterText, sortField, sortDirection, currentKeyId]);

  const exportData = useMemo(() => {
    return keys.map(({ name, key }) => ({ name, key }));
  }, [keys]);

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setExportSuccess("API keys copied to clipboard!");
    } catch {
      setExportSuccess("Failed to copy to clipboard.");
    }
  };

  const handleDownloadExport = () => {
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gw2-api-keys.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportSuccess("API keys downloaded!");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  // Parse import JSON whenever it changes
  React.useEffect(() => {
    if (!importJson.trim()) {
      setParsedImportKeys([]);
      setImportFileError(null);
      return;
    }

    try {
      const parsed = JSON.parse(importJson) as unknown;
      if (Array.isArray(parsed)) {
        const validKeys = (parsed as unknown[]).filter(isImportedApiKey);
        setParsedImportKeys(validKeys);
        setImportFileError(validKeys.length === 0 ? "No valid API keys found." : null);
      } else if (isImportedApiKey(parsed)) {
        setParsedImportKeys([parsed]);
        setImportFileError(null);
      } else {
        setParsedImportKeys([]);
        setImportFileError("Invalid JSON format.");
      }
    } catch {
      setParsedImportKeys([]);
      setImportFileError("Invalid JSON format.");
    }
  }, [importJson]);

  /**
   * Imports API keys with validation and data fetching
   * Skips duplicates, validates new keys, and fetches account/character data
   */
  const handleImport = async () => {
    if (parsedImportKeys.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const keysToAdd: APIKey[] = [];
      let skipped = 0;

      for (const { name, key } of parsedImportKeys) {
        if (keys.some((k) => k.key === key)) {
          skipped++;
          continue;
        }

        try {
          // Validate and fetch account info
          const accountInfo = await verifyApiKey(key);
          let characters: CharacterInfo[] = [];
          let isInvalid = false;
          try {
            characters = await getCharacters(key);
          } catch {
            isInvalid = true;
            characters = [];
          }

          const newKey: APIKey = {
            id: crypto.randomUUID(),
            name,
            key,
            accountId: accountInfo.id,
            accountName: accountInfo.name,
            permissions: accountInfo.access || [],
            isSelected: false,
            isInvalid,
            characters,
          };
          keysToAdd.push(newKey);
        } catch {
          // If validation fails, add as invalid
          const newKey: APIKey = {
            id: crypto.randomUUID(),
            name,
            key,
            accountId: "",
            accountName: "",
            permissions: [],
            isSelected: false,
            isInvalid: true,
            characters: [],
          };
          keysToAdd.push(newKey);
        }
      }

      // Add all keys in a single batch operation
      if (keysToAdd.length > 0) {
        batchAddKeys(keysToAdd);
      }

      const imported = keysToAdd.length;
      const failed = parsedImportKeys.length - imported - skipped;

      setIsImportDialogOpen(false);
      setImportJson("");
      setParsedImportKeys([]);
      setImportFileError(null);
      setExportSuccess(
        `Imported ${imported} key${imported !== 1 ? "s" : ""}.` +
          (skipped ? ` Skipped ${skipped} duplicate${skipped !== 1 ? "s" : ""}.` : "") +
          (failed ? ` ${failed} failed to import.` : "")
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import API keys");
    } finally {
      setIsLoading(false);
    }
  };

  // Always render the Add New Key button and filter input
  const header = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground font-serif flex items-center">
          API Keys
          <span className={cn(permissionBadgeClasses, "ml-3 text-lg")}>{keys.length} keys</span>
        </h2>
        <Input
          className="w-64"
          placeholder="Filter keys..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          className={cn(
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "shadow-lg shadow-primary/30",
            "border border-primary/50",
            "transform hover:scale-105 transition-all"
          )}
          disabled={keys.length >= 50}
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Key
        </Button>
        <Button
          className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
          disabled={keys.length === 0}
          size="sm"
          title="Export API keys"
          variant="ghost"
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600 hover:bg-green-50"
          size="sm"
          title="Import API keys"
          variant="ghost"
          onClick={() => setIsImportDialogOpen(true)}
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (keys.length === 0) {
    return (
      <div>
        {header}
        <div className={emptyStateClasses}>
          <p>No API keys added yet!</p>
          <p className="mt-2">Add your first key using the button above to get started.</p>
        </div>

        {/* Add New Key Dialog */}
        <APIKeyDialog
          error={error}
          isLoading={isLoading}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleSubmit}
        />

        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle>Import API Keys</DialogTitle>
              <DialogDescription>
                Import your API key data from a JSON file or by pasting JSON below. Only the name
                and key fields are required. Existing keys will be skipped.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <input
                accept="application/json,.json"
                className="block"
                type="file"
                onChange={handleImportFile}
              />
              <textarea
                className="w-full min-h-[100px] rounded border border-border bg-muted p-2 text-xs font-mono"
                placeholder="Paste exported API key JSON here..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
              />
              {importFileError && <div className="text-destructive text-xs">{importFileError}</div>}
              {parsedImportKeys.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">{parsedImportKeys.length}</span> valid API key
                  {parsedImportKeys.length !== 1 ? "s" : ""} detected.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={parsedImportKeys.length === 0 || !!importFileError || isLoading}
                onClick={() => {
                  void handleImport();
                }}
              >
                {isLoading ? "Importing..." : "Import"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Toast */}
        {exportSuccess && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
              {exportSuccess}
              <button
                className="ml-4 text-white/80 hover:text-white text-xs underline"
                onClick={() => setExportSuccess(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive mt-2">
            {error === "duplicate" ? (
              <>
                This API key is already added. Please use a different key or remove the existing one
                first.
              </>
            ) : (
              <>
                Failed to add API key. Please make sure the key is valid and try again. If the
                problem persists, please contact support.
              </>
            )}
          </p>
        )}
      </div>
    );
  }

  const keyToDelete = deleteConfirmKey ? keys.find((k) => k.id === deleteConfirmKey) : null;

  return (
    <div className="space-y-4">
      {header}
      <div className="rounded-md border border-border shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-16 text-center">Current</TableHead>
              <TableHead className="w-16 text-center">Selected</TableHead>
              <TableHead>
                <Button
                  className="h-8 px-2 hover:bg-muted"
                  variant="ghost"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sortField === "name" ? "opacity-100" : "opacity-50"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  className="h-8 px-2 hover:bg-muted"
                  variant="ghost"
                  onClick={() => handleSort("accountName")}
                >
                  Account Name
                  <ArrowUpDown
                    className={cn(
                      "ml-2 h-4 w-4",
                      sortField === "accountName" ? "opacity-100" : "opacity-50"
                    )}
                  />
                </Button>
              </TableHead>
              <TableHead>Characters</TableHead>
              <TableHead className="w-20 text-center">Valid</TableHead>
              <TableHead className="w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredKeys.map((key) => (
              <TableRow
                key={key.id}
                className="border-border hover:bg-muted/50"
                data-testid="api-key-item"
              >
                <TableCell className="text-center">
                  <Button
                    className={cn(
                      "h-8 w-8 p-0 hover:bg-muted",
                      currentKeyId === key.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    size="sm"
                    title={currentKeyId === key.id ? "Current key" : "Set as current key"}
                    variant="ghost"
                    onClick={() => handleSetCurrent(key.id)}
                  >
                    {currentKeyId === key.id ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    className={cn(
                      "h-8 w-8 p-0 hover:bg-muted",
                      key.isSelected
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    size="sm"
                    title={key.isSelected ? "Selected" : "Select key"}
                    variant="ghost"
                    onClick={() => handleToggleSelected(key.id)}
                  >
                    <Check
                      className={cn("h-4 w-4", key.isSelected ? "opacity-100" : "opacity-50")}
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{key.name}</span>
                    {key.isInvalid && (
                      <Badge className="text-xs" variant="destructive">
                        Invalid
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{key.accountName}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(key.characters) && key.characters.length > 0 ? (
                      key.characters.slice(0, 3).map((character) => (
                        <span
                          key={character.name}
                          className={cn(
                            characterPillClass,
                            "px-2 py-1 rounded-full",
                            "text-xs font-medium",
                            "bg-muted text-muted-foreground",
                            "border border-border"
                          )}
                          title={character.name}
                        >
                          {character.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No characters</span>
                    )}
                    {Array.isArray(key.characters) && key.characters.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{key.characters.length - 3} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {key.isInvalid ? (
                    <span aria-label="Invalid key" className="flex items-center justify-center">
                      <XCircle className="text-destructive mx-auto" />
                    </span>
                  ) : (
                    <span aria-label="Valid key" className="flex items-center justify-center">
                      <Check className="text-green-600 mx-auto" />
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <Button
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                      disabled={refreshingKeyId === key.id}
                      size="sm"
                      title="Refresh key data"
                      variant="ghost"
                      onClick={() => {
                        void handleRefresh(key);
                      }}
                    >
                      {refreshingKeyId === key.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      size="sm"
                      title="Edit key"
                      variant="ghost"
                      onClick={() => setEditingKey(key.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      size="sm"
                      title="Delete key"
                      variant="ghost"
                      onClick={() => setDeleteConfirmKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add New Key Dialog */}
      <APIKeyDialog
        error={error}
        isLoading={isLoading}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleSubmit}
      />

      {/* Edit Key Dialog */}
      <APIKeyDialog
        error={error}
        initialData={editingKey ? keys.find((k) => k.id === editingKey) : undefined}
        isLoading={isLoading}
        open={!!editingKey}
        onOpenChange={(open: boolean) => !open && setEditingKey(null)}
        onSubmit={handleSubmit}
      />

      <Dialog open={!!deleteConfirmKey} onOpenChange={(open) => !open && setDeleteConfirmKey(null)}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete API Key</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete the API key &quot;{keyToDelete?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmKey(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmKey && handleDelete(deleteConfirmKey)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Export API Keys</DialogTitle>
            <DialogDescription>
              Export your API key data as a JSON file or copy it to your clipboard. This data
              contains sensitive information—keep it secure.
              <br />
              <span className="font-semibold mt-2 block">
                You are exporting {exportData.length} API key{exportData.length !== 1 ? "s" : ""}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-muted rounded p-2 text-xs max-h-40 overflow-auto border border-border mb-2">
            {JSON.stringify(exportData, null, 2)}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                void handleCopyExport();
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleDownloadExport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {exportSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            {exportSuccess}
            <button
              className="ml-4 text-white/80 hover:text-white text-xs underline"
              onClick={() => setExportSuccess(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Import API Keys</DialogTitle>
            <DialogDescription>
              Import your API key data from a JSON file or by pasting JSON below. Only the name and
              key fields are required. Existing keys will be skipped.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <input
              accept="application/json,.json"
              className="block"
              type="file"
              onChange={handleImportFile}
            />
            <textarea
              className="w-full min-h-[100px] rounded border border-border bg-muted p-2 text-xs font-mono"
              placeholder="Paste exported API key JSON here..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
            />
            {importFileError && <div className="text-destructive text-xs">{importFileError}</div>}
            {parsedImportKeys.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold">{parsedImportKeys.length}</span> valid API key
                {parsedImportKeys.length !== 1 ? "s" : ""} detected.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={parsedImportKeys.length === 0 || !!importFileError || isLoading}
              onClick={() => {
                void handleImport();
              }}
            >
              {isLoading ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <p className="text-sm text-destructive mt-2">
          {error === "duplicate" ? (
            <>
              This API key is already added. Please use a different key or remove the existing one
              first.
            </>
          ) : (
            <>
              Failed to add API key. Please make sure the key is valid and try again. If the problem
              persists, please contact support.
            </>
          )}
        </p>
      )}
    </div>
  );
}
