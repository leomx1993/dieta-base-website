"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ACTIVITY_LEVEL_LABELS,
  type ActivityLevel,
} from "@/types/activity-level";
import type { NutritionalAssessment } from "@/types/assessment";
import type { Patient } from "@/types/patient";
import { calculateAgeYears } from "@/utils/date";
import {
  calculateDemoEnergyRequirementKcal,
  calculateDemoMacroGoals,
} from "@/utils/nutrition/demo-energy";
import { createId } from "@/utils/id";

interface AssessmentFormProps {
  patient: Patient;
  initial?: NutritionalAssessment;
  onSave: (assessment: NutritionalAssessment) => void;
}

export function AssessmentForm({
  patient,
  initial,
  onSave,
}: AssessmentFormProps) {
  const base = initial ?? {
    id: createId(),
    patientId: patient.id,
    anthropometrics: {
      weightKg: 70,
      heightCm: 170,
      activityLevel: "moderate" as ActivityLevel,
    },
    energyRequirementKcal: 0,
    goals: {
      caloriesKcal: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    },
    notes: "",
    updatedAt: new Date().toISOString(),
  };

  const [weightKg, setWeightKg] = useState(String(base.anthropometrics.weightKg));
  const [heightCm, setHeightCm] = useState(String(base.anthropometrics.heightCm));
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    base.anthropometrics.activityLevel,
  );
  const [notes, setNotes] = useState(base.notes);

  const preview = useMemo(() => {
    const weight = Number(weightKg);
    const height = Number(heightCm);
    if (!weight || !height) {
      return null;
    }
    const energy = calculateDemoEnergyRequirementKcal({
      sex: patient.sex,
      ageYears: calculateAgeYears(patient.birthDate),
      weightKg: weight,
      heightCm: height,
      activityLevel,
    });
    const goals = calculateDemoMacroGoals(energy);
    return { energy, goals };
  }, [weightKg, heightCm, activityLevel, patient]);

  function handleSave() {
    const weight = Number(weightKg);
    const height = Number(heightCm);
    if (!weight || !height || !preview) {
      return;
    }

    onSave({
      id: base.id,
      patientId: patient.id,
      anthropometrics: {
        weightKg: weight,
        heightCm: height,
        activityLevel,
      },
      energyRequirementKcal: preview.energy,
      goals: preview.goals,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });
  }

  const age = calculateAgeYears(patient.birthDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Nome:</span> {patient.fullName}
          </p>
          <p>
            <span className="text-muted-foreground">Idade (demo):</span> {age} anos
          </p>
          <p>
            <span className="text-muted-foreground">Sexo:</span>{" "}
            {patient.sex === "female" ? "Feminino" : "Masculino"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Antropometria</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              min={1}
              step={0.1}
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              min={1}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Nível de atividade (demo)</Label>
            <Select
              value={activityLevel}
              onValueChange={(v) => setActivityLevel(v as ActivityLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ACTIVITY_LEVEL_LABELS) as ActivityLevel[]).map(
                  (level) => (
                    <SelectItem key={level} value={level}>
                      {ACTIVITY_LEVEL_LABELS[level]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Estimativas demonstrativas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="GET estimado (kcal)" value={preview.energy} />
            <Stat label="Meta kcal" value={preview.goals.caloriesKcal} />
            <Stat label="Proteínas (g)" value={preview.goals.proteinG} />
            <Stat label="Carboidratos (g)" value={preview.goals.carbsG} />
            <Stat label="Lipídios (g)" value={preview.goals.fatG} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <Label htmlFor="assessment-notes">Observações da avaliação</Label>
        <Textarea
          id="assessment-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="button" onClick={handleSave} disabled={!preview}>
        Salvar avaliação
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
