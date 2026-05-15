import type { DiscomKey } from "@/constants/discoms";

export interface Receipt {
  receiptNo: string;
  txnId: string;
  agencyTxnId: string;
  billNumber: string;
  customerName: string;
  accountNumber: string;
  totalPayable: number;
  mobileNumber?: string;
  amountPaid: number;
  amountInWords: string;
  connectionType: "POSTPAID" | "PREPAID" | "RAPDRP";
  discom: DiscomKey;
  area: "RURAL" | "URBAN";
  division: string;
  agentName: string;
  agentMobile: string;
  agentId: string;
  transactionStatus: "SUCCESS";
  paymentDate: string; // ISO
  paymentMode: "PG" | "WALLET";
  agencyName: string;
  paymentStatus: "SUCCESS";
  createdAt: string;
}
