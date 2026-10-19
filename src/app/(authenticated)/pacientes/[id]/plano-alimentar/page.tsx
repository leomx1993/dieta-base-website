"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MealPlanEditor } from "@/components/domain/meal-plan-editor";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  createEmptyMealPlan,
  getAssessmentForPatient,
  getMealPlanForPatient,
} from "@/services/storage/app-data-repository";
import { useAppData } from "@/hooks/use-app-data";
import type { AppData } from "@/types/app-data";
import type { MealPlan } from "@/types/meal-plan";
import type { Patient } from "@/types/patient";
import { toast } from "sonner";

export default function MealPlanPage() {
  return (
    <DataReady>
      <MealPlanContent />
    </DataReady>
  );
}

function MealPlanContent() {
  const params = useParams<{ id: string }>();
  const { data } = useAppData();
  const patient = data?.patients.find((p) => p.id === params.id);

  if (!patient || !data) {
    return (
      <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>
    );
  }

  return <MealPlanPatientEditor key={patient.id} patient={patient} data={data} />;
}

function MealPlanPatientEditor({
  patient,
  data,
}: {
  patient: Patient;
  data: AppData;
}) {
  const { saveMealPlan } = useAppData();
  const [mealPlan, setMealPlan] = useState<MealPlan>(() =>
    getMealPlanForPatient(data, patient.id) ?? createEmptyMealPlan(patient.id),
  );
  const assessment = getAssessmentForPatient(data, patient.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plano alimentar"
        description={`Montagem do plano para ${patient.fullName} (dados fictícios).`}
        actions={
          <Link href={`/pacientes/${patient.id}/plano-alimentar/visualizar`}>
            <Button variant="outline">Pré-visualizar</Button>
          </Link>
        }
      />
      <MealPlanEditor
        mealPlan={mealPlan}
        goals={assessment?.goals}
        onChange={setMealPlan}
        onSave={() => {
          saveMealPlan(mealPlan);
          toast.success("Plano alimentar salvo.");
        }}
      />
    </div>
  );
}
