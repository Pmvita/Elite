import type { DbItemRecord } from "../data/dbCategories";

function normEmail(s: string): string {
  return s.trim().toLowerCase();
}

function normUsername(s: string): string {
  return s.trim().toLowerCase();
}

/** Match `Users.json` (and merged local users): email or username + password. */
export function findUserByCredentials(
  users: DbItemRecord[],
  identifier: string,
  password: string
): DbItemRecord | null {
  const idRaw = identifier.trim();
  const pass = password;
  if (!idRaw || !pass) return null;
  const idEmail = normEmail(idRaw);
  const idUser = normUsername(idRaw);
  const found =
    users.find((u) => {
      const email = normEmail(String(u.email ?? ""));
      const username = normUsername(String(u.username ?? ""));
      const stored = String(u.password ?? "");
      const idMatch = email === idEmail || username === idUser;
      return idMatch && stored === pass;
    }) ?? null;
  return found;
}

export function isEmailTaken(users: DbItemRecord[], email: string): boolean {
  const e = normEmail(email);
  return users.some((u) => normEmail(String(u.email ?? "")) === e);
}

export function isUsernameTaken(users: DbItemRecord[], username: string): boolean {
  const u = normUsername(username);
  return users.some((x) => normUsername(String(x.username ?? "")) === u);
}

export function nextUserId(users: DbItemRecord[]): number {
  let max = 0;
  for (const u of users) {
    const n = typeof u.id === "number" ? u.id : Number(u.id);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}
