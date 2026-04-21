import vehiclesDb from "../../db/Vehicles.json";
import jetsDb from "../../db/Jets.json";
import yachtsDb from "../../db/Yachts.json";
import jewelryDb from "../../db/Jewelry.json";
import furnitureDb from "../../db/Furniture.json";
import realEstateDb from "../../db/RealEstate.json";
import usersDb from "../../db/Users.json";

type DbCollection = {
  key: string;
  label: string;
  count: number;
};

export type DbItemRecord = Record<string, string | number | boolean | null>;

function toCount(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

export const dbCategories: DbCollection[] = [
  {
    key: "vehicles",
    label: "Vehicles",
    count: toCount((vehiclesDb as { vehicles?: unknown }).vehicles),
  },
  {
    key: "jets",
    label: "Jets",
    count: toCount((jetsDb as { jets?: unknown }).jets),
  },
  {
    key: "yachts",
    label: "Yachts",
    count: toCount((yachtsDb as { yachts?: unknown }).yachts),
  },
  {
    key: "jewelry",
    label: "Jewelry",
    count: toCount((jewelryDb as { jewelry?: unknown }).jewelry),
  },
  {
    key: "furniture",
    label: "Furniture",
    count: toCount((furnitureDb as { furniture?: unknown }).furniture),
  },
  {
    key: "realEstate",
    label: "Real estate",
    count: toCount((realEstateDb as { realEstate?: unknown }).realEstate),
  },
];

/** Not exposed in Explore or marketplace categories — profile/session only. */
export function getUsersForProfile(): DbItemRecord[] {
  return ((usersDb as { users?: unknown }).users as DbItemRecord[]) ?? [];
}

export const dbItemsByCategory: Record<string, DbItemRecord[]> = {
  vehicles: ((vehiclesDb as { vehicles?: unknown }).vehicles as DbItemRecord[]) ?? [],
  jets: ((jetsDb as { jets?: unknown }).jets as DbItemRecord[]) ?? [],
  yachts: ((yachtsDb as { yachts?: unknown }).yachts as DbItemRecord[]) ?? [],
  jewelry: ((jewelryDb as { jewelry?: unknown }).jewelry as DbItemRecord[]) ?? [],
  furniture: ((furnitureDb as { furniture?: unknown }).furniture as DbItemRecord[]) ?? [],
  realEstate: ((realEstateDb as { realEstate?: unknown }).realEstate as DbItemRecord[]) ?? [],
};
