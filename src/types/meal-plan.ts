export type MealType =
  | "breakfast"
  | "morning_snack"
  | "lunch"
  | "afternoon_snack"
  | "dinner"
  | "supper";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Café da manhã",
  morning_snack: "Lanche da manhã",
  lunch: "Almoço",
  afternoon_snack: "Lanche da tarde",
  dinner: "Jantar",
  supper: "Ceia",
};

export interface MealPlanFoodItem {
  id: string;
  foodTacoId: number;
  quantityGrams: number;
}

export interface MealPlanMeal {
  id: string;
  type: MealType;
  name: string;
  items: MealPlanFoodItem[];
}

export interface MealPlan {
  id: string;
  patientId: string;
  title: string;
  meals: MealPlanMeal[];
  notes: string;
  updatedAt: string;
}
