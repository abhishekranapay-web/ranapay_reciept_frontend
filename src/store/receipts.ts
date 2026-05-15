import { create } from "zustand";
import type { Receipt } from "@/types/receipt";
import { generateReceiptNo, amountToWords } from "@/lib/receipt-utils";
import { AGENCY_NAME } from "@/constants/discoms";

const seed: Receipt[] = [
  {
    receiptNo: "RPA20260221984512",
    txnId: "PG2402211029881",
    agencyTxnId: "RP240221A0091",
    billNumber: "BL789210",
    customerName: "PRIYANKA SHARMA",
    accountNumber: "5009881272",
    totalPayable: 2480,
    mobileNumber: "9876543201",
    amountPaid: 2480,
    amountInWords: amountToWords(2480),
    connectionType: "POSTPAID",
    discom: "DVVNL",
    area: "URBAN",
    division: "AGRA CITY DIVISION-II",
    agentName: "RAVI VERMA",
    agentMobile: "9123456780",
    agentId: "AG10024",
    transactionStatus: "SUCCESS",
    paymentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    paymentMode: "PG",
    agencyName: AGENCY_NAME,
    paymentStatus: "SUCCESS",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    receiptNo: "RPA20260225117823",
    txnId: "WL2402251422771",
    agencyTxnId: "RP240225B0118",
    billNumber: "BL801993",
    customerName: "MOHAMMED IRFAN",
    accountNumber: "7700218819",
    totalPayable: 1175,
    mobileNumber: "9988221100",
    amountPaid: 1175,
    amountInWords: amountToWords(1175),
    connectionType: "PREPAID",
    discom: "PVVNL",
    area: "RURAL",
    division: "MEERUT GRAMEEN-I",
    agentName: "SUNIL KUMAR",
    agentMobile: "9012345670",
    agentId: "AG10078",
    transactionStatus: "SUCCESS",
    paymentDate: new Date(Date.now() - 86400000).toISOString(),
    paymentMode: "WALLET",
    agencyName: AGENCY_NAME,
    paymentStatus: "SUCCESS",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    receiptNo: "RPA20260301552204",
    txnId: "PG2403011890221",
    agencyTxnId: "RP240301C0231",
    billNumber: "BL902113",
    customerName: "ANITA DEVI",
    accountNumber: "4400118822",
    totalPayable: 5640,
    mobileNumber: "9001122334",
    amountPaid: 5640,
    amountInWords: amountToWords(5640),
    connectionType: "RAPDRP",
    discom: "PuVVNL",
    area: "URBAN",
    division: "VARANASI URBAN-III",
    agentName: "ARUN MISHRA",
    agentMobile: "9876012345",
    agentId: "AG10112",
    transactionStatus: "SUCCESS",
    paymentDate: new Date().toISOString(),
    paymentMode: "PG",
    agencyName: AGENCY_NAME,
    paymentStatus: "SUCCESS",
    createdAt: new Date().toISOString(),
  },
];

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
