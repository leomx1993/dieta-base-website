"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DataReady } from "@/components/layout/data-ready";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/hooks/use-app-data";
import { formatDateTimePtBr } from "@/utils/date";

export default function DashboardPage() {
  return (
    <DataReady>
      <DashboardContent />
    </DataReady>
  );
}

function DashboardContent() {
  const { data } = useAppData();
  const patients = data?.patients ?? [];
  const recentPatients = [...patients]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const activity = [
    ...patients.map((p) => ({
      id: `p-${p.id}`,
      label: `Paciente atualizado: ${p.fullName}`,
      at: p.updatedAt,
    })),
    ...(data?.mealPlans ?? []).map((m) => ({
      id: `m-${m.id}`,
      label: `Plano alimentar atualizado`,
      at: m.updatedAt,
    })),
    ...(data?.assessments ?? []).map((a) => ({
      id: `a-${a.id}`,
      label: `Avaliação nutricional salva`,
      at: a.updatedAt,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Painel"
        description="Visão geral dos pacientes e atividades recentes (demonstração)."
        actions={
          <Link href="/pacientes/novo">
            <Button>Novo paciente</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Pacientes" value={patients.length} />
        <StatCard title="Avaliações" value={data?.assessments.length ?? 0} />
        <StatCard title="Planos alimentares" value={data?.mealPlans.length ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pacientes recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between gap-2 border-b pb-2 last:border-0"
              >
                <div>
                  <Link
                    href={`/pacientes/${patient.id}`}
                    className="font-medium hover:underline"
                  >
                    {patient.fullName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{patient.email}</p>
                </div>
                <Badge variant="secondary">Ativo (demo)</Badge>
              </div>
            ))}
            {recentPatients.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum paciente cadastrado.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="text-sm">
                <p>{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTimePtBr(item.at)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
