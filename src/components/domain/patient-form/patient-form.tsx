"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { Patient, PatientSex } from "@/types/patient";

interface PatientFormProps {
  initial: Patient;
  submitLabel: string;
  onSubmit: (patient: Patient) => void;
  onCancel?: () => void;
}

interface PatientFormErrors {
  fullName?: string;
  email?: string;
  birthDate?: string;
}

export function PatientForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const [patient, setPatient] = useState<Patient>(initial);
  const [errors, setErrors] = useState<PatientFormErrors>({});

  function validate(): boolean {
    const next: PatientFormErrors = {};
    if (!patient.fullName.trim()) {
      next.fullName = "Informe o nome completo.";
    }
    if (!patient.email.trim()) {
      next.email = "Informe o e-mail.";
    }
    if (!patient.birthDate) {
      next.birthDate = "Informe a data de nascimento.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit({
      ...patient,
      fullName: patient.fullName.trim(),
      email: patient.email.trim(),
      phone: patient.phone.trim(),
      notes: patient.notes.trim(),
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            value={patient.fullName}
            onChange={(e) =>
              setPatient((p) => ({ ...p, fullName: e.target.value }))
            }
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={patient.email}
            onChange={(e) =>
              setPatient((p) => ({ ...p, email: e.target.value }))
            }
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={patient.phone}
            onChange={(e) =>
              setPatient((p) => ({ ...p, phone: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            value={patient.birthDate}
            onChange={(e) =>
              setPatient((p) => ({ ...p, birthDate: e.target.value }))
            }
            aria-invalid={Boolean(errors.birthDate)}
          />
          {errors.birthDate && (
            <p className="text-xs text-destructive">{errors.birthDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Sexo biológico (demo)</Label>
          <Select
            value={patient.sex}
            onValueChange={(value) =>
              setPatient((p) => ({ ...p, sex: value as PatientSex }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="male">Masculino</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          rows={4}
          value={patient.notes}
          onChange={(e) =>
            setPatient((p) => ({ ...p, notes: e.target.value }))
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
