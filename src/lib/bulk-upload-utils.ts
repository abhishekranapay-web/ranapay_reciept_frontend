import * as XLSX from "xlsx";
import Papa from "papaparse";
import JSZip from "jszip";
import type { Receipt } from "@/types/receipt";

export interface BulkUploadRow {
  txnId: string;
  agencyTransactionId: string;
  customerName: string;
  accountNumber: string;
  totalPayableAmount: string | number;
  mobileNumber: string;
  amountPaid: string | number;
  amountPaidWords: string;
  connectionType: string;
  discom: string;
  area: string;
  division: string;
  agentName: string;
  agentMobile: string;
  agentId: string;
  transactionStatus: string;
  paymentDate: string;
  paymentMode: string;
  agencyName: string;
  paymentStatus: string;
}

const REQUIRED_COLUMNS = [
  "txnId",
  "agencyTransactionId",
  "customerName",
  "accountNumber",
  "totalPayableAmount",
  "mobileNumber",
  "amountPaid",
  "amountPaidWords",
  "connectionType",
  "discom",
  "area",
  "division",
  "agentName",
  "agentMobile",
  "agentId",
  "transactionStatus",
  "paymentDate",
  "paymentMode",
  "agencyName",
  "paymentStatus",
];

export function validateColumns(headers: string[]): { valid: boolean; missingColumns: string[] } {
  const normalizedHeaders = headers.map((h) => h.trim());
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !normalizedHeaders.includes(col));

  return {
    valid: missingColumns.length === 0,
    missingColumns,
  };
}

