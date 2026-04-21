import { DbItemRecord } from "../../data/dbCategories";

export function getImageUrls(record: DbItemRecord): string[] {
  const imgs = (record as Record<string, unknown>).images;
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim());
}
