"use client";

import { useContext } from "react";
import { AppDataContext } from "@/providers/app-data-provider";

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  }
  return context;
}
