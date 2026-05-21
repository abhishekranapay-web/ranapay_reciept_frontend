import { create } from "zustand";
import type { Receipt } from "@/types/receipt";
import { generateReceiptNo, amountToWords } from "@/lib/receipt-utils";
import { AGENCY_NAME } from "@/constants/discoms";

const seed: Receipt[] = [];

interface ReceiptStore {
  receipts: Receipt[];
  addReceipt: (r: Receipt) => void;
  setReceipts: (receipts: Receipt[]) => void;
  getByNo: (no: string) => Receipt | undefined;
  nextReceiptNo: () => string;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: seed,
  addReceipt: (r) => set((s) => ({ receipts: [r, ...s.receipts] })),
  setReceipts: (receipts) => set({ receipts }),
  getByNo: (no) => get().receipts.find((r) => r.receiptNo === no),
  nextReceiptNo: () => {
    const existing = new Set(get().receipts.map((r) => r.receiptNo));
    let candidate = generateReceiptNo();
    while (existing.has(candidate)) candidate = generateReceiptNo();
    return candidate;
  },
}));
