import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as dfFormat } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeFormatDate(
  dateInput: unknown,
  fmt = "yyyy-MM-dd"
): string {
  if (dateInput === null || dateInput === undefined || dateInput === "") return "-";
  const d = dateInput instanceof Date ? dateInput : new Date(String(dateInput));
  if (isNaN(d.getTime())) return "-";
  try {
    return dfFormat(d, fmt);
  } catch (err) {
    return "-";
  }
}
