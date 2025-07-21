import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const showcaseContainerClasses = cn(
  "min-h-screen bg-gradient-to-b from-background to-background/90 relative overflow-hidden"
);

const backgroundClasses = cn("absolute inset-0 opacity-10");

const patternClasses = cn(
  "absolute top-0 left-0 w-full h-full bg-[url('/gw2-pattern.svg')] bg-repeat opacity-20 animate-shimmer"
);

const glowClasses = cn(
  "absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-frost-glow"
);

const contentClasses = cn("container mx-auto py-8 relative z-10");

const headerClasses = cn("text-center mb-12 animate-float");

const titleClasses = cn("text-5xl font-bold font-serif tracking-wider text-primary");

const dividerClasses = cn("w-24 h-1 bg-primary mx-auto mb-6 animate-shimmer");

const descriptionClasses = cn("text-muted-foreground text-lg max-w-2xl mx-auto");

const gridClasses = cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6");

const cardClasses = cn(
  "bg-card/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 animate-pulse-border"
);

const cardTitleClasses = cn("text-2xl font-bold text-primary mb-4");

const cardDescriptionClasses = cn("text-muted-foreground mb-4");

const buttonGroupClasses = cn("flex flex-wrap gap-4");

const badgeGroupClasses = cn("flex flex-wrap gap-2");

const typographySectionClasses = cn("space-y-4");

export function ComponentShowcase() {
  const [open, setOpen] = useState(false);
  return (
    <div className={showcaseContainerClasses}>
      <div className={backgroundClasses}>
        <div className={patternClasses} />
        <div className={glowClasses} />
      </div>

      <div className={contentClasses}>
        <div className={headerClasses}>
          <h1 className={titleClasses}>Component Showcase</h1>
          <div className={dividerClasses} />
          <p className={descriptionClasses}>
            Explore our GW2-themed UI components and their various states
          </p>
        </div>

        <div className={gridClasses}>
          {/* Buttons Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Buttons</h2>
            <p className={cardDescriptionClasses}>Explore our button variants</p>
            <div className={buttonGroupClasses}>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Cards Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Cards</h2>
            <p className={cardDescriptionClasses}>Different card styles and layouts</p>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a basic card with header, content, and footer sections.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Badges Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Badges</h2>
            <p className={cardDescriptionClasses}>Different badge styles</p>
            <div className={badgeGroupClasses}>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Theme Toggle Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Theme</h2>
            <p className={cardDescriptionClasses}>Toggle between light and dark themes</p>
            <ThemeToggle />
          </div>

          {/* Typography Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Typography</h2>
            <p className={cardDescriptionClasses}>Text styles and hierarchy</p>
            <div className={typographySectionClasses}>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-medium">Heading 3</h3>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Small muted text</p>
            </div>
          </div>

          {/* Interactive Card Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Interactive Card</h2>
            <p className={cardDescriptionClasses}>A card with interactive elements</p>
            <Card>
              <CardHeader>
                <CardTitle>Interactive Elements</CardTitle>
                <CardDescription>Try clicking the buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge>New</Badge>
                    <span>Interactive badge</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    Click Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modal Dialog Showcase Section */}
          <div className={cardClasses}>
            <h2 className={cardTitleClasses}>Modal Dialog</h2>
            <p className={cardDescriptionClasses}>Test the modal dialog theme and background</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Open Modal Dialog</Button>
              </DialogTrigger>
              <DialogContent className="dialog-content-bg">
                <DialogHeader>
                  <DialogTitle>Theme Test Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog is for verifying the modal background and theme colors. Try toggling
                    the theme!
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
