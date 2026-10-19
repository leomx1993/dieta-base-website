export function calculateAgeYears(birthDateIso: string, reference = new Date()): number {
  const birth = new Date(birthDateIso);
  if (Number.isNaN(birth.getTime())) {
    return 0;
  }

  let age = reference.getFullYear() - birth.getFullYear();
  const monthDiff = reference.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && reference.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return Math.max(age, 0);
}

export function formatDatePtBr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString("pt-BR");
}

export function formatDateTimePtBr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
