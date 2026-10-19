"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MealPlanPreview } from "@/components/domain/meal-plan-preview";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getMealPlanForPatient } from "@/services/storage/app-data-repository";
import { useAppData } from "@/hooks/use-app-data";
import { useAuth } from "@/hooks/use-auth";

export default function MealPlanPreviewPage() {
  return (
    <DataReady>
      <PreviewContent />
    </DataReady>
  );
}

function PreviewContent() {
  const params = useParams<{ id: string }>();
  const { data } = useAppData();
  const { session } = useAuth();
  const patient = data?.patients.find((p) => p.id === params.id);
  const mealPlan = data && patient
    ? getMealPlanForPatient(data, patient.id)
    : undefined;

  if (!patient) {
    return (
      <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>
    );
  }

  if (!mealPlan || mealPlan.meals.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Nenhum plano salvo para este paciente. Edite o plano antes de imprimir.
        </p>
        <Link href={`/pacientes/${patient.id}/plano-alimentar`}>
          <Button>Ir para o editor</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Pré-visualização do plano"
          description="Use Imprimir ou Salvar como PDF no diálogo do navegador."
          actions={
            <>
              <Button type="button" onClick={() => window.print()}>
                Imprimir / PDF
              </Button>
              <Link href={`/pacientes/${patient.id}/plano-alimentar`}>
                <Button variant="outline">Voltar ao editor</Button>
              </Link>
            </>
          }
        />
      </div>
      <MealPlanPreview
        patient={patient}
        mealPlan={mealPlan}
        nutritionistName={session?.username ?? "nutri"}
      />
    </div>
  );
}
