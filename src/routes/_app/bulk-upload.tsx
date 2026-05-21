import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";
import {
  Upload,
  Download,
  AlertCircle,
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
  type BulkUploadRow,
} from "@/lib/bulk-upload-utils";
import { fromAPIFormat } from "@/lib/api";
import { useReceiptStore } from "@/store/receipts";
import { formatINR } from "@/lib/receipt-utils";
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

interface ApiError {
  rowIndex: number;
  error: string;
  field?: string;
}

interface FailedUploadRow {
  rowIndex: number;
  customerName: string;
  error: string;
  data?: Record<string, unknown>;
}

function BulkUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addReceipt = useReceiptStore((s) => s.addReceipt);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<BulkUploadRow[]>([]);
  const [insertedReceipts, setInsertedReceipts] = useState<Receipt[]>([]);
  const [failedRows, setFailedRows] = useState<FailedUploadRow[]>([]);
  const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const processFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadedData([]);
    setInsertedReceipts([]);
    setFailedRows([]);
    setApiErrors([]);

    setIsProcessing(true);

    try {
      const { data, error } = await parseFile(file);

      if (error) {
        toast.error(error);
        setUploadedFile(null);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://service.pavki.in";
      const authToken = localStorage.getItem("auth_token") || "";

      const response = await fetch(`${apiBaseUrl}/api/receipts/bulk-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const apiData = await response.json();

      const parsedFailedRows: FailedUploadRow[] = Array.isArray(apiData.failedRows)
        ? apiData.failedRows.map((row: any) => ({
            rowIndex: Number(row.row ?? row.rowIndex ?? 0) - 1,
            customerName: String(row.data?.customerName ?? row.data?.customerName ?? "-"),
            error: String(row.error || row.message || "Unknown error"),
            data: row.data,
          }))
        : [];

      const inserted: Receipt[] = Array.isArray(apiData.inserted)
        ? apiData.inserted.map((item: Record<string, unknown>) => fromAPIFormat(item))
        : [];

      setUploadedData(data);
      setInsertedReceipts(inserted);
      setFailedRows(parsedFailedRows);
      setApiErrors([]);

      inserted.forEach(addReceipt);

      if (!response.ok) {
        if (parsedFailedRows.length > 0) {
          toast.error(`Upload completed with ${parsedFailedRows.length} failed rows.`);
        } else if (apiData.error) {
          toast.error(String(apiData.error));
        } else {
          toast.error("Bulk upload failed. Please check the file and try again.");
        }
        return;
      }

      toast.success(
        `Upload complete: ${inserted.length} inserted, ${parsedFailedRows.length} failed.`
      );
    } catch (err) {
      toast.error(
        `Failed to process file: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const isActive = event.type === "dragenter" || event.type === "dragover";
    setIsDragActive(isActive);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const handleDownloadSample = (format: "xlsx" | "csv") => {
    const blob = generateSampleFile(format);
    const filename = `sample_receipts_template.${format}`;
    downloadFile(blob, filename);
    toast.success(`Sample ${format.toUpperCase()} file downloaded`);
  };


const handleDownloadReceipt = async (receipt: Receipt) => {
    const mod = await import("@/pdf/ReceiptPDF");
    await mod.downloadReceiptPDF(receipt);
  };

  const handleDownloadAllAsZip = async () => {
    if (insertedReceipts.length === 0) {
      toast.error("No receipts to download");
      return;
    }

    try {
      const mod = await import("@/pdf/ReceiptPDF");
      const JSZipModule = await import("jszip");
      const zip = new JSZipModule.default();
      const receiptsFolder = zip.folder("receipts");
      if (!receiptsFolder) throw new Error("Failed to create zip folder");

      for (const receipt of insertedReceipts) {
        const pdfBlob = await mod.generateReceiptPDF(receipt);
        receiptsFolder.file(`${receipt.receiptNo}.pdf`, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const timestamp = new Date().toISOString().split("T")[0];
      downloadFile(zipBlob, `receipts_${timestamp}.zip`);
      toast.success("All receipts downloaded as ZIP");
    } catch (err) {
      toast.error(
        `Failed to create ZIP file: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const sortedReceipts = [...insertedReceipts].sort(
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
      <Card
        className={`border-2 border-dashed p-8 transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-border/60 bg-card"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Upload Receipt Data</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag and drop your XLSX or CSV file here, or click to browse.
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
      {uploadedData.length > 0 && (
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{uploadedData.length} Records Processed</p>
              <p className="text-sm text-muted-foreground">
                {insertedReceipts.length} inserted, {failedRows.length} failed.
              </p>
            </div>
            {insertedReceipts.length > 0 && (
              <Button onClick={handleDownloadAllAsZip} size="lg" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Download All Inserted PDFs
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Inserted Receipts */}
      {insertedReceipts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Inserted Receipts</h2>
              <p className="text-muted-foreground">
                {insertedReceipts.length} receipt{insertedReceipts.length !== 1 ? "s" : ""} inserted successfully.
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

      {/* Failed Rows */}
      {failedRows.length > 0 && (
        <Card className="p-6 border-red-200">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-red-600">Failed Rows</h2>
            <p className="text-sm text-muted-foreground">
              These rows failed server validation and cannot be downloaded.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedRows.map((item) => (
                  <TableRow key={item.rowIndex}>
                    <TableCell>{item.rowIndex + 2}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell className="text-red-600 max-w-[300px] break-words">
                      {item.error}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Failed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button disabled variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
