import { W as jsxRuntimeExports } from "./server-BZWttTzU.js";
import { a as cn } from "./button-CyRTXsIQ.js";
import { c as CircleCheck } from "./receipts-BQf1ecjk.js";
function StatusBadge({
  status,
  className
}) {
  const map = {
    SUCCESS: "bg-success/10 text-success border-success/20",
    PENDING: "bg-warning/10 text-warning-foreground border-warning/30",
    FAILED: "bg-destructive/10 text-destructive border-destructive/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map[status],
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        status
      ]
    }
  );
}
export {
  StatusBadge as S
};
