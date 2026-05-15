import { O as useRouter, W as jsxRuntimeExports, r as reactExports, a1 as Outlet } from "./server-bhKnM5Md.js";
import { L as Link } from "./router-qrUiLGXb.js";
import { c as createLucideIcon, m as motion, a as cn, B as Button } from "./button-CmAG6Ixo.js";
import { F as FilePlusCorner, H as History } from "./history-l8iUuAxQ.js";
import { S as Sheet, a as SheetTrigger, b as SheetContent, c as SheetTitle } from "./sheet-D5gKwmQg.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-q_D442Ej.js";
function useRouterState(opts) {
  const contextRouter = useRouter({ warn: opts?.router === void 0 });
  const router = opts?.router || contextRouter;
  {
    const state = router.stores.__store.get();
    return opts?.select ? opts.select(state) : state;
  }
}
const __iconNode$2 = [
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ["path", { d: "M15.947 12.65a4 4 0 0 0-5.925-4.128", key: "dpwdj0" }],
  ["path", { d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z", key: "s09mg5" }]
];
const CloudSun = createLucideIcon("cloud-sun", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
const __iconNode = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode);
const today = /* @__PURE__ */ new Date();
const formattedDate = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long"
});
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/create", label: "Create Receipt", icon: FilePlusCorner },
  { to: "/history", label: "Receipt History", icon: History }
];
function AppSidebar({ onNavigate }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 px-6 py-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold tracking-tight", children: "RanaPay" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]  tracking-[0.18em] text-sidebar-foreground/60", children: "Receipts Console" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mt-2 flex flex-1 flex-col gap-1 px-3", children: nav.map((item) => {
      const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          onClick: onNavigate,
          className: cn(
            "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
            active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          ),
          children: [
            active && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                layoutId: "active-pill",
                className: "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary",
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "m-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1b1d] to-[#101012] p-4 shadow-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-500/10 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: {
                y: [0, -6, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity
              },
              className: "absolute right-4 top-4 text-3xl"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-sm font-semibold text-white", children: formattedDate })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: {
                  rotate: [0, 5, -5, 0]
                },
                transition: {
                  duration: 4,
                  repeat: Infinity
                },
                className: "rounded-xl bg-white/5 p-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudSun, { className: "h-6 w-6 text-yellow-400" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-end justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-bold text-white", children: "34°" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "☀️" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-white/50", children: "Sunny vibes in Lucknow" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                whileHover: { y: -2 },
                className: "rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70",
                children: "🌤 Humid"
              }
            ) })
          ] })
        ]
      }
    ) })
  ] });
}
const titles = {
  "/": "Dashboard",
  "/create": "Create Receipt",
  "/history": "Receipt History"
};
function AppHeader() {
  const [open, setOpen] = reactExports.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[pathname] ?? "RanaPay";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "left", className: "w-72 border-0 bg-sidebar p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "sr-only", children: "Navigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, { onNavigate: () => setOpen(false) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "RanaPay India Pvt. Ltd." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold tracking-tight text-foreground", children: title })
    ] })
  ] }) });
}
function AppLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden w-72 shrink-0 md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4 py-6 md:px-8 md:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppLayout as component
};
