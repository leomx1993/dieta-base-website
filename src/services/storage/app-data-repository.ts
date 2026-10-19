import { createDemoAppData } from "@/services/storage/demo-data";
import {
  readJsonFromStorage,
  removeFromStorage,
  writeJsonToStorage,
} from "@/services/storage/local-storage";
import { STORAGE_KEYS } from "@/services/storage/storage-keys";
import type { AppData } from "@/types/app-data";
import { APP_DATA_VERSION } from "@/types/app-data";
import type { NutritionalAssessment } from "@/types/assessment";
import type { MealPlan } from "@/types/meal-plan";
import type { Patient } from "@/types/patient";
import { createId } from "@/utils/id";

function normalizeAppData(data: AppData): AppData {
  return {
    version: data.version ?? APP_DATA_VERSION,
    patients: data.patients ?? [],
    assessments: data.assessments ?? [],
    mealPlans: data.mealPlans ?? [],
  };
}

export function loadAppData(): AppData {
  const stored = readJsonFromStorage<AppData>(STORAGE_KEYS.appData);
  if (!stored) {
    const demo = createDemoAppData();
    writeJsonToStorage(STORAGE_KEYS.appData, demo);
    return demo;
  }
  return normalizeAppData(stored);
}

export function saveAppData(data: AppData): void {
  writeJsonToStorage(STORAGE_KEYS.appData, data);
}

export function resetAppDataToDemo(): AppData {
  const demo = createDemoAppData();
  writeJsonToStorage(STORAGE_KEYS.appData, demo);
  return demo;
}

export function clearAllDemoStorage(): void {
  removeFromStorage(STORAGE_KEYS.appData);
  removeFromStorage(STORAGE_KEYS.auth);
}

const now = () => new Date().toISOString();

export function upsertPatient(data: AppData, patient: Patient): AppData {
  const exists = data.patients.some((p) => p.id === patient.id);
  const patients = exists
    ? data.patients.map((p) => (p.id === patient.id ? patient : p))
    : [...data.patients, patient];

  return { ...data, patients };
}

export function deletePatient(data: AppData, patientId: string): AppData {
  return {
    ...data,
    patients: data.patients.filter((p) => p.id !== patientId),
    assessments: data.assessments.filter((a) => a.patientId !== patientId),
    mealPlans: data.mealPlans.filter((m) => m.patientId !== patientId),
  };
}

export function upsertAssessment(
  data: AppData,
  assessment: NutritionalAssessment,
): AppData {
  const exists = data.assessments.some((a) => a.patientId === assessment.patientId);
  const assessments = exists
    ? data.assessments.map((a) =>
        a.patientId === assessment.patientId ? assessment : a,
      )
    : [...data.assessments, assessment];

  return { ...data, assessments };
}

export function getAssessmentForPatient(
  data: AppData,
  patientId: string,
): NutritionalAssessment | undefined {
  return data.assessments.find((a) => a.patientId === patientId);
}

export function upsertMealPlan(data: AppData, mealPlan: MealPlan): AppData {
  const exists = data.mealPlans.some((m) => m.patientId === mealPlan.patientId);
  const mealPlans = exists
    ? data.mealPlans.map((m) =>
        m.patientId === mealPlan.patientId ? mealPlan : m,
      )
    : [...data.mealPlans, mealPlan];

  return { ...data, mealPlans };
}

export function getMealPlanForPatient(
  data: AppData,
  patientId: string,
): MealPlan | undefined {
  return data.mealPlans.find((m) => m.patientId === patientId);
}

export function createEmptyMealPlan(patientId: string): MealPlan {
  return {
    id: createId(),
    patientId,
    title: "Plano alimentar",
    meals: [],
    notes: "",
    updatedAt: now(),
  };
}

export function createEmptyPatient(): Patient {
  const timestamp = now();
  return {
    id: createId(),
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    sex: "female",
    notes: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
