import type { AppData } from "@/types/app-data";
import { APP_DATA_VERSION } from "@/types/app-data";
import type { NutritionalAssessment } from "@/types/assessment";
import type { MealPlan } from "@/types/meal-plan";
import type { Patient } from "@/types/patient";
import {
  calculateDemoEnergyRequirementKcal,
  calculateDemoMacroGoals,
} from "@/utils/nutrition/demo-energy";
import { calculateAgeYears } from "@/utils/date";
import { createId } from "@/utils/id";

const now = () => new Date().toISOString();

function buildAssessment(patient: Patient): NutritionalAssessment {
  const anthropometrics = {
    weightKg: patient.sex === "female" ? 68 : 82,
    heightCm: patient.sex === "female" ? 165 : 178,
    activityLevel: "moderate" as const,
  };

  const energy = calculateDemoEnergyRequirementKcal({
    sex: patient.sex,
    ageYears: calculateAgeYears(patient.birthDate),
    weightKg: anthropometrics.weightKg,
    heightCm: anthropometrics.heightCm,
    activityLevel: anthropometrics.activityLevel,
  });

  return {
    id: createId(),
    patientId: patient.id,
    anthropometrics,
    energyRequirementKcal: energy,
    goals: calculateDemoMacroGoals(energy),
    notes: "Dados de demonstração — não representam avaliação clínica real.",
    updatedAt: now(),
  };
}

function buildMealPlan(patientId: string): MealPlan {
  return {
    id: createId(),
    patientId,
    title: "Plano alimentar demonstração",
    notes: "Substitua por orientações personalizadas em uso real do sistema.",
    updatedAt: now(),
    meals: [
      {
        id: createId(),
        type: "breakfast",
        name: "Café da manhã",
        items: [
          { id: createId(), foodTacoId: 12, quantityGrams: 40 },
          { id: createId(), foodTacoId: 6, quantityGrams: 200 },
          { id: createId(), foodTacoId: 8, quantityGrams: 100 },
        ],
      },
      {
        id: createId(),
        type: "lunch",
        name: "Almoço",
        items: [
          { id: createId(), foodTacoId: 2, quantityGrams: 150 },
          { id: createId(), foodTacoId: 3, quantityGrams: 100 },
          { id: createId(), foodTacoId: 4, quantityGrams: 120 },
          { id: createId(), foodTacoId: 14, quantityGrams: 80 },
        ],
      },
      {
        id: createId(),
        type: "afternoon_snack",
        name: "Lanche da tarde",
        items: [
          { id: createId(), foodTacoId: 7, quantityGrams: 170 },
          { id: createId(), foodTacoId: 9, quantityGrams: 130 },
        ],
      },
      {
        id: createId(),
        type: "dinner",
        name: "Jantar",
        items: [
          { id: createId(), foodTacoId: 19, quantityGrams: 150 },
          { id: createId(), foodTacoId: 13, quantityGrams: 150 },
          { id: createId(), foodTacoId: 15, quantityGrams: 50 },
        ],
      },
    ],
  };
}

export function createDemoAppData(): AppData {
  const created = now();

  const patients: Patient[] = [
    {
      id: createId(),
      fullName: "Ana Paula Mendes",
      email: "ana.mendes@email.demo",
      phone: "(11) 98765-4321",
      birthDate: "1990-03-15",
      sex: "female",
      notes: "Busca reeducação alimentar e rotina de treinos 3x/semana.",
      createdAt: created,
      updatedAt: created,
    },
    {
      id: createId(),
      fullName: "Carlos Eduardo Ribeiro",
      email: "carlos.ribeiro@email.demo",
      phone: "(21) 99876-1234",
      birthDate: "1985-07-22",
      sex: "male",
      notes: "Acompanhamento para ganho de massa muscular (demo).",
      createdAt: created,
      updatedAt: created,
    },
    {
      id: createId(),
      fullName: "Juliana Ferreira Costa",
      email: "juliana.costa@email.demo",
      phone: "(31) 97654-8899",
      birthDate: "1998-11-08",
      sex: "female",
      notes: "Vegetariana em transição — preferências registradas para demo.",
      createdAt: created,
      updatedAt: created,
    },
    {
      id: createId(),
      fullName: "Roberto Almeida Souza",
      email: "roberto.souza@email.demo",
      phone: "(41) 99123-4567",
      birthDate: "1972-01-30",
      sex: "male",
      notes: "Controle glicêmico em acompanhamento fictício.",
      createdAt: created,
      updatedAt: created,
    },
  ];

  const assessments = patients.map(buildAssessment);
  const mealPlans = patients.slice(0, 2).map((p) => buildMealPlan(p.id));

  return {
    version: APP_DATA_VERSION,
    patients,
    assessments,
    mealPlans,
  };
}
