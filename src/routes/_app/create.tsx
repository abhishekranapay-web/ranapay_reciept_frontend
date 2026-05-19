import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CheckCircle2,
  Download,
  Loader2,
  Receipt as ReceiptIcon,
  RefreshCw,
  User,
  Wallet,
  UserCog,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { receiptSchema, type ReceiptFormValues } from "@/lib/receipt-schema";
import { useReceiptStore } from "@/store/receipts";
import { amountToWords } from "@/lib/receipt-utils";
import { createReceipt } from "@/lib/api";
import {
  CONNECTION_TYPES,
  AREAS,
  PAYMENT_MODES,
  DISCOMS,
  DISCOM_KEYS,
  AGENCY_NAME,
} from "@/constants/discoms";
// Lazy-load the PDF module so @react-pdf/renderer never runs during SSR
const downloadReceiptPDF = async (r: Receipt) => {
  const mod = await import("@/pdf/ReceiptPDF");
  return mod.downloadReceiptPDF(r);
};
import type { Receipt } from "@/types/receipt";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/create")({
  head: () => ({
    meta: [
      { title: "Create Receipt — RanaPay Console" },
      {
        name: "description",
        content:
          "Create a new electricity payment receipt with auto-generated receipt number, dynamic DISCOM mapping and instant PDF download.",
      },
    ],
  }),
  component: CreateReceiptPage,
});

