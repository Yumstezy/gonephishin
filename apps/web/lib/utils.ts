import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The standard shadcn class-name helper. Combines conditional class strings
 * (clsx) and resolves Tailwind utility conflicts (tailwind-merge) so the
 * last conflicting utility wins, which is what consumers expect.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
