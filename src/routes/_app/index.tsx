import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  ArrowUpRight,
  FilePlus2,
  History,
  ReceiptText,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReceiptStore } from "@/store/receipts";
import { formatINR } from "@/lib/receipt-utils";
import { safeFormatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/receipts/StatusBadge";
import { DISCOMS } from "@/constants/discoms";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RanaPay Receipts Console" },
      {
        name: "description",
        content:
          "Premium fintech dashboard for generating official electricity payment receipts across DVVNL, PVVNL, PuVVNL, KESCO and MVVNL.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const receipts = useReceiptStore((s) => s.receipts);

  const stats = useMemo(() => {
    const total = receipts.reduce((s, r) => s + r.amountPaid, 0);
    const today = receipts.filter(
      (r) => new Date(r.paymentDate).toDateString() === new Date().toDateString(),
    );
    const todayAmount = today.reduce((s, r) => s + r.amountPaid, 0);
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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-elegant md:p-10"
      >
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-primary opacity-15 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Print Receipts
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Issue official electricity receipts in seconds.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Generate pixel-perfect, agency-grade payment receipts for every UP DISCOM with
              dynamic logos, auto amount-to-words and instant PDF download.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-xl shadow-glow">
              <Link to="/create">
                <FilePlus2 className="mr-2 h-4 w-4" /> New Receipt
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link to="/history">
                <History className="mr-2 h-4 w-4" /> View History
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
            >
              <Card className="group relative overflow-hidden border-border/60 p-5 transition-all hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl bg-gradient-to-br p-2.5 ${s.accent}`}>
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-[11px] font-medium text-success">{s.delta}</span>
                </div>
                <div className="mt-5 text-2xl font-bold tracking-tight text-foreground number-tabular">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent activity */}
      <Card className="overflow-hidden border-border/60 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">Recent receipts</h3>
            <p className="text-xs text-muted-foreground">Last {recent.length} payments processed</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link to="/history">
              View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border/60">
          {recent.map((r) => (
            <div
              key={r.receiptNo}
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-foreground">
                  {r.customerName.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {r.customerName}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">{r.receiptNo}</div>
                </div>
              </div>
              <div className="hidden text-right md:block">
                <div className="text-xs font-medium text-foreground">{r.discom}</div>
                <div className="text-[11px] text-muted-foreground">
                  {safeFormatDate(r.paymentDate, "yyyy-MM-dd")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground number-tabular">
                  {formatINR(r.amountPaid)}
                </div>
                <StatusBadge status="SUCCESS" className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
