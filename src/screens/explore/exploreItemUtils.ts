import { DbItemRecord } from "../../data/dbCategories";
import { getListingDisplayTitle } from "../../utils/listingTitle";

/** Title for explore cards / modal (same rules as catalog home titles). */
export function getExploreItemTitle(record: DbItemRecord, indexForFallback?: number): string {
  const base = getListingDisplayTitle(record, indexForFallback);
  if (base === "Untitled" && typeof indexForFallback !== "number") return "Listing";
  return base;
}

export function getImageUrls(record: DbItemRecord): string[] {
  const imgs = (record as Record<string, unknown>).images;
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim());
}
