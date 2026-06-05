import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Receipt } from "@/types/receipt";
import { DISCOMS, RANAPAY_LOGO } from "@/constants/discoms";
import { safeFormatDate } from "@/lib/utils";


const FONT = {
  regular: "Times-Roman",
  bold: "Times-Bold",
  helv: "Helvetica",
  helvBold: "Helvetica-Bold",
};

const styles = StyleSheet.create({
  /* ── PAGE ── */
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 32,
    paddingHorizontal: 38,
    paddingBottom: 28,
    fontFamily: FONT.regular,
    color: "#000000",
    fontSize: 10,
  },

  /* ── HEADER ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  /* DISCOM logo — left */
  discomLogo: {
    width: 75,
    height: 75,
    objectFit: "contain",
  },

  /* Center block */
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  companyName: {
    fontFamily: FONT.helvBold,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 1.25,
    letterSpacing: 0.3,
  },
  companyAddress: {
    fontFamily: FONT.helvBold,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 1.3,
    letterSpacing: 0.2,
    marginTop: 3,
  },

  /* RanaPay logo — right */
  ranaPayLogo: {
    width: 78,
    height: 46,
    objectFit: "contain",
  },

  /* ── TITLE ── */
  titleWrap: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 18,
    letterSpacing: 1.2,
  },

  /* ── RECEIPT BOX ── */
  receiptBox: {
    position: "relative",
    border: "1px solid #000000",
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },

  /* Watermark — absolute center behind content */
  watermarkWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkImg: {
    width: 420,
    height: 620,
    opacity: 0.09,
    objectFit: "contain",
  },

  /* Content sits above watermark */
  contentWrap: {
    position: "relative",
    zIndex: 1,
  },

  /* ── TWO-COLUMN ROW ── */
  rowWrap: {
    flexDirection: "row",
    marginBottom: 0, // spacing handled by labelValueWrap marginBottom
    width: "100%",
  },
  col: {
    width: "50%",
    paddingRight: 10,
  },
  colRight: {
    paddingRight: 0,
    paddingLeft: 10,
  },

  /* ── LABEL + VALUE (inline) ── */
  labelValueWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 9,
    flexWrap: "wrap",
  },
  label: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: "#111111",
    minWidth: 100,
    marginRight: 5,
    lineHeight: 1.4,
  },
  value: {
    fontFamily: FONT.helvBold,
    fontSize: 8.2,
    color: "#000000",
    flex: 1,
    lineHeight: 1.4,
  },

  /* ── HORIZONTAL DIVIDER (optional, matches screenshot subtle spacing) ── */
  divider: {
    borderBottom: "0.5px solid #cccccc",
    marginBottom: 8,
    marginTop: -1,
  },

  /* ── FOOTER / NOTES ── */
  footer: {
    marginTop: 14,
  },
  noteTitle: {
    fontFamily: FONT.bold,
    fontSize: 12,
    marginBottom: 5,
  },
  noteItem: {
    fontFamily: FONT.bold,
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 3,
    color: "#000000",
  },
  noteItemBold: {
    fontFamily: FONT.helvBold,
  },
});

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function LabelValue({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.labelValueWrap}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value?.trim() ?? ""}</Text>
    </View>
  );
}

