import type { AdminCategory } from "./types";

// The default niches (the tabs on the public site). Must match server/src/niches.ts.
export const DEFAULT_NICHES = [
  "Business",
  "Career",
  "Technology",
  "Investment",
  "Finance",
] as const;

// Default niches that are not in the list yet (compared by name, ignoring case)
export const missingNiches = (
  existing: Pick<AdminCategory, "name">[],
): string[] => {
  const have = new Set(existing.map((c) => c.name.trim().toLowerCase()));
  return DEFAULT_NICHES.filter((n) => !have.has(n.toLowerCase()));
};
