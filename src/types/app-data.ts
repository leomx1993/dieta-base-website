import type { NutritionalAssessment } from "./assessment";
import type { MealPlan } from "./meal-plan";
import type { Patient } from "./patient";

export const APP_DATA_VERSION = 1;

export interface AppData {
  version: number;
  patients: Patient[];
  assessments: NutritionalAssessment[];
  mealPlans: MealPlan[];
}
