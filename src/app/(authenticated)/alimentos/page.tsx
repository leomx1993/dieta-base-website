"use client";

import { useMemo, useState } from "react";
import { TACO_FOODS } from "@/data/taco-foods";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FoodsPage() {
  const [query, setQuery] = useState("");

  const foods = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return TACO_FOODS;
    }
    return TACO_FOODS.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.group.toLowerCase().includes(q) ||
        String(food.tacoId).includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tabela de alimentos (TACO — demo)"
        description="Catálogo ilustrativo com valores por 100 g para demonstração."
      />
      <Input
        className="max-w-md"
        placeholder="Buscar alimento ou grupo…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Alimento</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead className="text-right">kcal</TableHead>
              <TableHead className="text-right">P (g)</TableHead>
              <TableHead className="text-right">C (g)</TableHead>
              <TableHead className="text-right">G (g)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foods.map((food) => (
              <TableRow key={food.tacoId}>
                <TableCell>{food.tacoId}</TableCell>
                <TableCell className="font-medium">{food.name}</TableCell>
                <TableCell>{food.group}</TableCell>
                <TableCell className="text-right">{food.energyKcal}</TableCell>
                <TableCell className="text-right">{food.proteinG}</TableCell>
                <TableCell className="text-right">{food.carbsG}</TableCell>
                <TableCell className="text-right">{food.fatG}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
