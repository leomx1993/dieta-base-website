import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DemoDisclaimer() {
  return (
    <Alert>
      <AlertTitle>Ambiente de demonstração</AlertTitle>
      <AlertDescription>
        Dados fictícios, cálculos simplificados e valores nutricionais ilustrativos.
        Não substituem avaliação ou conduta clínica profissional.
      </AlertDescription>
    </Alert>
  );
}
