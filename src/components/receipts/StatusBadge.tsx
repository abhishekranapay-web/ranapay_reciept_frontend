import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function StatusBadge({
  status,
  className,
}: {
  status: "SUCCESS" | "PENDING" | "FAILED";
  className?: string;
}) {
  const map = {
    SUCCESS: "bg-success/10 text-success border-success/20",
    PENDING: "bg-warning/10 text-warning-foreground border-warning/30",
    FAILED: "bg-destructive/10 text-destructive border-destructive/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map[status],
        className,
      )}
    >
      <CheckCircle2 className="h-3 w-3" />
      {status}
    </span>
  );
}
