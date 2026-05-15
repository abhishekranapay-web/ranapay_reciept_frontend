import { z } from "zod";
import { CONNECTION_TYPES, AREAS, PAYMENT_MODES, DISCOM_KEYS } from "@/constants/discoms";

export const receiptSchema = z.object({
  receiptNo: z.string().regex(/^RPA\d{8,}$/, "Invalid receipt number"),
  txnId: z.string().trim().min(3, "Txn ID is required").max(40),
  agencyTxnId: z.string().trim().min(3, "Agency Txn ID is required").max(40),
  billNumber: z.string().trim().min(1, "Bill number is required").max(30),
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name is required")
    .max(80)
    .transform((v) => v.toUpperCase()),
  accountNumber: z
    .string()
    .trim()
    .min(4, "Account number is required")
    .max(20)
    .regex(/^[0-9A-Z\-]+$/i, "Only letters, digits and hyphen"),
  totalPayable: z.coerce.number().positive("Must be greater than 0").max(10_000_000),
  mobileNumber: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[6-9]\d{9}$/.test(v), {
      message: "Enter a valid 10-digit Indian mobile number",
    }),
  amountPaid: z.coerce.number().positive("Must be greater than 0").max(10_000_000),
  connectionType: z.enum(CONNECTION_TYPES),
  discom: z.enum(DISCOM_KEYS as [string, ...string[]]),
  area: z.enum(AREAS),
  division: z.string().trim().min(2, "Division is required").max(60),
  agentName: z.string().trim().min(2, "Agent name is required").max(60),
  agentMobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  agentId: z.string().trim().min(2, "Agent ID is required").max(20),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMode: z.enum(PAYMENT_MODES),
});

export type ReceiptFormValues = z.infer<typeof receiptSchema>;
