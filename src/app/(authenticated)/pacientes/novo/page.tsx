"use client";

import { useRouter } from "next/navigation";
import { PatientForm } from "@/components/domain/patient-form";
import { PageHeader } from "@/components/layout/page-header";
import { createEmptyPatient } from "@/services/storage/app-data-repository";
import { useAppData } from "@/hooks/use-app-data";
import { toast } from "sonner";

export default function NewPatientPage() {
  const router = useRouter();
  const { savePatient } = useAppData();
  const patient = createEmptyPatient();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Novo paciente"
        description="Cadastre um paciente fictício para testar o fluxo."
      />
      <PatientForm
        initial={patient}
        submitLabel="Criar paciente"
        onCancel={() => router.push("/pacientes")}
        onSubmit={(saved) => {
          savePatient(saved);
          toast.success("Paciente criado.");
          router.push(`/pacientes/${saved.id}`);
        }}
      />
    </div>
  );
}
