import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FilePlus2, History, Zap, Sparkles, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CloudSun, CloudRain, Sun, CloudLightning } from "lucide-react";

const today = new Date();

const formattedDate = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/create", label: "Create Receipt", icon: FilePlus2 },
  { to: "/bulk-upload", label: "Bulk Upload", icon: Upload },
  { to: "/history", label: "Receipt History", icon: History },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-6 py-7">
      
        <div className="leading-tight">
          <div className="text-base font-bold tracking-tight">RanaPay</div>
          <div className="text-[11px]  tracking-[0.18em] text-sidebar-foreground/60">
            Receipts Console
          </div>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1b1d] to-[#101012] p-4 shadow-2xl"
        >
          {/* Glow */}
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-500/10 blur-3xl" />

          {/* Floating Emoji */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute right-4 top-4 text-3xl"
          ></motion.div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">Today</p>

              <h2 className="mt-1 text-sm font-semibold text-white">{formattedDate}</h2>
            </div>

            {/* Animated Weather Icon */}
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="rounded-xl bg-white/5 p-2"
            >
              <CloudSun className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>

          {/* Weather */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-white">34°</span>

                <span className="text-lg">☀️</span>
              </div>

              <p className="mt-1 text-xs text-white/50">Sunny vibes in Lucknow</p>
            </div>

            {/* Mini Weather Pills */}
            <div className="flex gap-2">
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
              >
                🌤 Humid
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
