import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NutritionTotals } from "@/utils/nutrition/food-nutrition";

interface NutritionSummaryProps {
  title?: string;
  totals: NutritionTotals;
  goals?: {
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
}

export function NutritionSummary({
  title = "Resumo nutricional",
  totals,
  goals,
}: NutritionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MacroItem
          label="Energia (kcal)"
          value={totals.energyKcal}
          goal={goals?.caloriesKcal}
        />
        <MacroItem label="Proteínas (g)" value={totals.proteinG} goal={goals?.proteinG} />
        <MacroItem label="Carboidratos (g)" value={totals.carbsG} goal={goals?.carbsG} />
        <MacroItem label="Lipídios (g)" value={totals.fatG} goal={goals?.fatG} />
      </CardContent>
    </Card>
  );
}

function MacroItem({
  label,
  value,
  goal,
}: {
  label: string;
  value: number;
  goal?: number;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
      {goal !== undefined && (
        <p className="text-xs text-muted-foreground">Meta demo: {goal}</p>
      )}
    </div>
  );
}
