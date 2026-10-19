"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAssessmentForPatient,
  getMealPlanForPatient,
} from "@/services/storage/app-data-repository";
import { useAppData } from "@/hooks/use-app-data";
import { calculateAgeYears, formatDatePtBr } from "@/utils/date";
import { toast } from "sonner";

export default function PatientDetailPage() {
  return (
    <DataReady>
      <PatientDetailContent />
    </DataReady>
  );
}

function PatientDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, removePatient } = useAppData();
  const patient = data?.patients.find((p) => p.id === params.id);

  if (!patient) {
    return (
      <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>
    );
  }

  const assessment = data ? getAssessmentForPatient(data, patient.id) : undefined;
  const mealPlan = data ? getMealPlanForPatient(data, patient.id) : undefined;

  function handleDelete(current: NonNullable<typeof patient>) {
    if (
      !window.confirm(
        `Excluir o paciente ${current.fullName}? Esta ação remove avaliação e plano associados.`,
      )
    ) {
      return;
    }
    removePatient(current.id);
    toast.success("Paciente removido.");
    router.push("/pacientes");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={patient.fullName}
        description="Perfil do paciente e atalhos do fluxo clínico (demo)."
        actions={
          <>
            <Link href={`/pacientes/${patient.id}/editar`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Button variant="destructive" onClick={() => handleDelete(patient)}>
              Excluir
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados cadastrais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">E-mail:</span> {patient.email}
          </p>
          <p>
            <span className="text-muted-foreground">Telefone:</span> {patient.phone}
          </p>
          <p>
            <span className="text-muted-foreground">Nascimento:</span>{" "}
            {formatDatePtBr(patient.birthDate)} ({calculateAgeYears(patient.birthDate)} anos)
          </p>
          <p>
            <span className="text-muted-foreground">Sexo:</span>{" "}
            {patient.sex === "female" ? "Feminino" : "Masculino"}
          </p>
          {patient.notes && (
            <p className="sm:col-span-2">
              <span className="text-muted-foreground">Observações:</span>{" "}
              {patient.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <WorkflowCard
          title="Avaliação nutricional"
          description={
            assessment
              ? `GET demo: ${assessment.energyRequirementKcal} kcal`
              : "Ainda não registrada."
          }
          href={`/pacientes/${patient.id}/avaliacao`}
          cta="Abrir avaliação"
        />
        <WorkflowCard
          title="Plano alimentar"
          description={
            mealPlan
              ? `${mealPlan.meals.length} refeições · ${mealPlan.title}`
              : "Crie o plano a partir da avaliação."
          }
          href={`/pacientes/${patient.id}/plano-alimentar`}
          cta="Editar plano"
        />
        <WorkflowCard
          title="Visualizar / imprimir"
          description="Pré-visualização para impressão ou PDF do navegador."
          href={`/pacientes/${patient.id}/plano-alimentar/visualizar`}
          cta="Abrir prévia"
        />
      </div>
    </div>
  );
}

function WorkflowCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link href={href}>
          <Button className="w-full">{cta}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
