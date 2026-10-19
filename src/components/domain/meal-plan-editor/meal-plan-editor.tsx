"use client";

import { useState } from "react";
import { getFoodByTacoId } from "@/data/taco-foods";
import { FoodSearchDialog } from "@/components/domain/food-search-dialog";
import { NutritionSummary } from "@/components/domain/nutrition-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MacroGoals } from "@/types/assessment";
import {
  MEAL_TYPE_LABELS,
  type MealPlan,
  type MealPlanMeal,
  type MealType,
} from "@/types/meal-plan";
import { createId } from "@/utils/id";
import { calculateMealPlanTotals, calculateMealTotals } from "@/utils/meal-plan";
import { nutritionForPortion } from "@/utils/nutrition/food-nutrition";

interface MealPlanEditorProps {
  mealPlan: MealPlan;
  goals?: MacroGoals;
  onChange: (mealPlan: MealPlan) => void;
  onSave: () => void;
}

export function MealPlanEditor({
  mealPlan,
  goals,
  onChange,
  onSave,
}: MealPlanEditorProps) {
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);

  const totals = calculateMealPlanTotals(mealPlan);

  function updatePlan(patch: Partial<MealPlan>) {
    onChange({
      ...mealPlan,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  function updateMeals(meals: MealPlanMeal[]) {
    updatePlan({ meals });
  }

  function addMeal() {
    const type: MealType = "lunch";
    const meal: MealPlanMeal = {
      id: createId(),
      type,
      name: MEAL_TYPE_LABELS[type],
      items: [],
    };
    updateMeals([...mealPlan.meals, meal]);
  }

  function removeMeal(mealId: string) {
    updateMeals(mealPlan.meals.filter((m) => m.id !== mealId));
  }

  function updateMeal(mealId: string, patch: Partial<MealPlanMeal>) {
    updateMeals(
      mealPlan.meals.map((m) => (m.id === mealId ? { ...m, ...patch } : m)),
    );
  }

  function openFoodPicker(mealId: string) {
    setActiveMealId(mealId);
    setFoodDialogOpen(true);
  }

  function addFoodToMeal(tacoId: number) {
    if (!activeMealId) {
      return;
    }
    updateMeals(
      mealPlan.meals.map((meal) => {
        if (meal.id !== activeMealId) {
          return meal;
        }
        return {
          ...meal,
          items: [
            ...meal.items,
            { id: createId(), foodTacoId: tacoId, quantityGrams: 100 },
          ],
        };
      }),
    );
  }

  function updateItemQuantity(
    mealId: string,
    itemId: string,
    quantityGrams: number,
  ) {
    updateMeals(
      mealPlan.meals.map((meal) => {
        if (meal.id !== mealId) {
          return meal;
        }
        return {
          ...meal,
          items: meal.items.map((item) =>
            item.id === itemId ? { ...item, quantityGrams } : item,
          ),
        };
      }),
    );
  }

  function removeItem(mealId: string, itemId: string) {
    updateMeals(
      mealPlan.meals.map((meal) => {
        if (meal.id !== mealId) {
          return meal;
        }
        return {
          ...meal,
          items: meal.items.filter((item) => item.id !== itemId),
        };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="plan-title">Título do plano</Label>
          <Input
            id="plan-title"
            value={mealPlan.title}
            onChange={(e) => updatePlan({ title: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan-notes">Observações</Label>
        <Textarea
          id="plan-notes"
          rows={2}
          value={mealPlan.notes}
          onChange={(e) => updatePlan({ notes: e.target.value })}
        />
      </div>

      <NutritionSummary totals={totals} goals={goals} />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={addMeal}>
          Adicionar refeição
        </Button>
        <Button type="button" onClick={onSave}>Salvar plano</Button>
      </div>

      <div className="space-y-4">
        {mealPlan.meals.map((meal) => {
          const mealTotals = calculateMealTotals(meal);
          return (
            <Card key={meal.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={meal.type}
                    onValueChange={(value) => {
                      const type = value as MealType;
                      updateMeal(meal.id, {
                        type,
                        name: MEAL_TYPE_LABELS[type],
                      });
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(MEAL_TYPE_LABELS) as MealType[]).map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {MEAL_TYPE_LABELS[type]}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    className="w-48"
                    value={meal.name}
                    onChange={(e) =>
                      updateMeal(meal.id, { name: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openFoodPicker(meal.id)}
                  >
                    Adicionar alimento
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeMeal(meal.id)}
                  >
                    Remover refeição
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {meal.items.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum alimento nesta refeição.
                  </p>
                )}
                {meal.items.map((item) => {
                  const food = getFoodByTacoId(item.foodTacoId);
                  if (!food) {
                    return null;
                  }
                  const portion = nutritionForPortion(food, item.quantityGrams);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {portion.energyKcal} kcal · P {portion.proteinG} g · C{" "}
                          {portion.carbsG} g · G {portion.fatG} g
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="sr-only" htmlFor={`q-${item.id}`}>
                          Quantidade em gramas
                        </Label>
                        <Input
                          id={`q-${item.id}`}
                          type="number"
                          min={1}
                          className="w-24"
                          value={item.quantityGrams}
                          onChange={(e) =>
                            updateItemQuantity(
                              meal.id,
                              item.id,
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                        <span className="text-xs text-muted-foreground">g</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(meal.id, item.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  Subtotal da refeição: {mealTotals.energyKcal} kcal
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <FoodSearchDialog
        open={foodDialogOpen}
        onOpenChange={setFoodDialogOpen}
        onSelect={(food) => addFoodToMeal(food.tacoId)}
      />
    </div>
  );
}