function Row({
  ll,
  lv,
  rl,
  rv,
}: {
  ll: string;
  lv?: string;
  rl: string;
  rv?: string;
}) {
  return (
    <View style={styles.rowWrap}>
      <View style={styles.col}>
        <LabelValue label={ll} value={lv} />
      </View>
      <View style={[styles.col, styles.colRight]}>
        <LabelValue label={rl} value={rv} />
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export function ReceiptPDF({ receipt }: { receipt: Receipt }) {
  const discom = DISCOMS[receipt.discom];
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const paymentDate = safeFormatDate(receipt.paymentDate, "yyyy-MM-dd");

  return (
  <Document
  title={`${receipt.paymentDate}_${receipt.accountNumber}`}
  author="RanaPay India Private Limited"
>
      <Page size="A4" style={styles.page}>

        {/* ═══════════ HEADER ═══════════ */}
        <View style={styles.header}>
          {/* Left — DISCOM Logo */}
          <Image
            src={`${origin}${discom.logo}`}
            style={styles.discomLogo}
          />

          {/* Center — Company Name + Address */}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>
              {discom.name?.toUpperCase()}
            </Text>
            <Text style={styles.companyAddress}>
              {discom.address?.toUpperCase()}
            </Text>
          </View>

          {/* Right — RanaPay Logo */}
          <Image
            src={`${origin}${RANAPAY_LOGO}`}
            style={styles.ranaPayLogo}
          />
        </View>

        {/* ═══════════ TITLE ═══════════ */}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>PAYMENT RECEIPT</Text>
        </View>

        {/* ═══════════ RECEIPT BOX ═══════════ */}
        <View style={styles.receiptBox}>

          {/* Watermark */}
          <View style={styles.watermarkWrap}>
            <Image
              src={`${origin}${RANAPAY_LOGO}`}
              style={styles.watermarkImg}
            />
          </View>

          {/* Data Rows */}
          <View style={styles.contentWrap}>

            {/* Row 1 */}
            <Row
              ll="Receipt No"
              lv={receipt.receiptNo}
              rl="Txn Id"
              rv={receipt.txnId}
            />

            {/* Row 2 */}
            <Row
              ll="Agency Transaction ID"
              lv={receipt.agencyTxnId}
              rl="Bill Number:"
              rv={receipt.billNumber}
            />

            {/* Row 3 */}
            <Row
              ll="Customer Name"
              lv={receipt.customerName}
              rl="Account Number"
              rv={receipt.accountNumber}
            />

            {/* Row 4 */}
            <Row
              ll="Total Payable Amount"
              lv={String(receipt.totalPayable)}
              rl="Mobile Number"
              rv={receipt.mobileNumber}
            />

            {/* Row 5 */}
            <Row
              ll="Amount Paid"
              lv={String(receipt.amountPaid)}
              rl="Amount Paid (in Words)"
              rv={receipt.amountInWords}
            />

            {/* Row 6 */}
            <Row
              ll="Connection Type"
              lv={receipt.connectionType}
              rl="Discom"
              rv={receipt.discom}
            />

            {/* Row 7 */}
            <Row
              ll="Area"
              lv={receipt.area}
              rl="Division"
              rv={receipt.division}
            />

            {/* Row 8 */}
            <Row
              ll="Agent Name"
              lv={receipt.agentName}
              rl="Agent Mobile"
              rv={receipt.agentMobile}
            />

            {/* Row 9 */}
            <Row
              ll="Agent Id"
              lv={receipt.agentId}
              rl="Transaction Status"
              rv={receipt.transactionStatus}
            />

            {/* Row 10 */}
            <Row
              ll="Payment Date"
              lv={paymentDate}
              rl="Payment Mode"
              rv={receipt.paymentMode}
            />

            {/* Row 11 */}
            <Row
              ll="Agency Name"
              lv={receipt.agencyName}
              rl="Payment Status"
              rv={receipt.paymentStatus}
            />

          </View>
        </View>

        {/* ═══════════ FOOTER NOTES ═══════════ */}
        <View style={styles.footer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteItem}>
            1. This is computer generated receipt, no signature required.
          </Text>
          <Text style={styles.noteItem}>
            2. Payment will get update in account in next 48 hours in case of Pending Status.
          </Text>
          <Text style={styles.noteItem}>
            {"3. In case of any complaints please call Toll Free Number "}
            <Text style={styles.noteItemBold}>
              {discom.tollFree ?? "1800-270-0900"}
            </Text>
          </Text>
        </View>

      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────
   DOWNLOAD HELPER
───────────────────────────────────────────── */

export async function downloadReceiptPDF(receipt: Receipt) {
  const blob = await pdf(<ReceiptPDF receipt={receipt} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
a.download = `${receipt.paymentDate}_${receipt.accountNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function generateReceiptPDF(receipt: Receipt): Promise<Blob> {
  return pdf(<ReceiptPDF receipt={receipt} />).toBlob();
}