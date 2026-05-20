import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Package,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  parseFile,
  generateSampleFile,
  downloadFile,
  createZipFile,
  type BulkUploadRow,
} from "@/lib/bulk-upload-utils";
import { useReceiptStore } from "@/store/receipts";
import { generateReceiptNo, formatINR } from "@/lib/receipt-utils";
import type { Receipt } from "@/types/receipt";

export const Route = createFileRoute("/_app/bulk-upload")({
  head: () => ({
    meta: [
      { title: "Bulk Upload Receipts — RanaPay Console" },
      {
        name: "description",
        content:
          "Upload multiple receipts via XLSX or CSV file and generate bulk receipts with validation and batch download.",
      },
    ],
  }),
  component: BulkUploadPage,
});

interface GeneratedReceipt extends Receipt {
  rowIndex: number;
}

interface ApiError {
  rowIndex: number;
  error: string;
  field?: string;
}

function BulkUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addReceipt = useReceiptStore((s) => s.addReceipt);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<BulkUploadRow[]>([]);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  const [generatedReceipts, setGeneratedReceipts] = useState<GeneratedReceipt[]>([]);
  const [receiptPDFs, setReceiptPDFs] = useState<Map<string, Blob>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

 const handleFileSelect = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setUploadedFile(file);
  setUploadedData([]);
  setGeneratedReceipts([]);
  setApiErrors([]);
  setReceiptPDFs(new Map());

  setIsProcessing(true);

  try {
    const { data, error } = await parseFile(file);

    if (error) {
      toast.error(error);

      setUploadedFile(null);
      setIsProcessing(false);

      return;
    }

    // ✅ FORM DATA
    const formData = new FormData();

    formData.append("file", file);

    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://service.pavki.in";

    const authToken =
      localStorage.getItem("auth_token") || "";

    // ✅ API CALL
    const response = await fetch(
      `${apiBaseUrl}/api/receipts/bulk-upload`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${authToken}`,
        },

        // ❌ NO JSON BODY
        // ✅ SEND FORM DATA
        body: formData,
      }
    );

    const apiData = await response.json();

    if (!response.ok) {
      const errors: ApiError[] = [];

      if (
        apiData.errors &&
        Array.isArray(apiData.errors)
      ) {
        apiData.errors.forEach((err: any) => {
          errors.push({
            rowIndex:
              err.rowIndex !== undefined
                ? err.rowIndex
                : err.row || 0,

            field:
              err.field ||
              err.fieldName ||
              "unknown",

            error:
              err.message ||
              err.error ||
              "Invalid data",
          });
        });
      } else if (apiData.error) {
        errors.push({
          rowIndex: 0,
          error: apiData.error,
        });
      }

      if (errors.length > 0) {
        setApiErrors(errors);

        setUploadedData(data);

        toast.error(
          `Server validation failed: ${errors.length} error(s)`
        );
      }

      return;
    }

    setUploadedData(data);

    setApiErrors([]);

    toast.success(
      `File validated successfully! ${data.length} records ready to generate.`
    );

  } catch (err) {

    toast.error(
      `Failed to process file: ${
        err instanceof Error
          ? err.message
          : "Unknown error"
      }`
    );

    setUploadedFile(null);

  } finally {

    setIsProcessing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

  const handleDownloadSample = (format: "xlsx" | "csv") => {
    const blob = generateSampleFile(format);
    const filename = `sample_receipts_template.${format}`;
    downloadFile(blob, filename);
    toast.success(`Sample ${format.toUpperCase()} file downloaded`);
  };

  const handleGenerateReceipts = async () => {
    if (uploadedData.length === 0) {
      toast.error("No data to process");
      return;
    }

    if (apiErrors.length > 0) {
      toast.error("Please fix all API validation errors before generating receipts");
      return;
    }

    setIsGenerating(true);

    try {
      const receiptsToGenerate: GeneratedReceipt[] = [];
      const pdfMap = new Map<string, Blob>();

      for (let i = 0; i < uploadedData.length; i++) {
        const row = uploadedData[i];
        const receiptNo = generateReceiptNo();

        const receipt: GeneratedReceipt = {
          receiptNo,
          txnId: String(row.txnId),
          agencyTxnId: String(row.agencyTransactionId),
          billNumber: "",
          customerName: String(row.customerName),
          accountNumber: String(row.accountNumber),
          totalPayable: Number(row.totalPayableAmount),
          mobileNumber: String(row.mobileNumber || ""),
          amountPaid: Number(row.amountPaid),
          amountInWords: String(row.amountPaidWords),
          connectionType: String(row.connectionType) as Receipt["connectionType"],
          discom: String(row.discom) as Receipt["discom"],
          area: String(row.area) as "RURAL" | "URBAN",
          division: String(row.division),
          agentName: String(row.agentName),
          agentMobile: String(row.agentMobile),
          agentId: String(row.agentId),
          transactionStatus: "SUCCESS" as const,
          paymentDate: String(row.paymentDate),
          paymentMode: String(row.paymentMode) as "PG" | "WALLET",
          agencyName: String(row.agencyName),
          paymentStatus: "SUCCESS" as const,
          createdAt: new Date().toISOString(),
          rowIndex: i,
        };

        receiptsToGenerate.push(receipt);

        // Generate PDF for each receipt
        try {
          const mod = await import("@/pdf/ReceiptPDF");
          const pdf = await mod.generateReceiptPDF(receipt);
          pdfMap.set(receipt.receiptNo, pdf);
        } catch (err) {
          console.error(`Failed to generate PDF for receipt ${receipt.receiptNo}:`, err);
        }

        addReceipt(receipt);
      }

      // Data was already validated by API during upload, so just show success
      setGeneratedReceipts(receiptsToGenerate);
      setReceiptPDFs(pdfMap);
      toast.success(`Successfully generated ${receiptsToGenerate.length} receipts. Ready to download.`);
    } catch (err) {
      toast.error(
        `Failed to generate receipts: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReceipt = (receipt: GeneratedReceipt) => {
    const pdfBlob = receiptPDFs.get(receipt.receiptNo);
    if (pdfBlob) {
      downloadFile(pdfBlob, `${receipt.receiptNo}.pdf`);
    } else {
      toast.error("PDF not available for this receipt");
    }
  };

  const handleDownloadAllAsZip = async () => {
    if (generatedReceipts.length === 0) {
      toast.error("No receipts to download");
      return;
    }

    try {
      const zipBlob = await createZipFile(generatedReceipts, receiptPDFs);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadFile(zipBlob, `receipts_${timestamp}.zip`);
      toast.success("All receipts downloaded as ZIP");
    } catch (err) {
      toast.error(
        `Failed to create ZIP file: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const sortedReceipts = [...generatedReceipts].sort(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Upload Receipts</h1>
        <p className="mt-2 text-muted-foreground">
          Upload multiple receipts at once using XLSX or CSV files
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed p-8">
        <div className="space-y-4">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Upload Receipt Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop your XLSX or CSV file here, or click to browse
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </>
              )}
            </Button>
          </div>

          {uploadedFile && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Sample File Download */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Download Sample Template</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Not sure about the required format? Download a sample file to see the expected column structure.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleDownloadSample("xlsx")}>
            <Download className="mr-2 h-4 w-4" />
            XLSX Template
          </Button>
          <Button variant="outline" onClick={() => handleDownloadSample("csv")}>
            <Download className="mr-2 h-4 w-4" />
            CSV Template
          </Button>
        </div>
      </Card>

      {/* API Errors */}
      {apiErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Server Validation Failed</p>
            <p className="mt-1 text-sm text-muted-foreground">The following fields are wrong or mismatched. Please correct them and upload again:</p>
            <div className="mt-3 space-y-2">
              {apiErrors.slice(0, 10).map((err, idx) => (
                <div key={idx} className="text-sm">
                  <p className="font-medium">Row {err.rowIndex + 2}{err.field && ` - Field: ${err.field}`}</p>
                  <p className="ml-4 text-xs">{err.error}</p>
                </div>
              ))}
              {apiErrors.length > 10 && (
                <p className="text-xs text-muted-foreground">
                  ... and {apiErrors.length - 10} more field errors
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Uploaded Data Summary */}
      {uploadedData.length > 0 && apiErrors.length === 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{uploadedData.length} Records Ready</p>
              <p className="text-sm text-muted-foreground">
                All records validated by API. Ready to generate receipts.
              </p>
            </div>
            <Button
              onClick={handleGenerateReceipts}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Generate Receipts
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Generated Receipts Section */}
      {generatedReceipts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Generated Receipts</h2>
              <p className="text-muted-foreground">
                {generatedReceipts.length} receipt{generatedReceipts.length !== 1 ? "s" : ""} created
              </p>
            </div>
            <Button onClick={handleDownloadAllAsZip} size="lg" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Download All as ZIP
            </Button>
          </div>

          <Card className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Account #</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReceipts.map((receipt) => (
                    <TableRow key={receipt.receiptNo}>
                      <TableCell className="font-mono text-sm">{receipt.receiptNo}</TableCell>
                      <TableCell>{receipt.customerName}</TableCell>
                      <TableCell>{receipt.accountNumber}</TableCell>
                      <TableCell className="text-right">{formatINR(receipt.amountPaid)}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(receipt.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {receipt.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReceipt(receipt)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
