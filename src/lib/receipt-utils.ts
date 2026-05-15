import { format } from "date-fns";

/**
 * Generate a unique receipt number prefixed with RPA followed by
 * YYYYMMDD + 8-digit random suffix. Example: RPA20260304124598.
 */
export function generateReceiptNo(): string {
  const datePart = format(new Date(), "yyyyMMdd");
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `RPA${datePart}${rand.toString().slice(0, 8)}`.slice(0, 17);
}

const ones = [
  "",
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "TEN",
  "ELEVEN",
  "TWELVE",
  "THIRTEEN",
  "FOURTEEN",
  "FIFTEEN",
  "SIXTEEN",
  "SEVENTEEN",
  "EIGHTEEN",
  "NINETEEN",
];
const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

function twoDigit(n: number): string {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${tens[t]} ${ones[o]}` : tens[t];
}

function threeDigit(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ones[h]} HUNDRED`);
  if (r) parts.push(twoDigit(r));
  return parts.join(" ");
}

/**
 * Convert a number (in INR) to Indian-system words.
 * Example: 5000 -> "FIVE THOUSAND RUPEES"
 */
export function amountToWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "ZERO RUPEES";
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  const segments: string[] = [];

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const hundred = rupees % 1000;

  if (crore) segments.push(`${twoDigit(crore)} CRORE`);
  if (lakh) segments.push(`${twoDigit(lakh)} LAKH`);
  if (thousand) segments.push(`${twoDigit(thousand)} THOUSAND`);
  if (hundred) segments.push(threeDigit(hundred));

  let words = segments.join(" ").replace(/\s+/g, " ").trim() + " RUPEES";
  if (paise > 0) words += ` AND ${twoDigit(paise)} PAISE`;
  return words + " ONLY";
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
