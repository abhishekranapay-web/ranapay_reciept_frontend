import { useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, ShieldCheck, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "./AppSidebar";
import { logout } from "@/lib/auth-api";


const titles: Record<string, string> = {
  "/": "Dashboard",
  "/create": "Create Receipt",
  "/history": "Receipt History",
};

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[pathname] ?? "RanaPay";

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-0 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="leading-tight">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            RanaPay India Pvt. Ltd.
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
      </div>
<Button
  variant="ghost"
  onClick={handleLogout}
  className="
    flex
    items-center
    gap-2
    text-red-600
    hover:bg-red-50
    hover:text-red-700
  "
>
  <LogOut className="h-5 w-5" />
  Logout
</Button>
    </header>
  );
}
