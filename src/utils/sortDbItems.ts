import { DbItemRecord } from "../data/dbCategories";

export type DbSortMode =
  | "default"
  | "name_asc"
  | "name_desc"
  | "value_desc"
  | "value_asc"
  | "year_desc"
  | "year_asc";

function num(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function nameOf(item: DbItemRecord): string {
  return String(item.name ?? "");
}

export function sortDbItems(items: DbItemRecord[], mode: DbSortMode): DbItemRecord[] {
  const copy = [...items];
  switch (mode) {
    case "name_asc":
      return copy.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    case "name_desc":
      return copy.sort((a, b) => nameOf(b).localeCompare(nameOf(a)));
    case "value_desc":
      return copy.sort((a, b) => num(b.value) - num(a.value));
    case "value_asc":
      return copy.sort((a, b) => num(a.value) - num(b.value));
    case "year_desc":
      return copy.sort((a, b) => num(b.year) - num(a.year));
    case "year_asc":
      return copy.sort((a, b) => num(a.year) - num(b.year));
    default:
      return copy.sort((a, b) => num(a.id) - num(b.id));
  }
}

export const SORT_OPTIONS: { mode: DbSortMode; label: string }[] = [
  { mode: "default", label: "Default" },
  { mode: "name_asc", label: "Name A–Z" },
  { mode: "name_desc", label: "Name Z–A" },
  { mode: "value_desc", label: "Value high" },
  { mode: "value_asc", label: "Value low" },
  { mode: "year_desc", label: "Year new" },
  { mode: "year_asc", label: "Year old" },
];
