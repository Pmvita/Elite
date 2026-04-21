export type Category = { id: string; name: string; icon: string };

export type TabId = "home" | "explore" | "wishlist" | "profile";

export type Item = {
  id: number;
  name: string;
  cat: string;
  price: string;
  tag: string;
  gradient: [string, string];
  icon: string;
  desc: string;
  seller: string;
  loc: string;
  /** First image URL from db `images[]`, when present */
  previewImageUrl?: string | null;
};
