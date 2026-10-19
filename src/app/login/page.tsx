"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DemoDisclaimer } from "@/components/domain/demo-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { DEMO_PASSWORD, DEMO_USERNAME } from "@/services/auth/auth-service";

export default function LoginPage() {
  const { login, isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isReady, isAuthenticated, router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Credenciais inválidas. Use nutri / nutri para a demonstração.");
      return;
    }
    const redirect = searchParams.get("redirect") || "/dashboard";
    router.replace(redirect);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">DietaBase</h1>
          <p className="text-sm text-muted-foreground">
            Acesso demonstrativo para nutricionistas
          </p>
        </div>
        <DemoDisclaimer />
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Acessar</Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo: usuário <strong>nutri</strong> e senha <strong>nutri</strong>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
