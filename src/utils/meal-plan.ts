import { getFoodByTacoId } from "@/data/taco-foods";
import type { MealPlan, MealPlanMeal } from "@/types/meal-plan";
import {
  nutritionForPortion,
  sumNutritionTotals,
  type NutritionTotals,
} from "@/utils/nutrition/food-nutrition";

export function calculateMealTotals(meal: MealPlanMeal): NutritionTotals {
  const portions = meal.items
    .map((item) => {
      const food = getFoodByTacoId(item.foodTacoId);
      if (!food) {
        return null;
      }
      return nutritionForPortion(food, item.quantityGrams);
    })
    .filter((item): item is NutritionTotals => item !== null);

  return sumNutritionTotals(portions);
}

export function calculateMealPlanTotals(mealPlan: MealPlan): NutritionTotals {
  return sumNutritionTotals(mealPlan.meals.map(calculateMealTotals));
}
