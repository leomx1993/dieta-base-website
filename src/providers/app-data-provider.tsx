"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAllDemoStorage,
  deletePatient,
  loadAppData,
  resetAppDataToDemo,
  saveAppData,
  upsertAssessment,
  upsertMealPlan,
  upsertPatient,
} from "@/services/storage/app-data-repository";
import type { AppData } from "@/types/app-data";
import type { NutritionalAssessment } from "@/types/assessment";
import type { MealPlan } from "@/types/meal-plan";
import type { Patient } from "@/types/patient";

interface AppDataContextValue {
  data: AppData | null;
  isReady: boolean;
  refresh: () => void;
  savePatient: (patient: Patient) => void;
  removePatient: (patientId: string) => void;
  saveAssessment: (assessment: NutritionalAssessment) => void;
  saveMealPlan: (mealPlan: MealPlan) => void;
  resetDemoData: () => void;
  clearAllData: () => void;
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);

function readInitialAppData(): AppData | null {
  if (typeof window === "undefined") {
    return null;
  }
  return loadAppData();
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(readInitialAppData);
  const isReady = typeof window !== "undefined";

  const refresh = useCallback(() => {
    setData(loadAppData());
  }, []);

  const persist = useCallback((next: AppData) => {
    saveAppData(next);
    setData(next);
  }, []);

  const savePatient = useCallback(
    (patient: Patient) => {
      if (!data) {
        return;
      }
      persist(upsertPatient(data, patient));
    },
    [data, persist],
  );

  const removePatient = useCallback(
    (patientId: string) => {
      if (!data) {
        return;
      }
      persist(deletePatient(data, patientId));
    },
    [data, persist],
  );

  const saveAssessment = useCallback(
    (assessment: NutritionalAssessment) => {
      if (!data) {
        return;
      }
      persist(upsertAssessment(data, assessment));
    },
    [data, persist],
  );

  const saveMealPlan = useCallback(
    (mealPlan: MealPlan) => {
      if (!data) {
        return;
      }
      persist(upsertMealPlan(data, mealPlan));
    },
    [data, persist],
  );

  const resetDemoData = useCallback(() => {
    const demo = resetAppDataToDemo();
    setData(demo);
  }, []);

  const clearAllData = useCallback(() => {
    clearAllDemoStorage();
    const demo = loadAppData();
    setData(demo);
  }, []);

  const value = useMemo(
    () => ({
      data,
      isReady,
      refresh,
      savePatient,
      removePatient,
      saveAssessment,
      saveMealPlan,
      resetDemoData,
      clearAllData,
    }),
    [
      data,
      isReady,
      refresh,
      savePatient,
      removePatient,
      saveAssessment,
      saveMealPlan,
      resetDemoData,
      clearAllData,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
