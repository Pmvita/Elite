import type { DbItemRecord } from "../data/dbCategories";

/** Shared listing label: `name`, then `displayName`, then make + model, then fallback. */
export function getListingDisplayTitle(record: DbItemRecord, indexForFallback?: number): string {
  const r = record as Record<string, unknown>;
  const name = r.name;
  const displayName = r.displayName;
  if (typeof name === "string" && name.trim().length > 0) return name.trim();
  if (typeof displayName === "string" && displayName.trim().length > 0) return displayName.trim();
  const make = typeof r.make === "string" ? r.make.trim() : "";
  const model = typeof r.model === "string" ? r.model.trim() : "";
  const composed = [make, model].filter(Boolean).join(" ");
  if (composed.length > 0) return composed;
  if (typeof indexForFallback === "number" && Number.isFinite(indexForFallback)) {
    return `Item ${indexForFallback + 1}`;
  }
  return "Untitled";
}