function CreateReceiptPage() {
  const navigate = useNavigate();
  const nextReceiptNo = useReceiptStore((s) => s.nextReceiptNo);
  const addReceipt = useReceiptStore((s) => s.addReceipt);

  const [receiptNo, setReceiptNo] = useState<string>(() => nextReceiptNo());
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    mode: "onTouched",
    defaultValues: {
      receiptNo,
      txnId: "",
      agencyTxnId: "",
      billNumber: "",
      customerName: "",
      accountNumber: "",
      totalPayable: undefined as unknown as number,
      mobileNumber: "",
      amountPaid: undefined as unknown as number,
      connectionType: "POSTPAID",
      discom: "DVVNL",
      area: "URBAN",
      division: "",
      agentName: "",
      agentMobile: "",
      agentId: "",
      paymentDate: new Date().toISOString().slice(0, 16),
      paymentMode: "PG",
    },
  });

  const amountPaid = watch("amountPaid");
  const customerName = watch("customerName");

  useEffect(() => {
    setValue("receiptNo", receiptNo);
  }, [receiptNo, setValue]);

  useEffect(() => {
    if (customerName && customerName !== customerName.toUpperCase()) {
      setValue("customerName", customerName.toUpperCase(), { shouldValidate: false });
    }
  }, [customerName, setValue]);

  const words = useMemo(
    () => (amountPaid && amountPaid > 0 ? amountToWords(Number(amountPaid)) : ""),
    [amountPaid],
  );

  const onSubmit = async (data: ReceiptFormValues) => {
    setSubmitting(true);
    try {
      const receipt: Receipt = {
        ...data,
        discom: data.discom as Receipt["discom"],
        amountInWords: amountToWords(data.amountPaid),
        transactionStatus: "SUCCESS",
        paymentStatus: "SUCCESS",
        agencyName: AGENCY_NAME,
        paymentDate: new Date(data.paymentDate).toISOString(),
        createdAt: new Date().toISOString(),
        mobileNumber: data.mobileNumber || undefined,
      };

      // Call API to create receipt
      const createdReceipt = await createReceipt(receipt);

      // Add to local store
      addReceipt(createdReceipt);

      toast.success("Receipt generated", { description: createdReceipt.receiptNo });
      await downloadReceiptPDF(createdReceipt);
      navigate({ to: "/history" });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Failed to generate receipt";
      toast.error("Failed to generate receipt", { description: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const regenerate = () => {
    const next = nextReceiptNo();
    setReceiptNo(next);
    toast("New receipt number generated", { description: next });
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-1"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          New transaction
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Create a new receipt
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in the transaction, customer and agent details. Receipt number is auto-generated and
          unique.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <FormSection icon={ReceiptIcon} title="Transaction Information" delay={0}>
            <Field label="Receipt No." className="md:col-span-2">
              <div className="relative">
                <Input
                  value={receiptNo}
                  readOnly
                  className="h-11 cursor-not-allowed bg-muted/60 pr-24 font-mono text-sm font-semibold tracking-wide"
                />
                <button
                  type="button"
                  onClick={regenerate}
                  className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <RefreshCw className="h-3 w-3" /> New
                </button>
              </div>
            </Field>
            <Field label="Txn ID" error={errors.txnId?.message}>
              <Input className="h-11" placeholder="PG24…" {...register("txnId")} />
            </Field>
            <Field label="Agency Transaction ID" error={errors.agencyTxnId?.message}>
              <Input className="h-11" placeholder="RP24…" {...register("agencyTxnId")} />
            </Field>
            <Field label="Bill Number" error={errors.billNumber?.message}>
              <Input
                className="h-11"
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
                placeholder="BL12345"
                {...register("billNumber")}
              />
            </Field>
            <Field label="Payment Date" error={errors.paymentDate?.message}>
              <Input type="date" className="h-11" {...register("paymentDate")} />
            </Field>
            <Field label="Payment Mode" error={errors.paymentMode?.message}>
              <Controller
                control={control}
                name="paymentMode"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m === "PG" ? "Payment Gateway (PG)" : "Wallet"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Transaction Status">
              <ReadonlyPill value="SUCCESS" />
            </Field>
            <Field label="Payment Status">
              <ReadonlyPill value="SUCCESS" />
            </Field>
          </FormSection>

          <FormSection icon={User} title="Customer Information" delay={0.05}>
            <Field label="Customer Name" error={errors.customerName?.message}>
              <Input
                className="h-11 uppercase"
                placeholder="FULL NAME"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z\s]/g, "");
                }}
                {...register("customerName", {
                  required: "Customer name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters are allowed",
                  },
                })}
              />
            </Field>
            <Field label="Account Number" error={errors.accountNumber?.message}>
              <Input
                className="h-11"
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
                placeholder="1234567890"
                {...register("accountNumber")}
              />
            </Field>
            <Field label="Mobile Number (optional)" error={errors.mobileNumber?.message}>
              <Input
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
                className="h-11"
                placeholder="9XXXXXXXXX"
                maxLength={10}
                {...register("mobileNumber")}
              />
            </Field>
            <Field label="Connection Type" error={errors.connectionType?.message}>
              <Controller
                control={control}
                name="connectionType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONNECTION_TYPES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="DISCOM" error={errors.discom?.message}>
              <Controller
                control={control}
                name="discom"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISCOM_KEYS.map((k) => (
                        <SelectItem key={k} value={k}>
                          <span className="font-semibold">{k}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {DISCOMS[k].name.split(" ").slice(0, 2).join(" ")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Area" error={errors.area?.message}>
              <Controller
                control={control}
                name="area"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Division" error={errors.division?.message} className="md:col-span-2">
              <Input
                className="h-11"
                placeholder="e.g. AGRA CITY DIVISION-II"
                {...register("division")}
              />
            </Field>
          </FormSection>

          <FormSection icon={Wallet} title="Payment Information" delay={0.1}>
            <Field label="Total Payable Amount (₹)" error={errors.totalPayable?.message}>
              <Input
                type="number"
                step="0.01"
                className="h-11 number-tabular"
                placeholder="0.00"
                {...register("totalPayable")}
              />
            </Field>
            <Field label="Amount Paid (₹)" error={errors.amountPaid?.message}>
              <Input
                type="number"
                className="h-11 number-tabular"
                placeholder="0.00"
                {...register("amountPaid")}
              />
            </Field>
            <div className="md:col-span-2">
              <Label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount In Words
              </Label>
              <div className="rounded-xl border border-dashed border-border bg-gradient-surface px-4 py-3 text-sm font-semibold text-foreground">
                {words || (
                  <span className="font-normal text-muted-foreground">
                    Enter amount paid to auto-generate words…
                  </span>
                )}
              </div>
            </div>
          </FormSection>

          <FormSection icon={UserCog} title="Agent Information" delay={0.15}>
            <Field label="Agent Name" error={errors.agentName?.message}>
              <Input
                
                className="h-11"
                placeholder="Agent full name"
                {...register("agentName")}
              />
            </Field>
         {/* <Field label="Agent Mobile (Optional)"> */}
  {/* <Input
    inputMode="numeric"
    onInput={(e) => {
      e.currentTarget.value =
        e.currentTarget.value.replace(/\D/g, "")
    }}
    className="h-11"
    placeholder="9XXXXXXXXX"
    maxLength={10}
    {...register("agentMobile")}
  /> */}
  <Field label="Agent Mobile (Optional)" error={errors.agentMobile?.message}>
              <Input
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
                className="h-11"
                placeholder="9XXXXXXXXX"
                maxLength={10}
                {...register("agentMobile")}
              />
</Field>
            <Field label="Agent ID" error={errors.agentId?.message}>
              <Input className="h-11" placeholder="AG10001" {...register("agentId")} />
            </Field>
            <Field label="Agency Name">
              <ReadonlyPill value={AGENCY_NAME} subtle />
            </Field>
          </FormSection>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden border-border/60 p-0 shadow-elegant">
            <div className="bg-gradient-primary px-5 py-4 text-primary-foreground">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                Receipt preview
              </div>
              <div className="mt-1 font-mono text-sm font-semibold">{receiptNo}</div>
            </div>
            <div className="space-y-3 p-5 text-xs">
              <PreviewRow label="Customer" value={customerName || "—"} />
              <PreviewRow
                label="Amount Paid"
                value={amountPaid ? `₹ ${Number(amountPaid).toLocaleString("en-IN")}` : "—"}
                strong
              />
              <PreviewRow label="DISCOM" value={watch("discom")} />
              <PreviewRow label="Mode" value={watch("paymentMode")} />
              <div className="rounded-lg border border-success/20 bg-success/10 p-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Status: SUCCESS
                </div>
              </div>
            </div>
            <div className="border-t border-border/60 bg-muted/30 p-5">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-xl shadow-glow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Receipt PDF
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                Receipt is saved to history & downloaded instantly.
              </p>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof ReceiptIcon;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="overflow-hidden border-border/60 p-0 shadow-elegant">
        <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-surface px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
      </Card>
    </motion.div>
  );
}

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-medium text-destructive"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}

function ReadonlyPill({ value, subtle = false }: { value: string; subtle?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold",
        subtle
          ? "border-border bg-muted/40 text-foreground"
          : "border-success/30 bg-success/10 text-success",
      )}
    >
      {!subtle && <CheckCircle2 className="h-4 w-4" />}
      <span className="truncate">{value}</span>
    </div>
  );
}

function PreviewRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/60 pb-2 last:border-none last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right",
          strong ? "text-base font-bold text-foreground" : "font-semibold text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
