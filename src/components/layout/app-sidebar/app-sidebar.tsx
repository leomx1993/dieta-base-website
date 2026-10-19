"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Apple, LayoutDashboard, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";
const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/alimentos", label: "Alimentos (TACO)", icon: Apple },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { resetDemoData } = useAppData();

  return (
    <aside className="app-sidebar no-print flex h-full w-64 flex-col border-r bg-card">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold">DietaBase</p>
        <p className="text-xs text-muted-foreground">MVP demonstração</p>
      </div>
      <Separator />
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 p-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            resetDemoData();
          }}
        >
          <RotateCcw className="size-4" />
          Restaurar dados demo
        </Button>
        <p className="px-1 text-[11px] leading-snug text-muted-foreground">
          Use o menu no topo para sair da conta demo.
        </p>
      </div>
    </aside>
  );
}
