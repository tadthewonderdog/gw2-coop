import { ChevronRight, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tree = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} role="tree" {...props} />
  )
);
Tree.displayName = "Tree";

const TreeItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isExpanded?: boolean;
    hasChildren?: boolean;
    selected?: boolean;
  }
>(({ className, children, isExpanded, hasChildren, selected, onClick, ...props }, ref) => (
  <div
    ref={ref}
    aria-selected={selected}
    className={cn(
      "flex items-center gap-2 py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer",
      selected && "bg-accent text-accent-foreground",
      className
    )}
    role="treeitem"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }
    }}
    {...props}
  >
    {hasChildren && (
      <div className="w-4 h-4 flex items-center justify-center">
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </div>
    )}
    {!hasChildren && <div className="w-4" />}
    {children}
  </div>
));
TreeItem.displayName = "TreeItem";

const TreeGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pl-4", className)} role="group" {...props} />
  )
);
TreeGroup.displayName = "TreeGroup";

export { Tree, TreeItem, TreeGroup };
