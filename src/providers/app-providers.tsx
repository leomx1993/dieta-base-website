"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppDataProvider } from "@/providers/app-data-provider";
import { AuthProvider } from "@/providers/auth-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppDataProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AppDataProvider>
    </AuthProvider>
  );
}
