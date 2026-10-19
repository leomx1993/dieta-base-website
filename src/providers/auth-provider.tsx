"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAuthSession,
  loginDemo,
  logoutDemo,
} from "@/services/auth/auth-service";
import type { AuthSession } from "@/types/auth";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  return getAuthSession();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readInitialSession);
  const isReady = typeof window !== "undefined";

  const login = useCallback((username: string, password: string) => {
    const ok = loginDemo(username, password);
    if (ok) {
      setSession(getAuthSession());
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    logoutDemo();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      isReady,
      login,
      logout,
    }),
    [session, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
