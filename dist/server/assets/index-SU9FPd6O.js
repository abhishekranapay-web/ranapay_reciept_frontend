import { r as reactExports, W as jsxRuntimeExports } from "./server-BZWttTzU.js";
import { L as Link } from "./router-BnyCT5Sc.js";
import { u as useReceiptStore, C as Card, f as format, a as formatINR } from "./receipts-BQf1ecjk.js";
import { c as createLucideIcon, m as motion, B as Button } from "./button-CyRTXsIQ.js";
import { S as StatusBadge } from "./StatusBadge-DS88GY5I.js";
import { F as FilePlusCorner, H as History } from "./history-8P8Ddff8.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode);
function DashboardPage() {
  const receipts = useReceiptStore((s) => s.receipts);
  const stats = reactExports.useMemo(() => {
    receipts.reduce((s, r) => s + r.amountPaid, 0);
    const today = receipts.filter((r) => new Date(r.paymentDate).toDateString() === (/* @__PURE__ */ new Date()).toDateString());
    today.reduce((s, r) => s + r.amountPaid, 0);
    return [
      // {
      //   label: "Total Collected",
      //   value: formatINR(total),
      //   delta: "+12.4%",
      //   icon: Wallet,
      //   accent: "from-primary to-primary-glow",
      // },
      // {
      //   label: "Receipts Issued",
      //   value: receipts.length.toString().padStart(2, "0"),
      //   delta: "+3 today",
      //   icon: ReceiptText,
      //   accent: "from-gold to-gold/70",
      // },
      // {
      //   label: "Today's Volume",
      //   value: formatINR(todayAmount),
      //   delta: `${today.length} txn`,
      //   icon: TrendingUp,
      //   accent: "from-primary-glow to-primary",
      // },
      // {
      //   label: "Active DISCOMs",
      //   value: Object.keys(DISCOMS).length.toString(),
      //   delta: "Pan-UP",
      //   icon: Zap,
      //   accent: "from-primary to-gold",
      // },
    ];
  }, [receipts]);
  const recent = receipts.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-7xl flex-col gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.5
    }, className: "relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-elegant md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-mesh opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-primary opacity-15 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
            " Print Receipts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl", children: "Issue official electricity receipts in seconds." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground md:text-base", children: "Generate pixel-perfect, agency-grade payment receipts for every UP DISCOM with dynamic logos, auto amount-to-words and instant PDF download." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "rounded-xl shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/create", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlusCorner, { className: "mr-2 h-4 w-4" }),
            " New Receipt"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "mr-2 h-4 w-4" }),
            " View History"
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s, i) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.05 * i,
        duration: 0.4
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative overflow-hidden border-border/60 p-5 transition-all hover:shadow-elegant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl bg-gradient-to-br p-2.5 ${s.accent}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-success", children: s.delta })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 text-2xl font-bold tracking-tight text-foreground number-tabular", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs uppercase tracking-wider text-muted-foreground", children: s.label })
      ] }) }, s.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border/60 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 px-6 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: "Recent receipts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Last ",
            recent.length,
            " payments processed"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", children: [
          "View all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/60", children: recent.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground", children: r.customerName.slice(0, 2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold text-foreground", children: r.customerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] text-muted-foreground", children: r.receiptNo })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden text-right md:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-foreground", children: r.discom }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: format(new Date(r.paymentDate), "dd MMM yyyy, HH:mm") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground number-tabular", children: formatINR(r.amountPaid) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "SUCCESS", className: "mt-1" })
        ] })
      ] }, r.receiptNo)) })
    ] })
  ] });
}
export {
  DashboardPage as component
};
