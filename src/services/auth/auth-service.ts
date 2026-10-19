import {
  readJsonFromStorage,
  removeFromStorage,
  writeJsonToStorage,
} from "@/services/storage/local-storage";
import { STORAGE_KEYS } from "@/services/storage/storage-keys";
import type { AuthSession } from "@/types/auth";

export const DEMO_USERNAME = "nutri";
export const DEMO_PASSWORD = "nutri";

export function loginDemo(username: string, password: string): boolean {
  if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    return false;
  }

  const session: AuthSession = {
    username,
    loggedInAt: new Date().toISOString(),
  };
  writeJsonToStorage(STORAGE_KEYS.auth, session);
  return true;
}

export function logoutDemo(): void {
  removeFromStorage(STORAGE_KEYS.auth);
}

export function getAuthSession(): AuthSession | null {
  return readJsonFromStorage<AuthSession>(STORAGE_KEYS.auth);
}

export function isAuthenticatedDemo(): boolean {
  return getAuthSession() !== null;
}
