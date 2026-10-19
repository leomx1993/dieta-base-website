import type { ActivityLevel } from "./activity-level";

export interface Anthropometrics {
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
}

export interface MacroGoals {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface NutritionalAssessment {
  id: string;
  patientId: string;
  anthropometrics: Anthropometrics;
  energyRequirementKcal: number;
  goals: MacroGoals;
  notes: string;
  updatedAt: string;
}
