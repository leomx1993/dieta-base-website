"use client";

import { useParams } from "next/navigation";
import { AssessmentForm } from "@/components/domain/assessment-form";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { getAssessmentForPatient } from "@/services/storage/app-data-repository";
import { useAppData } from "@/hooks/use-app-data";
import { toast } from "sonner";

export default function AssessmentPage() {
  return (
    <DataReady>
      <AssessmentContent />
    </DataReady>
  );
}

function AssessmentContent() {
  const params = useParams<{ id: string }>();
  const { data, saveAssessment } = useAppData();
  const patient = data?.patients.find((p) => p.id === params.id);

  if (!patient || !data) {
    return (
      <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>
    );
  }

  const existing = getAssessmentForPatient(data, patient.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Avaliação nutricional"
        description="Antropometria e metas demonstrativas — não substituem método clínico validado."
      />
      <AssessmentForm
        patient={patient}
        initial={existing}
        onSave={(assessment) => {
          saveAssessment(assessment);
          toast.success("Avaliação salva.");
        }}
      />
    </div>
  );
}
