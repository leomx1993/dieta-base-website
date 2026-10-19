"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataReady } from "@/components/layout/data-ready";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppData } from "@/hooks/use-app-data";
import { formatDatePtBr } from "@/utils/date";

export default function PatientsPage() {
  return (
    <DataReady>
      <PatientsContent />
    </DataReady>
  );
}

function PatientsContent() {
  const { data } = useAppData();
  const [query, setQuery] = useState("");

  const patients = useMemo(() => {
    const list = data?.patients ?? [];
    const q = query.trim().toLowerCase();
    if (!q) {
      return list;
    }
    return list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q),
    );
  }, [data?.patients, query]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pacientes"
        description="Gerencie perfis fictícios de pacientes para a demonstração."
        actions={
          <Link href="/pacientes/novo">
            <Button>Novo paciente</Button>
          </Link>
        }
      />

      <Input
        placeholder="Buscar por nome, e-mail ou telefone…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Atualizado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.fullName}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{formatDatePtBr(patient.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/pacientes/${patient.id}`}>
                    <Button size="sm" variant="outline">Ver</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
