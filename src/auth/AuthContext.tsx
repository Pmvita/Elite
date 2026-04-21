import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { getUsersForProfile, type DbItemRecord } from "../data/dbCategories";
import type { SessionProfile } from "../types/userProfile";
import { sessionProfileFromRecord } from "../types/userProfile";
import {
  findUserByCredentials,
  isEmailTaken,
  isUsernameTaken,
  nextUserId,
} from "./credentials";

const SESSION_KEY = "elite_session_v1";
const LOCAL_USERS_KEY = "elite_local_users_v1";

type SessionPayload = { userId: number };

type RegisterInput = {
  name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  country: string;
};

type AuthContextValue = {
  loading: boolean;
  user: SessionProfile | null;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (input: RegisterInput) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readLocalUsers(): Promise<DbItemRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => x && typeof x === "object") as DbItemRecord[];
  } catch {
    return [];
  }
}

async function writeLocalUsers(users: DbItemRecord[]): Promise<void> {
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

async function readSessionUserId(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionPayload;
    if (parsed && typeof parsed.userId === "number" && Number.isFinite(parsed.userId)) {
      return parsed.userId;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function writeSessionUserId(userId: number): Promise<void> {
  const payload: SessionPayload = { userId };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<number | null>(null);
  const [localUsers, setLocalUsers] = useState<DbItemRecord[]>([]);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const allUsers = useMemo(() => [...getUsersForProfile(), ...localUsers], [localUsers]);

  const user = useMemo(() => {
    if (sessionUserId == null) return null;
    const row = allUsers.find((u) => {
      const id = typeof u.id === "number" ? u.id : Number(u.id);
      return Number.isFinite(id) && id === sessionUserId;
    });
    return row ? sessionProfileFromRecord(row) : null;
  }, [sessionUserId, allUsers]);

  const hydrate = useCallback(async () => {
    const [locals, sid] = await Promise.all([readLocalUsers(), readSessionUserId()]);
    setLocalUsers(locals);
    if (sid != null) {
      const merged = [...getUsersForProfile(), ...locals];
      const exists = merged.some((u) => {
        const id = typeof u.id === "number" ? u.id : Number(u.id);
        return Number.isFinite(id) && id === sid;
      });
      setSessionUserId(exists ? sid : null);
      if (!exists) await clearSession();
    } else {
      setSessionUserId(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const merged = [...getUsersForProfile(), ...localUsers];
      const row = findUserByCredentials(merged, identifier, password);
      if (!row) {
        return { ok: false as const, message: "Invalid email, username, or password." };
      }
      const id = typeof row.id === "number" ? row.id : Number(row.id);
      if (!Number.isFinite(id)) {
        return { ok: false as const, message: "Account is missing a valid id." };
      }
      await writeSessionUserId(id);
      setSessionUserId(id);
      return { ok: true as const };
    },
    [localUsers]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const merged = [...getUsersForProfile(), ...localUsers];
      const email = input.email.trim();
      const username = input.username.trim();
      const name = input.name.trim();
      const password = input.password;
      if (!name || !email || !username || !password) {
        return { ok: false as const, message: "Please complete all required fields." };
      }
      if (password.length < 6) {
        return { ok: false as const, message: "Password must be at least 6 characters." };
      }
      if (isEmailTaken(merged, email)) {
        return { ok: false as const, message: "That email is already registered." };
      }
      if (isUsernameTaken(merged, username)) {
        return { ok: false as const, message: "That username is taken." };
      }
      const id = nextUserId(merged);
      const row: DbItemRecord = {
        id,
        name,
        email,
        username,
        password,
        phone: input.phone.trim() || "—",
        country: input.country.trim() || "—",
        membership: "Member",
        role: "member",
        activeInquiries: 0,
      };
      const nextLocals = [...localUsers, row];
      setLocalUsers(nextLocals);
      await writeLocalUsers(nextLocals);
      await writeSessionUserId(id);
      setSessionUserId(id);
      return { ok: true as const };
    },
    [localUsers]
  );

  const logout = useCallback(async () => {
    await clearSession();
    setSessionUserId(null);
    setAuthModalOpen(false);
  }, []);

  const signInWithGoogle = useCallback(() => {
    Alert.alert("Google sign-in", "Google OAuth will be connected in production. Use email or username for now.");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      user,
      authModalOpen,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      signInWithGoogle,
    }),
    [loading, user, authModalOpen, openAuthModal, closeAuthModal, login, register, logout, signInWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
