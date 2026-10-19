import type { ActivityLevel } from "@/types/activity-level";
import type { MacroGoals } from "@/types/assessment";
import type { PatientSex } from "@/types/patient";

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725,
};

/**
 * Cálculo simplificado apenas para demonstração da interface (não clínico).
 * Base: fórmula tipo Mifflin-St Jeor + fator de atividade genérico.
 */
export function calculateDemoEnergyRequirementKcal(params: {
  sex: PatientSex;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
}): number {
  const { sex, ageYears, weightKg, heightCm, activityLevel } = params;
  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;

  const tdee = bmr * ACTIVITY_FACTORS[activityLevel];
  return Math.round(Math.max(tdee, 1200));
}

/**
 * Distribuição macro ilustrativa (30% proteína, 45% carboidrato, 25% lipídio em kcal).
 */
export function calculateDemoMacroGoals(caloriesKcal: number): MacroGoals {
  const proteinG = Math.round((caloriesKcal * 0.3) / 4);
  const carbsG = Math.round((caloriesKcal * 0.45) / 4);
  const fatG = Math.round((caloriesKcal * 0.25) / 9);

  return {
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
  };
}
