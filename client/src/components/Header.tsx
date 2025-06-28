import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const headerClasses = cn("bg-background/80 backdrop-blur-sm", "border-b border-primary/20");

const navLinkClasses = cn("text-foreground", "hover:text-primary", "transition-colors");

export function Header() {
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link className="flex items-center" to="/">
            <img
              alt="Achievement Analytics Interface Logo"
              className="h-10 w-10 object-contain"
              src="logo.jpg"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link className={navLinkClasses} to="/group-management">
              Groups
            </Link>
            <Link className={navLinkClasses} to="/key-management">
              API Keys
            </Link>
            <Link className={navLinkClasses} to="/achievements">
              Achievements
            </Link>
            <Link className={navLinkClasses} to="/showcase">
              Components
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
