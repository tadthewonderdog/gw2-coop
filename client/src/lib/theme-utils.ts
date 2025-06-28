import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS classes, handling conflicts appropriately
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a themed variant class string based on the provided variants and base classes
 */
export function createThemedVariant(
  baseClasses: string,
  variants: Record<string, Record<string, string>>
) {
  return ({
    variant,
    size,
    className,
  }: {
    variant?: string;
    size?: string;
    className?: string;
  } = {}) => {
    return cn(
      baseClasses,
      variant && variants.variant?.[variant],
      size && variants.size?.[size],
      className
    );
  };
}

/**
 * Converts a CSS HSL variable to a complete HSL color string
 */
export function hsl(variable: string, opacity: number = 1) {
  return `hsl(var(${variable}) / ${opacity})`;
}
