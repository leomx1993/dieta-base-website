export type PatientSex = "female" | "male";

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  sex: PatientSex;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
