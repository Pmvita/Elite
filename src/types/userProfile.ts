import type { DbItemRecord } from "../data/dbCategories";

export type SessionProfile = {
  id: number;
  name: string;
  email: string;
  username: string;
  membership: string;
  country: string;
  phone: string;
  activeInquiries: number;
  role: string;
};

export function sessionProfileFromRecord(u: DbItemRecord): SessionProfile | null {
  const id = typeof u.id === "number" && !Number.isNaN(u.id) ? u.id : Number(u.id);
  if (!Number.isFinite(id) || id <= 0) return null;
  return {
    id,
    name: String(u.name ?? "Member"),
    email: String(u.email ?? ""),
    username: String(u.username ?? ""),
    membership: String(u.membership ?? "Member"),
    country: String(u.country ?? "—"),
    phone: String(u.phone ?? "—"),
    activeInquiries: typeof u.activeInquiries === "number" ? u.activeInquiries : 0,
    role: String(u.role ?? "member"),
  };
}
