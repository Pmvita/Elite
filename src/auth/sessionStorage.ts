import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/** Legacy JSON blob in AsyncStorage (still used as fallback on native if SecureStore fails). */
const SESSION_KEY_ASYNC = "elite_session_v1";
/** Numeric user id as string in Keychain / EncryptedSharedPreferences. */
const SESSION_KEY_SECURE = "elite_session_userid_v1";

type SessionPayload = { userId: number };

async function readUserIdFromAsyncStorage(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY_ASYNC);
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

async function tryMigrateLegacySessionToSecure(userId: number): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    if (!(await SecureStore.isAvailableAsync())) return;
    await SecureStore.setItemAsync(SESSION_KEY_SECURE, String(userId));
    await AsyncStorage.removeItem(SESSION_KEY_ASYNC);
  } catch {
    /* keep legacy key if migration fails */
  }
}

export async function readSessionUserId(): Promise<number | null> {
  if (Platform.OS !== "web") {
    try {
      if (await SecureStore.isAvailableAsync()) {
        const secured = await SecureStore.getItemAsync(SESSION_KEY_SECURE);
        if (secured != null && secured !== "") {
          const n = Number(secured);
          if (Number.isFinite(n)) return n;
        }
      }
    } catch {
      /* fall through to AsyncStorage */
    }
  }

  const legacy = await readUserIdFromAsyncStorage();
  if (legacy != null && Platform.OS !== "web") {
    await tryMigrateLegacySessionToSecure(legacy);
  }
  return legacy;
}

export async function writeSessionUserId(userId: number): Promise<void> {
  const payload = JSON.stringify({ userId } satisfies SessionPayload);

  if (Platform.OS === "web") {
    await AsyncStorage.setItem(SESSION_KEY_ASYNC, payload);
    return;
  }

  try {
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(SESSION_KEY_SECURE, String(userId));
      try {
        await AsyncStorage.removeItem(SESSION_KEY_ASYNC);
      } catch {
        /* ignore */
      }
      return;
    }
  } catch {
    /* use AsyncStorage below */
  }

  await AsyncStorage.setItem(SESSION_KEY_ASYNC, payload);
}

export async function clearPersistedSession(): Promise<void> {
  try {
    if (Platform.OS !== "web") {
      try {
        if (await SecureStore.isAvailableAsync()) {
          await SecureStore.deleteItemAsync(SESSION_KEY_SECURE);
        }
      } catch {
        /* ignore */
      }
    }
    await AsyncStorage.removeItem(SESSION_KEY_ASYNC);
  } catch {
    /* never throw — logout must always complete */
  }
}
