"use client";

import { useMemo, useState } from "react";
import { TACO_FOODS } from "@/data/taco-foods";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FoodItem } from "@/types/food";

interface FoodSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (food: FoodItem) => void;
}

export function FoodSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: FoodSearchDialogProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return TACO_FOODS.slice(0, 20);
    }
    return TACO_FOODS.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.group.toLowerCase().includes(q),
    ).slice(0, 40);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buscar alimento (TACO — demo)</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nome ou grupo…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ScrollArea className="h-72 pr-2">
          <ul className="space-y-1">
            {results.map((food) => (
              <li key={food.tacoId}>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-full flex-col items-start gap-0.5 px-2 py-2"
                  onClick={() => {
                    onSelect(food);
                    onOpenChange(false);
                    setQuery("");
                  }}
                >
                  <span className="font-medium">{food.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {food.group} · {food.energyKcal} kcal / 100 g
                  </span>
                </Button>
              </li>
            ))}
            {results.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum alimento encontrado.
              </p>
            )}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
