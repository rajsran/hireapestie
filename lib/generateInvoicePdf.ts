import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import path from "path";

const COMPANY_ABN = "44 686 088 264";
const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1b2d6e",
  },
  logo: { width: 160, height: 60, objectFit: "contain" },
  headerRight: { alignItems: "flex-end" },
  invoiceLabel: {
    fontSize: 9, color: "#6b7280", letterSpacing: 1,
    textTransform: "uppercase", marginBottom: 2,
  },
  invoiceNumber: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
  invoiceDate: { fontSize: 9, color: "#6b7280", marginTop: 2 },

  twoCol: { flexDirection: "row", gap: 24, marginBottom: 24 },
  col: { flex: 1 },
  sectionTitle: {
    fontSize: 8, fontFamily: "Helvetica-Bold", color: "#1b2d6e",
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8,
  },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  infoLabel: { fontSize: 9, color: "#6b7280", width: 60 },
  infoValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e", flex: 1 },

  table: { marginBottom: 24 },
  tableHeader: {
    flexDirection: "row", backgroundColor: "#1b2d6e",
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 4, marginBottom: 1,
  },
  tableHeaderText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#ffffff", flex: 1 },
  tableRow: {
    flexDirection: "row", paddingVertical: 7, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: { backgroundColor: "#eef1fb" },
  tableCell: { fontSize: 9, color: "#374151", flex: 1 },
  tableCellBold: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e", flex: 1 },

  amountBox: {
    backgroundColor: "#1b2d6e", borderRadius: 8, padding: 20,
    marginBottom: 20, alignItems: "center",
  },
  amountLabel: {
    fontSize: 8, color: "#a0b8d8", letterSpacing: 1.2,
    textTransform: "uppercase", marginBottom: 6,
  },
  amountValue: { fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 4 },
  amountSub: { fontSize: 9, color: "#a0b8d8" },

  notesBox: {
    backgroundColor: "#f9fafb", borderRadius: 6, borderWidth: 1,
    borderColor: "#e5e7eb", padding: 12, marginBottom: 20,
  },
  notesText: { fontSize: 9, color: "#374151", lineHeight: 1.6 },

  bankBox: {
    backgroundColor: "#f0f4ff", borderRadius: 6, borderWidth: 1,
    borderColor: "#c7d4f5", padding: 12, marginBottom: 20,
  },
  bankRow: { flexDirection: "row", marginBottom: 4 },
  bankLabel: { fontSize: 9, color: "#6b7280", width: 80 },
  bankValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1a1a2e", flex: 1 },

  footer: {
    position: "absolute", bottom: 32, left: 48, right: 48,
    borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 12,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  footerLeft: { fontSize: 8, color: "#9ca3af", lineHeight: 1.5 },
  footerRight: {
    fontSize: 8, color: "#1b2d6e", fontFamily: "Helvetica-Bold",
    textAlign: "right", lineHeight: 1.5,
  },
});

export interface InvoiceData {
  invoiceNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerSuburb?: string;
  customerPostcode?: string;
  service?: string;
  // Quote details
  levels?: string;
  roofType?: string;
  bedrooms?: string;
  panels?: string;
  type?: string;
  size?: string;
  timeline?: string;
  amount: number;
  dueDate?: string;
  notes?: string;
  createdAt?: string;
}

