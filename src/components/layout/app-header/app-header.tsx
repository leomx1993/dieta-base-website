"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

function initialsFromUsername(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) {
    return "?";
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function AppHeader() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const username = session?.username ?? "nutri";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="no-print sticky top-0 z-40 flex h-14 shrink-0 items-center justify-end gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2"
              aria-label="Menu da conta"
            >
              <Avatar size="sm">
                <AvatarFallback>
                  {initialsFromUsername(username)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                {username}
              </span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">Conta demo</p>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
