export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "intense";

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentário",
  light: "Leve",
  moderate: "Moderado",
  intense: "Intenso",
};