function InvoicePdfDocument({ invoice }: { invoice: InvoiceData }) {
  const now = new Date();
  const dateStr = (invoice.createdAt ? new Date(invoice.createdAt) : now)
    .toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });
  const dueDateStr = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  const lineItems = [
    { description: invoice.service ?? "Turf Cleaning Services", amount: invoice.amount },
  ];

  const jobDetails: { label: string; value: string }[] = [];
  if (invoice.levels)   jobDetails.push({ label: "Levels",    value: invoice.levels });
  if (invoice.roofType) jobDetails.push({ label: "Roof Type", value: invoice.roofType });
  if (invoice.bedrooms) jobDetails.push({ label: "Bedrooms",  value: invoice.bedrooms });
  if (invoice.panels)   jobDetails.push({ label: "Panels",    value: invoice.panels });
  if (invoice.type)     jobDetails.push({ label: "Type",      value: invoice.type });
  if (invoice.size)     jobDetails.push({ label: "Size",      value: invoice.size });
  if (invoice.timeline) jobDetails.push({ label: "Timeline",  value: invoice.timeline });

  return (
    React.createElement(Document, { title: `Invoice ${invoice.invoiceNumber} — ${invoice.customerName ?? "Customer"}` },
      React.createElement(Page, { size: "A4", style: styles.page },

        // Header
        React.createElement(View, { style: styles.header },
          React.createElement(Image, { style: styles.logo, src: LOGO_PATH }),
          React.createElement(View, { style: styles.headerRight },
            React.createElement(Text, { style: styles.invoiceLabel }, "Tax Invoice"),
            React.createElement(Text, { style: styles.invoiceNumber }, invoice.invoiceNumber),
            React.createElement(Text, { style: styles.invoiceDate }, `Date: ${dateStr}`),
            dueDateStr
              ? React.createElement(Text, { style: { ...styles.invoiceDate, color: "#dc2626" } }, `Due: ${dueDateStr}`)
              : null,
          ),
        ),

        // Bill To / From
        React.createElement(View, { style: styles.twoCol },
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "Bill To"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Name"),
              React.createElement(Text, { style: styles.infoValue }, invoice.customerName ?? "—"),
            ),
            invoice.customerEmail
              ? React.createElement(View, { style: styles.infoRow },
                  React.createElement(Text, { style: styles.infoLabel }, "Email"),
                  React.createElement(Text, { style: styles.infoValue }, invoice.customerEmail),
                )
              : null,
            invoice.customerPhone
              ? React.createElement(View, { style: styles.infoRow },
                  React.createElement(Text, { style: styles.infoLabel }, "Phone"),
                  React.createElement(Text, { style: styles.infoValue }, invoice.customerPhone),
                )
              : null,
            (invoice.customerSuburb || invoice.customerPostcode)
              ? React.createElement(View, { style: styles.infoRow },
                  React.createElement(Text, { style: styles.infoLabel }, "Suburb"),
                  React.createElement(Text, { style: styles.infoValue },
                    [invoice.customerSuburb, invoice.customerPostcode].filter(Boolean).join(", ")
                  ),
                )
              : null,
          ),
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "From"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Company"),
              React.createElement(Text, { style: styles.infoValue }, "Turf Clean Pros"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "ABN"),
              React.createElement(Text, { style: styles.infoValue }, COMPANY_ABN),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Phone"),
              React.createElement(Text, { style: styles.infoValue }, "0474 226 785"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Email"),
              React.createElement(Text, { style: styles.infoValue }, "admin@turfcleanpros.com.au"),
            ),
          ),
        ),

        // Line Items
        React.createElement(View, { style: styles.table },
          React.createElement(Text, { style: styles.sectionTitle }, "Services"),
          React.createElement(View, { style: styles.tableHeader },
            React.createElement(Text, { style: { ...styles.tableHeaderText, flex: 3 } }, "Description"),
            React.createElement(Text, { style: { ...styles.tableHeaderText, textAlign: "right" } }, "Amount"),
          ),
          ...lineItems.map(({ description, amount }, i) =>
            React.createElement(View, { key: i, style: [styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}] },
              React.createElement(Text, { style: { ...styles.tableCell, flex: 3 } }, description),
              React.createElement(Text, { style: { ...styles.tableCellBold, textAlign: "right" } },
                `$${amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`
              ),
            )
          ),
          // Total row
          React.createElement(View, { style: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#f3f4f6" } },
            React.createElement(Text, { style: { ...styles.tableCellBold, flex: 3 } }, "Total (inc. GST)"),
            React.createElement(Text, { style: { ...styles.tableCellBold, textAlign: "right", color: "#1b2d6e", fontSize: 11 } },
              `$${invoice.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`
            ),
          ),
        ),

        // Job Details (from linked quote)
        jobDetails.length > 0
          ? React.createElement(View, { style: { ...styles.table, marginBottom: 16 } },
              React.createElement(Text, { style: styles.sectionTitle }, "Job Details"),
              React.createElement(View, { style: styles.tableHeader },
                React.createElement(Text, { style: styles.tableHeaderText }, "Item"),
                React.createElement(Text, { style: styles.tableHeaderText }, "Details"),
              ),
              ...jobDetails.map(({ label, value }, i) =>
                React.createElement(View, { key: label, style: [styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}] },
                  React.createElement(Text, { style: styles.tableCell }, label),
                  React.createElement(Text, { style: styles.tableCellBold }, value),
                )
              ),
            )
          : null,

        // Amount Due box
        React.createElement(View, { style: styles.amountBox },
          React.createElement(Text, { style: styles.amountLabel }, "Amount Due"),
          React.createElement(Text, { style: styles.amountValue },
            `$${invoice.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`
          ),
          React.createElement(Text, { style: styles.amountSub }, "Includes GST"),
        ),

        // Payment Details
        React.createElement(View, { style: styles.bankBox },
          React.createElement(Text, { style: { ...styles.sectionTitle, marginBottom: 8 } }, "Payment Details"),
          React.createElement(View, { style: styles.bankRow },
            React.createElement(Text, { style: styles.bankLabel }, "Account Name"),
            React.createElement(Text, { style: styles.bankValue }, "Redrock Building and Construction Pty Ltd"),
          ),
          React.createElement(View, { style: styles.bankRow },
            React.createElement(Text, { style: styles.bankLabel }, "BSB"),
            React.createElement(Text, { style: styles.bankValue }, "803-439"),
          ),
          React.createElement(View, { style: { ...styles.bankRow, marginBottom: 0 } },
            React.createElement(Text, { style: styles.bankLabel }, "Account No."),
            React.createElement(Text, { style: styles.bankValue }, "294019307"),
          ),
        ),

        // Notes
        invoice.notes
          ? React.createElement(View, { style: styles.notesBox },
              React.createElement(Text, { style: { ...styles.sectionTitle, marginBottom: 4 } }, "Notes"),
              React.createElement(Text, { style: styles.notesText }, invoice.notes),
            )
          : null,

        // Footer
        React.createElement(View, { style: styles.footer },
          React.createElement(Text, { style: styles.footerLeft },
            `Turf Clean Pros · ABN ${COMPANY_ABN}\nTarneit VIC 3029 · All Melbourne Suburbs`
          ),
          React.createElement(Text, { style: styles.footerRight },
            "0474 226 785\nadmin@turfcleanpros.com.au"
          ),
        ),
      )
    )
  );
}

export async function generateInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
  const doc = InvoicePdfDocument({ invoice });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
