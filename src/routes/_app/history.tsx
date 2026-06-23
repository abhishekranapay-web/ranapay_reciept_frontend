import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeFormatDate } from "@/lib/utils";
import { Download, Eye, Search, X, Inbox, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useReceiptStore } from "@/store/receipts";
import { formatINR } from "@/lib/receipt-utils";
import { fetchReceiptHistory, searchReceipts } from "@/lib/api";
const downloadReceiptPDF = async (r: Receipt) => {
  const mod = await import("@/pdf/ReceiptPDF");
  return mod.downloadReceiptPDF(r);
};
import { StatusBadge } from "@/components/receipts/StatusBadge";
import { DISCOMS, DISCOM_KEYS } from "@/constants/discoms";
import type { Receipt } from "@/types/receipt";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "Receipt History — RanaPay Console" },
      {
        name: "description",
        content:
          "Search, view and download every electricity payment receipt issued through RanaPay.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const receipts = useReceiptStore((s) => s.receipts);
  const setReceipts = useReceiptStore((s) => s.setReceipts);
  const [q, setQ] = useState("");
  const [discom, setDiscom] = useState<string>("ALL");
  const [active, setActive] = useState<Receipt | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Receipt[] | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const cardRef = useRef<HTMLDivElement>(null);
  const wasSearchingRef = useRef(false);

  // Scroll to search card when search begins
  useEffect(() => {
    const isSearching = q.trim().length > 0;
    if (isSearching && !wasSearchingRef.current && cardRef.current) {
      const headerOffset = 80;
      const elementPosition = cardRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    wasSearchingRef.current = isSearching;
  }, [q]);

  // Load receipts on mount
  useEffect(() => {
    const loadReceipts = async () => {
      setLoading(true);
      try {
        const data = await fetchReceiptHistory(1000);
        setReceipts(data);
      } catch (error) {
        console.error("Failed to load receipts:", error);
        toast.error("Failed to load receipts");
      } finally {
        setLoading(false);
      }
    };
    loadReceipts();
  }, [setReceipts]);

  // Debounced search handler
  const handleSearch = (searchTerm: string) => {
    setQ(searchTerm);

    // Reset search results to null to instantly query the full local cache
    setSearchResults(null);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchTerm.trim()) {
      return;
    }

    // Debounce API search (150ms delay)
    searchTimeoutRef.current = setTimeout(() => {
      setSearching(true);
      searchReceipts(searchTerm)
        .then((results) => {
          setSearchResults(results);
        })
        .catch((error) => {
          console.error("Search failed:", error);
          toast.error("Search failed", {
            description: error instanceof Error ? error.message : "Unknown error",
          });
        })
        .finally(() => {
          setSearching(false);
        });
    }, 150);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const sourceList = searchResults !== null ? searchResults : receipts;
    return sourceList.filter((r) => {
      if (discom !== "ALL" && r.discom !== discom) return false;
      if (!term) return true;
      return (
        r.receiptNo.toLowerCase().includes(term) ||
        r.txnId.toLowerCase().includes(term) ||
        r.customerName.toLowerCase().includes(term) ||
        r.accountNumber.toLowerCase().includes(term) ||
        (r.mobileNumber || "").includes(term)
      );
    });
  }, [receipts, searchResults, q, discom]);

  const onDownload = async (r: Receipt) => {
    setDownloadingId(r.receiptNo);
    try {
      await downloadReceiptPDF(r);
      toast.success("Receipt downloaded", { description: r.receiptNo });
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-1"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Archive
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Receipt history
        </h2>
        <p className="text-sm text-muted-foreground">
          Search by receipt no, transaction ID, customer name, account number or mobile number.
        </p>
      </motion.div>

      <Card ref={cardRef} className="overflow-hidden border-border/60 p-0 shadow-elegant">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-gradient-surface p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search receipts…"
              className="h-11 pl-10 pr-10"
              disabled={loading}
            />
            {(q || searching) && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          <Select value={discom} onValueChange={setDiscom}>
            <SelectTrigger className="h-11 md:w-56" disabled={loading}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All DISCOMs</SelectItem>
              {DISCOM_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs">
            <span className="text-muted-foreground">Showing</span>
            <span className="font-semibold text-foreground number-tabular">{filtered.length}</span>
            <span className="text-muted-foreground">of {receipts.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-sm font-semibold text-foreground">Loading receipts...</div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              onClear={() => {
                handleSearch("");
                setDiscom("ALL");
              }}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Receipt No</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Txn ID</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((r, i) => (
                    <motion.tr
                      key={r.receiptNo}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.25 }}
                      className="group border-b border-border/40 transition-colors hover:bg-muted/40"
                    >
                      <td className="px-5 py-4 font-mono text-[12px] font-semibold text-foreground">
                        {r.receiptNo}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[11px] font-bold text-secondary-foreground">
                            {r.customerName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{r.customerName}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {/* {DISCOMS[r.discom].key} · {r.connectionType} */}
                              {DISCOMS[r.discom]?.key || r.discom || "Unknown"} · {r.connectionType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 number-tabular font-semibold text-foreground">
                        {formatINR(r.amountPaid)}
                      </td>
                      <td className="px-5 py-4 font-mono text-[11.5px] text-muted-foreground">
                        {r.txnId}
                      </td>
                      <td className="px-5 py-4 text-[12px] text-muted-foreground">
    
                        {safeFormatDate(r.paymentDate, "yyyy-MM-dd")}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.paymentStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setActive(r)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-primary hover:text-primary"
                            disabled={downloadingId === r.receiptNo}
                            onClick={() => onDownload(r)}
                          >
                            <Download
                              className={cn(
                                "h-4 w-4",
                                downloadingId === r.receiptNo && "animate-pulse",
                              )}
                            />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Details drawer */}
      <Sheet open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {active && (
            <>
                <SheetHeader>
                <SheetTitle className="font-mono text-base">{active.receiptNo}</SheetTitle>
                <SheetDescription>
                  Issued {safeFormatDate(active.paymentDate, "yyyy-MM-dd")}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="overflow-hidden rounded-2xl border border-border/60">
                  <div className="bg-gradient-primary px-4 py-5 text-primary-foreground">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
                      Amount paid
                    </div>
                    <div className="mt-1 text-3xl font-bold tracking-tight number-tabular">
                      {formatINR(active.amountPaid)}
                    </div>
                    <div className="mt-1 text-[11px] opacity-80">{active.amountInWords}</div>
                  </div>
                </div>
                <DetailGroup
                  title="Customer"
                  rows={[
                    ["Name", active.customerName],
                    ["Account No", active.accountNumber],
                    ["Mobile", active.mobileNumber || "—"],
                    ["Connection", `${active.connectionType} · ${active.area}`],
                  ]}
                />
                <DetailGroup
                  title="DISCOM"
                  rows={[
                    // ["Provider", DISCOMS[active.discom].name],
                    ["Provider", DISCOMS[active.discom]?.name || active.discom || "Unknown"],
                    ["Division", active.division],
                    ["Bill No", active.billNumber],
                  ]}
                />
                <DetailGroup
                  title="Transaction"
                  rows={[
                    ["Txn ID", active.txnId],
                    ["Agency Txn ID", active.agencyTxnId],
                    ["Mode", active.paymentMode],
                    ["Status", active.paymentStatus],
                  ]}
                />
                <DetailGroup
                  title="Agent"
                  rows={[
                    ["Name", active.agentName],
                    ["Mobile", active.agentMobile],
                    ["Agent ID", active.agentId],
                  ]}
                />
                <Button
                  size="lg"
                  className="w-full rounded-xl shadow-glow"
                  onClick={() => onDownload(active)}
                  disabled={downloadingId === active.receiptNo}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Receipt PDF
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailGroup({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </div>
      <div className="overflow-hidden rounded-xl border border-border/60">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={cn(
              "flex items-center justify-between gap-4 px-4 py-2.5 text-sm",
              i !== rows.length - 1 && "border-b border-border/60",
            )}
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="text-right font-semibold text-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <div className="text-sm font-semibold text-foreground">No receipts found</div>
      <p className="max-w-xs text-xs text-muted-foreground">
        Try a different search term or clear the filters to see all receipts.
      </p>
      <Button variant="outline" size="sm" onClick={onClear} className="mt-1">
        Clear filters
      </Button>
    </div>
  );
}
