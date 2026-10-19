"use client";

import { useAppData } from "@/hooks/use-app-data";

export function DataReady({ children }: { children: React.ReactNode }) {
  const { data, isReady } = useAppData();

  if (!isReady || !data) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Carregando dados…
      </div>
    );
  }

  return children;
}
