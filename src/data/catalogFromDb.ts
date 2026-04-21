import { Category, Item } from "../types/marketplace";
import { dbCategories, dbItemsByCategory, DbItemRecord } from "./dbCategories";

const GRADIENTS: [string, string][] = [
  ["#1a1510", "#0d1520"],
  ["#15100a", "#0a1015"],
  ["#0a1520", "#101520"],
  ["#1a1515", "#15101a"],
  ["#10100a", "#0a0a15"],
  ["#151515", "#1a1a15"],
];

const CAT_ICON: Record<string, string> = {
  vehicles: "car-sports",
  jets: "airplane",
  yachts: "ferry",
  jewelry: "diamond-stone",
  furniture: "piano",
};

const CAT_ORDER = ["vehicles", "jets", "yachts", "jewelry", "furniture"] as const;

function formatUsd(value: unknown): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function firstPreviewImage(record: DbItemRecord): string | null {
  const imgs = (record as Record<string, unknown>).images;
  if (!Array.isArray(imgs) || imgs.length === 0) return null;
  const first = imgs[0];
  return typeof first === "string" && first.trim().length > 0 ? first.trim() : null;
}

function stableItemId(cat: string, record: DbItemRecord, index: number): number {
  const catIdx = Math.max(0, CAT_ORDER.indexOf(cat as (typeof CAT_ORDER)[number]));
  const rid = typeof record.id === "number" && !Number.isNaN(record.id) ? record.id : index + 1;
  return (catIdx + 1) * 100_000 + rid;
}

function sellerFrom(record: DbItemRecord): string {
  const v = record.make ?? record.maker ?? record.builder;
  if (typeof v === "string" && v.length) return v;
  return "—";
}

function tagFrom(record: DbItemRecord): string {
  const t = record.status ?? record.membership ?? record.type ?? record.gemType ?? record.category;
  if (typeof t === "string" && t.length) return t;
  return "Listing";
}

function locFrom(record: DbItemRecord): string {
  if (typeof record.location === "string" && record.location.length) return record.location;
  if (typeof record.country === "string" && record.country.length) return record.country;
  return "—";
}

function descFrom(record: DbItemRecord): string {
  const parts: string[] = [];
  if (typeof record.year === "number" && record.year > 0) parts.push(`${record.year}`);
  if (typeof record.make === "string" && record.make.length) parts.push(record.make);
  if (typeof record.model === "string" && record.model.length) parts.push(record.model);
  if (typeof record.length_m === "number") parts.push(`${record.length_m} m`);
  if (typeof record.carats === "number") parts.push(`${record.carats} ct`);
  if (typeof record.category === "string") parts.push(record.category);
  if (typeof record.gemType === "string") parts.push(record.gemType);
  if (typeof record.listingUrl === "string" && record.listingUrl.length) parts.push("Link in details");
  return parts.length ? parts.join(" · ") : "See listing for full details.";
}

function rowToItem(cat: string, record: DbItemRecord, index: number): Item {
  const icon = CAT_ICON[cat] ?? "star-four-points-outline";
  const gradient = GRADIENTS[index % GRADIENTS.length];
  return {
    id: stableItemId(cat, record, index),
    name: String(record.name ?? "Untitled"),
    cat,
    price: formatUsd(record.value),
    tag: tagFrom(record),
    gradient,
    icon,
    desc: descFrom(record),
    seller: sellerFrom(record),
    loc: locFrom(record),
    previewImageUrl: firstPreviewImage(record),
  };
}

function buildItems(): Item[] {
  const out: Item[] = [];
  for (const cat of CAT_ORDER) {
    const rows = dbItemsByCategory[cat] ?? [];
    rows.forEach((row, i) => out.push(rowToItem(cat, row, i)));
  }
  return out;
}

export const items: Item[] = buildItems();

export const categories: Category[] = [
  { id: "all", name: "All", icon: "star-four-points-outline" },
  ...dbCategories.map((c) => ({
    id: c.key,
    name: c.label,
    icon: CAT_ICON[c.key] ?? "database-outline",
  })),
];

export type CollectionRow = { name: string; count: number; icons: string[] };

export const collections: CollectionRow[] = dbCategories
  .filter((c) => c.count > 0)
  .map((c) => ({
    name: c.label,
    count: c.count,
    icons: [CAT_ICON[c.key] ?? "folder-outline"],
  }));

