import { Alert, Linking } from "react-native";
import { DbItemRecord } from "../../data/dbCategories";
import { getListingDisplayTitle } from "../../utils/listingTitle";

/** Single-line http(s) URL (e.g. listing links), not arbitrary text containing a URL. */
export function isHttpUrlString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const t = value.trim();
  if (!/^https?:\/\//i.test(t)) return false;
  if (/[\s\n\r]/.test(t)) return false;
  return true;
}

export function isListingUrlField(key: string): boolean {
  return key.toLowerCase() === "listingurl";
}

export async function openListingUrl(url: string): Promise<void> {
  const u = url.trim();
  if (!isHttpUrlString(u)) return;
  try {
    const ok = await Linking.canOpenURL(u);
    if (!ok) {
      Alert.alert("Cannot open link", "This URL is not supported on this device.");
      return;
    }
    await Linking.openURL(u);
  } catch {
    Alert.alert("Cannot open link", "Something went wrong opening the link.");
  }
}

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