function excelSerialToISOString(value: number): string | null {
  if (typeof value !== "number" || value <= 0) return null;
  // Excel serial date to JS date. Excel serial 1 = 1900-01-01, so subtract 25569 days
  const msPerDay = 86400 * 1000;
  const date = new Date(Math.round((value - 25569) * msPerDay));
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

function normalizePaymentDate(value: unknown): string {
  if (typeof value === "number") {
    const iso = excelSerialToISOString(value);
    if (iso) return iso;
    return String(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      const iso = excelSerialToISOString(numeric);
      if (iso) return iso;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
    return trimmed;
  }

  return "";
}

function normalizeRow(row: Record<string, unknown>): BulkUploadRow {
  return {
    txnId: String(row.txnId ?? ""),
    agencyTransactionId: String(row.agencyTransactionId ?? ""),
    customerName: String(row.customerName ?? ""),
    accountNumber: String(row.accountNumber ?? ""),
    totalPayableAmount: (row.totalPayableAmount as string | number) ?? "",
    mobileNumber: String(row.mobileNumber ?? ""),
    amountPaid: (row.amountPaid as string | number) ?? "",
    amountPaidWords: String(row.amountPaidWords ?? ""),
    connectionType: String(row.connectionType ?? ""),
    discom: String(row.discom ?? ""),
    area: String(row.area ?? ""),
    division: String(row.division ?? ""),
    agentName: String(row.agentName ?? ""),
    agentMobile: String(row.agentMobile ?? ""),
    agentId: String(row.agentId ?? ""),
    transactionStatus: String(row.transactionStatus ?? ""),
    paymentDate: normalizePaymentDate(row.paymentDate),
    paymentMode: String(row.paymentMode ?? ""),
    agencyName: String(row.agencyName ?? ""),
    paymentStatus: String(row.paymentStatus ?? ""),
  };
}

export function validateRow(row: BulkUploadRow, rowIndex: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required fields
  if (!row.txnId) errors.push(`Row ${rowIndex}: txnId is required`);
  if (!row.customerName) errors.push(`Row ${rowIndex}: customerName is required`);
  if (!row.accountNumber) errors.push(`Row ${rowIndex}: accountNumber is required`);

  // Check numeric fields
  const totalPayable = Number(row.totalPayableAmount);
  if (isNaN(totalPayable) || totalPayable <= 0) {
    errors.push(`Row ${rowIndex}: totalPayableAmount must be a valid positive number`);
  }

  const amountPaid = Number(row.amountPaid);
  if (isNaN(amountPaid) || amountPaid < 0) {
    errors.push(`Row ${rowIndex}: amountPaid must be a valid number`);
  }

  // Validate connection type
  const validConnectionTypes = ["POSTPAID", "PREPAID", "RAPDRP"];
  if (!validConnectionTypes.includes(row.connectionType)) {
    errors.push(
      `Row ${rowIndex}: connectionType must be one of ${validConnectionTypes.join(", ")}`
    );
  }

  // Validate area
  const validAreas = ["RURAL", "URBAN"];
  if (!validAreas.includes(row.area)) {
    errors.push(`Row ${rowIndex}: area must be one of ${validAreas.join(", ")}`);
  }

  // Validate payment mode
  const validPaymentModes = ["PG", "WALLET"];
  if (!validPaymentModes.includes(row.paymentMode)) {
    errors.push(`Row ${rowIndex}: paymentMode must be one of ${validPaymentModes.join(", ")}`);
  }

  // Validate payment date format (ISO format YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(row.paymentDate)) {
    errors.push(`Row ${rowIndex}: paymentDate must be in YYYY-MM-DD format`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function parseFile(file: File): Promise<{
  data: BulkUploadRow[];
  headers: string[];
  error?: string;
}> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "xlsx" || fileExtension === "xls") {
    return parseExcelFile(file);
  } else if (fileExtension === "csv") {
    return parseCSVFile(file);
  } else {
    return {
      data: [],
      headers: [],
      error: "Invalid file format. Please upload an XLSX or CSV file.",
    };
  }
}

async function parseExcelFile(file: File): Promise<{
  data: BulkUploadRow[];
  headers: string[];
  error?: string;
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (!jsonData || jsonData.length === 0) {
      return {
        data: [],
        headers: [],
        error: "Excel file is empty",
      };
    }

    const headers = Object.keys(jsonData[0] as Record<string, unknown>);
    const data = (jsonData as Record<string, unknown>[]).map((row) => normalizeRow(row));
    return {
      data,
      headers,
    };
  } catch (err) {
    return {
      data: [],
      headers: [],
      error: `Failed to parse Excel file: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

async function parseCSVFile(file: File): Promise<{
  data: BulkUploadRow[];
  headers: string[];
  error?: string;
}> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results: {
        data: Record<string, unknown>[];
        meta: { fields?: string[] };
        errors: Array<{ message: string }>;
      }) {
        if (results.errors && results.errors.length > 0) {
          resolve({
            data: [],
            headers: [],
            error: `CSV parsing error: ${results.errors[0].message}`,
          });
          return;
        }

        const headers = results.meta.fields || [];
        const data = (results.data as Record<string, unknown>[]).map((row) => normalizeRow(row));
        resolve({
          data,
          headers,
        });
      },
      error(error: any) {
        resolve({
          data: [],
          headers: [],
          error: `CSV parsing error: ${error.message}`,
        });
      },
    });
  });
}

export function generateSampleFile(format: "xlsx" | "csv"): Blob {
  const sampleData = [
    {
      txnId: "TXN001",
      agencyTransactionId: "AGY001",
      billNumber: "89898891",
      customerName: "John Doe",
      accountNumber: "1234567890",
      totalPayableAmount: 5000,
      mobileNumber: "9876543210",
      amountPaid: 5000,
      connectionType: "POSTPAID",
      discom: "DVVNL",
      area: "URBAN",
      division: "JAIPUR",
      agentName: "Agent Smith",
      agentMobile: "8765432109",
      agentId: "AGT001",
      transactionStatus: "SUCCESS",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMode: "PG",
      agencyName: "Sample Agency",
      paymentStatus: "SUCCESS",
    },
  ];

  if (format === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } else {
    // CSV format
    const csv = Papa.unparse(sampleData);
    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }
}

export async function createZipFile(receipts: Receipt[], receiptPDFs: Map<string, Blob>): Promise<Blob> {
  const zip = new JSZip();
  const receiptsFolder = zip.folder("receipts");

  if (!receiptsFolder) {
    throw new Error("Failed to create zip folder");
  }

  for (const receipt of receipts) {
    const pdfBlob = receiptPDFs.get(receipt.receiptNo);
    if (pdfBlob) {
      receiptsFolder.file(`${receipt.receiptNo}.pdf`, pdfBlob);
    }
  }

  return zip.generateAsync({ type: "blob" });
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
