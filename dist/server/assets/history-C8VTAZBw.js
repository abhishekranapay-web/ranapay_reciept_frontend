import { r as reactExports, W as jsxRuntimeExports } from "./server-BZWttTzU.js";
import { u as useReceiptStore, C as Card, D as DISCOM_KEYS, b as DISCOMS, a as formatINR, f as format } from "./receipts-BQf1ecjk.js";
import { I as Input, L as LoaderCircle, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, D as Download, f as fetchReceiptHistory, s as searchReceipts } from "./api-BqIrg3m1.js";
import { c as createLucideIcon, M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, b as usePresence, d as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion, B as Button, a as cn } from "./button-CyRTXsIQ.js";
import { X, S as Sheet, b as SheetContent, d as SheetHeader, c as SheetTitle, e as SheetDescription } from "./sheet-BHQpMqu1.js";
import { S as StatusBadge } from "./StatusBadge-DS88GY5I.js";
import { t as toast } from "./router-BnyCT5Sc.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-o8uTy0vm.js";
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$2);
const __iconNode$1 = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$1);
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const downloadReceiptPDF = async (r) => {
  const mod = await import("./ReceiptPDF-hqcH9vl_.js");
  return mod.downloadReceiptPDF(r);
};
function HistoryPage() {
  const receipts = useReceiptStore((s) => s.receipts);
  const setReceipts = useReceiptStore((s) => s.setReceipts);
  const [q, setQ] = reactExports.useState("");
  const [discom, setDiscom] = reactExports.useState("ALL");
  const [active, setActive] = reactExports.useState(null);
  const [downloadingId, setDownloadingId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [searching, setSearching] = reactExports.useState(false);
  const searchTimeoutRef = reactExports.useRef();
  reactExports.useEffect(() => {
    const loadReceipts = async () => {
      setLoading(true);
      try {
        const data = await fetchReceiptHistory(100);
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
  const handleSearch = (searchTerm) => {
    setQ(searchTerm);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (!searchTerm.trim()) {
      setSearching(true);
      setLoading(true);
      try {
        fetchReceiptHistory(100).then((data) => {
          setReceipts(data);
        }).catch((error) => {
          console.error("Failed to load receipts:", error);
          toast.error("Failed to load receipts");
        }).finally(() => {
          setLoading(false);
          setSearching(false);
        });
      } catch (error) {
        setLoading(false);
        setSearching(false);
      }
      return;
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearching(true);
      searchReceipts(searchTerm).then((results) => {
        setReceipts(results);
      }).catch((error) => {
        console.error("Search failed:", error);
        toast.error("Search failed", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
      }).finally(() => {
        setSearching(false);
      });
    }, 300);
  };
  const filtered = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    return receipts.filter((r) => {
      if (discom !== "ALL" && r.discom !== discom) return false;
      if (!term) return true;
      return r.receiptNo.toLowerCase().includes(term) || r.txnId.toLowerCase().includes(term) || r.customerName.toLowerCase().includes(term) || (r.mobileNumber || "").includes(term);
    });
  }, [receipts, q, discom]);
  const onDownload = async (r) => {
    setDownloadingId(r.receiptNo);
    try {
      await downloadReceiptPDF(r);
      toast.success("Receipt downloaded", {
        description: r.receiptNo
      });
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };
  reactExports.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mb-6 flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary", children: "Archive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-foreground md:text-3xl", children: "Receipt history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Search by receipt no, transaction ID, customer name or mobile number." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-border/60 p-0 shadow-elegant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 border-b border-border/60 bg-gradient-surface p-4 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => handleSearch(e.target.value), placeholder: "Search receipts…", className: "h-11 pl-10 pr-10", disabled: loading || searching }),
          (q || searching) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSearch(""), className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted", children: searching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: discom, onValueChange: setDiscom, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11 md:w-56", disabled: loading || searching, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All DISCOMs" }),
            DISCOM_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: k }, k))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Showing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground number-tabular", children: filtered.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "of ",
            receipts.length
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 px-6 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "Loading receipts..." })
      ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onClear: () => {
        handleSearch("");
        setDiscom("ALL");
      } }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 bg-muted/30 text-left text-[10.5px] uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Receipt No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Txn ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right font-semibold", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.tr, { initial: {
          opacity: 0,
          y: 6
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0
        }, transition: {
          delay: i * 0.02,
          duration: 0.25
        }, className: "group border-b border-border/40 transition-colors hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 font-mono text-[12px] font-semibold text-foreground", children: r.receiptNo }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[11px] font-bold text-secondary-foreground", children: r.customerName.slice(0, 2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: r.customerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                DISCOMS[r.discom].key,
                " · ",
                r.connectionType
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 number-tabular font-semibold text-foreground", children: formatINR(r.amountPaid) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 font-mono text-[11.5px] text-muted-foreground", children: r.txnId }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4 text-[12px] text-muted-foreground", children: [
            format(new Date(r.paymentDate), "dd MMM yyyy"),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10.5px]", children: format(new Date(r.paymentDate), "HH:mm") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.paymentStatus }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-2", onClick: () => setActive(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 px-2 text-primary hover:text-primary", disabled: downloadingId === r.receiptNo, onClick: () => onDownload(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: cn("h-4 w-4", downloadingId === r.receiptNo && "animate-pulse") }) })
          ] }) })
        ] }, r.receiptNo)) }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!active, onOpenChange: (open) => !open && setActive(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { className: "w-full overflow-y-auto sm:max-w-lg", children: active && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-mono text-base", children: active.receiptNo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetDescription, { children: [
          "Issued ",
          format(new Date(active.paymentDate), "dd MMM yyyy, hh:mm a")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-primary px-4 py-5 text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80", children: "Amount paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-3xl font-bold tracking-tight number-tabular", children: formatINR(active.amountPaid) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] opacity-80", children: active.amountInWords })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailGroup, { title: "Customer", rows: [["Name", active.customerName], ["Account No", active.accountNumber], ["Mobile", active.mobileNumber || "—"], ["Connection", `${active.connectionType} · ${active.area}`]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailGroup, { title: "DISCOM", rows: [["Provider", DISCOMS[active.discom].name], ["Division", active.division], ["Bill No", active.billNumber]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailGroup, { title: "Transaction", rows: [["Txn ID", active.txnId], ["Agency Txn ID", active.agencyTxnId], ["Mode", active.paymentMode], ["Status", active.paymentStatus]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailGroup, { title: "Agent", rows: [["Name", active.agentName], ["Mobile", active.agentMobile], ["Agent ID", active.agentId]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "w-full rounded-xl shadow-glow", onClick: () => onDownload(active), disabled: downloadingId === active.receiptNo, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
          " Download Receipt PDF"
        ] })
      ] })
    ] }) }) })
  ] });
}
function DetailGroup({
  title,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border/60", children: rows.map(([k, v], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center justify-between gap-4 px-4 py-2.5 text-sm", i !== rows.length - 1 && "border-b border-border/60"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right font-semibold text-foreground", children: v })
    ] }, k)) })
  ] });
}
function EmptyState({
  onClear
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: "No receipts found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xs text-xs text-muted-foreground", children: "Try a different search term or clear the filters to see all receipts." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onClear, className: "mt-1", children: "Clear filters" })
  ] });
}
export {
  HistoryPage as component
};
