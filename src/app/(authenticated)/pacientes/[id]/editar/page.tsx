"use client";

import { useParams, useRouter } from "next/navigation";
import { PatientForm } from "@/components/domain/patient-form";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { toast } from "sonner";

export default function EditPatientPage() {
  return (
    <DataReady>
      <EditPatientContent />
    </DataReady>
  );
}

function EditPatientContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, savePatient } = useAppData();
  const patient = data?.patients.find((p) => p.id === params.id);

  if (!patient) {
    return (
      <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Editar paciente" />
      <PatientForm
        initial={patient}
        submitLabel="Salvar alterações"
        onCancel={() => router.push(`/pacientes/${patient.id}`)}
        onSubmit={(saved) => {
          savePatient(saved);
          toast.success("Paciente atualizado.");
          router.push(`/pacientes/${saved.id}`);
        }}
      />
    </div>
  );
}
