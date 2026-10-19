import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DemoDisclaimer } from "@/components/domain/demo-disclaimer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-6 lg:p-8">
          <div className="no-print">
            <DemoDisclaimer />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
