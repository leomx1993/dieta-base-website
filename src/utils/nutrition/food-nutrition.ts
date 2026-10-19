import type { FoodItem } from "@/types/food";

export interface NutritionTotals {
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export const EMPTY_NUTRITION_TOTALS: NutritionTotals = {
  energyKcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
};

export function nutritionForPortion(
  food: FoodItem,
  quantityGrams: number,
): NutritionTotals {
  const factor = quantityGrams / 100;
  return {
    energyKcal: round1(food.energyKcal * factor),
    proteinG: round1(food.proteinG * factor),
    carbsG: round1(food.carbsG * factor),
    fatG: round1(food.fatG * factor),
    fiberG: round1(food.fiberG * factor),
  };
}

export function sumNutritionTotals(
  items: NutritionTotals[],
): NutritionTotals {
  return items.reduce(
    (acc, item) => ({
      energyKcal: round1(acc.energyKcal + item.energyKcal),
      proteinG: round1(acc.proteinG + item.proteinG),
      carbsG: round1(acc.carbsG + item.carbsG),
      fatG: round1(acc.fatG + item.fatG),
      fiberG: round1(acc.fiberG + item.fiberG),
    }),
    { ...EMPTY_NUTRITION_TOTALS },
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
