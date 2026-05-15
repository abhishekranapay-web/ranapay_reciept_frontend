import type { Receipt } from "@/types/receipt";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ranapay-reciept-backend.vercel.app";

/**
 * Transform Receipt to API format (map field names)
 */
function toAPIFormat(receipt: Receipt): Record<string, unknown> {
  return {
    receiptNumber: receipt.receiptNo,
    txnId: receipt.txnId,
    agencyTransactionId: receipt.agencyTxnId,
    billNumber: receipt.billNumber,
    customerName: receipt.customerName,
    accountNumber: receipt.accountNumber,
    totalPayableAmount: receipt.totalPayable,
    mobileNumber: receipt.mobileNumber,
    amountPaid: receipt.amountPaid,
    amountPaidWords: receipt.amountInWords,
    connectionType: receipt.connectionType,
    discom: receipt.discom,
    area: receipt.area,
    division: receipt.division,
    agentName: receipt.agentName,
    agentMobile: receipt.agentMobile,
    agentId: receipt.agentId,
    transactionStatus: receipt.transactionStatus,
    paymentDate: receipt.paymentDate,
    paymentMode: receipt.paymentMode,
    agencyName: receipt.agencyName,
    paymentStatus: receipt.paymentStatus,
    createdAt: receipt.createdAt,
  };
}

/**
 * Transform API response to Receipt format (reverse field mapping)
 */
function fromAPIFormat(data: Record<string, unknown>): Receipt {
  return {
    receiptNo: String(data.receiptNumber || data.receiptNo || ""),
    txnId: String(data.transactionId || data.txnId || ""),
    agencyTxnId: String(data.agencyTransactionId || data.agencyTxnId || ""),
    billNumber: String(data.billNumber || ""),
    customerName: String(data.customerName || ""),
    accountNumber: String(data.accountNumber || ""),
    totalPayable: Number(data.totalPayableAmount || data.totalPayable || 0),
    mobileNumber: data.mobileNumber ? String(data.mobileNumber) : undefined,
    amountPaid: Number(data.amountPaid || 0),
    amountInWords: String(data.amountPaidWords || data.amountInWords || ""),
    connectionType: String(data.connectionType) as "POSTPAID" | "PREPAID" | "RAPDRP",
    discom: String(data.discom) as Receipt["discom"],
    area: String(data.area) as "RURAL" | "URBAN",
    division: String(data.division || ""),
    agentName: String(data.agentName || ""),
    agentMobile: String(data.agentMobile || ""),
    agentId: String(data.agentId || ""),
    transactionStatus: "SUCCESS",
    paymentDate: String(data.paymentDate || ""),
    paymentMode: String(data.paymentMode) as "PG" | "WALLET",
    agencyName: String(data.agencyName || ""),
    paymentStatus: "SUCCESS",
    createdAt: String(data.createdAt || ""),
  };
}

/**
 * Fetch all receipts with limit
 */
export async function fetchReceiptHistory(limit: number = 10): Promise<Receipt[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/receipts/history?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }
    const data = await response.json();
    // API may return { data: [] } or directly []
    const receipts = Array.isArray(data) ? data : data.data || [];
    return receipts.map((r: Record<string, unknown>) => fromAPIFormat(r));
  } catch (error) {
    console.error("Error fetching receipt history:", error);
    throw error;
  }
}

/**
 * Create a new receipt
 */
export async function createReceipt(receipt: Receipt): Promise<Receipt> {
  try {
    const apiPayload = toAPIFormat(receipt);
    const response = await fetch(`${BASE_URL}/api/receipts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    });
    if (!response.ok) {
      throw new Error(`Failed to create receipt: ${response.statusText}`);
    }
    const data = await response.json();
    const result = data.data || data;
    return fromAPIFormat(result);
  } catch (error) {
    console.error("Error creating receipt:", error);
    throw error;
  }
}

/**
 * Fetch a single receipt by ID
 */
export async function fetchReceiptById(id: string): Promise<Receipt> {
  try {
    const response = await fetch(`${BASE_URL}/api/receipts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch receipt: ${response.statusText}`);
    }
    const data = await response.json();
    const result = data.data || data;
    return fromAPIFormat(result);
  } catch (error) {
    console.error("Error fetching receipt by ID:", error);
    throw error;
  }
}

/**
 * Search receipts by query string
 */
export async function searchReceipts(searchQuery: string): Promise<Receipt[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/receipts/search?search=${encodeURIComponent(searchQuery)}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to search receipts: ${response.statusText}`);
    }
    const data = await response.json();
    const receipts = Array.isArray(data) ? data : data.data || [];
    return receipts.map((r: Record<string, unknown>) => fromAPIFormat(r));
  } catch (error) {
    console.error("Error searching receipts:", error);
    throw error;
  }
}
