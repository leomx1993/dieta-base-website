import { getFoodByTacoId } from "@/data/taco-foods";
import type { MealPlan } from "@/types/meal-plan";
import type { Patient } from "@/types/patient";
import { formatDatePtBr } from "@/utils/date";
import { calculateMealPlanTotals, calculateMealTotals } from "@/utils/meal-plan";
import { nutritionForPortion } from "@/utils/nutrition/food-nutrition";

interface MealPlanPreviewProps {
  patient: Patient;
  mealPlan: MealPlan;
  nutritionistName?: string;
}

export function MealPlanPreview({
  patient,
  mealPlan,
  nutritionistName = "Nutricionista (demo)",
}: MealPlanPreviewProps) {
  const totals = calculateMealPlanTotals(mealPlan);

  return (
    <article className="meal-plan-print space-y-6 rounded-lg border bg-card p-6 print:border-0 print:p-0">
      <header className="space-y-1 border-b pb-4">
        <h1 className="text-xl font-semibold">{mealPlan.title}</h1>
        <p className="text-sm text-muted-foreground">
          Paciente: {patient.fullName} · Gerado em{" "}
          {formatDatePtBr(mealPlan.updatedAt)}
        </p>
        <p className="text-sm text-muted-foreground">
          Profissional: {nutritionistName}
        </p>
        <p className="text-xs text-muted-foreground">
          Documento demonstrativo — não constitui prescrição clínica.
        </p>
      </header>

      {mealPlan.meals.map((meal) => {
        const mealTotals = calculateMealTotals(meal);
        return (
          <section key={meal.id} className="space-y-2">
            <h2 className="text-base font-semibold">{meal.name}</h2>
            <ul className="space-y-1 text-sm">
              {meal.items.map((item) => {
                const food = getFoodByTacoId(item.foodTacoId);
                if (!food) {
                  return null;
                }
                const portion = nutritionForPortion(food, item.quantityGrams);
                return (
                  <li key={item.id} className="flex justify-between gap-4">
                    <span>
                      {food.name} — {item.quantityGrams} g
                    </span>
                    <span className="text-muted-foreground">
                      {portion.energyKcal} kcal
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground">
              Subtotal: {mealTotals.energyKcal} kcal · P {mealTotals.proteinG} g
              · C {mealTotals.carbsG} g · G {mealTotals.fatG} g
            </p>
          </section>
        );
      })}

      <footer className="border-t pt-4 text-sm">
        <p className="font-medium">Total do dia (demo)</p>
        <p>
          {totals.energyKcal} kcal · Proteínas {totals.proteinG} g ·
          Carboidratos {totals.carbsG} g · Lipídios {totals.fatG} g
        </p>
        {mealPlan.notes && (
          <p className="mt-2 text-muted-foreground">
            Observações: {mealPlan.notes}
          </p>
        )}
      </footer>
    </article>
  );
}
