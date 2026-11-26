import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import path from "path";
import { QuoteLead, calcEstimate, isTurfService, calcTurfEstimate } from "./pricing";

// ── Update this with the real ABN ──────────────────────────────────────────────
const COMPANY_ABN = "27 700 387 079";
const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0F172A",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#5A8F1C",
  },
  logo: {
    width: 160,
    height: 60,
    objectFit: "contain",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteLabel: {
    fontSize: 9,
    color: "#6b7280",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  quoteNumber: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
  },
  quoteDate: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },

  // Two-column section
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#5A8F1C",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 60,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    flex: 1,
  },

  // Job details table
  table: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#5A8F1C",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 1,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: {
    backgroundColor: "#EDF8F2",
  },
  tableCell: {
    fontSize: 9,
    color: "#374151",
    flex: 1,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    flex: 1,
  },
  tableCellRight: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#5A8F1C",
    textAlign: "right",
    width: 80,
  },
  tableTotal: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#5A8F1C",
    borderRadius: 4,
    marginTop: 2,
  },
  tableTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    flex: 1,
  },
  tableTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "right",
    width: 80,
  },

  // Estimate box
  estimateBox: {
    backgroundColor: "#152B57",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  estimateLabel: {
    fontSize: 8,
    color: "#9ca3af",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  estimateAmount: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  estimateNote: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 1.5,
  },

  // No estimate box
  noEstimateBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  noEstimateTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  noEstimateNote: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },

  // Booking box
  bookingBox: {
    backgroundColor: "#5A8F1C",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  bookingLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 4,
  },
  bookingValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  bookingBadge: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#5A8F1C",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 6,
    padding: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#92400e",
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 8,
    color: "#9ca3af",
    lineHeight: 1.5,
  },
  footerRight: {
    fontSize: 8,
    color: "#5A8F1C",
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    lineHeight: 1.5,
  },
});

function QuotePdfDocument({ lead, estimate, finalAmount, booking }: {
  lead: QuoteLead;
  estimate: { low: number; high: number } | null;
  finalAmount?: number;
  booking?: { bookingDate?: string; bookingTime?: string };
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });

  const bookingDateStr = booking?.bookingDate
    ? new Date(booking.bookingDate + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;
  const bookingTimeStr = booking?.bookingTime || null;
  const quoteNum = `GCF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

  const hasLineItems = lead.quoteLineItems && lead.quoteLineItems.length > 0;
  const jobDetails = [
    { label: "Service",      value: lead.service  ?? "—" },
    ...(lead.areaM2        ? [{ label: "Area",        value: `${lead.areaM2} m²` }] : lead.turfSize ? [{ label: "Area", value: lead.turfSize }] : []),
    ...(lead.billingPeriod ? [{ label: "Billing",     value: lead.billingPeriod }]   : []),
    ...(lead.serviceDetail ? [{ label: "Treatment",   value: lead.serviceDetail }]   : []),
    { label: "Suburb",       value: lead.suburb   ?? "—" },
  ];

  return (
    React.createElement(Document, { title: `Hire a Pestie Quote — ${lead.name ?? "Customer"}` },
      React.createElement(Page, { size: "A4", style: styles.page },

        // ── Header ──
        React.createElement(View, { style: styles.header },
          React.createElement(Image, { style: styles.logo, src: LOGO_PATH }),
          React.createElement(View, { style: styles.headerRight },
            React.createElement(Text, { style: styles.quoteLabel }, "Quote Reference"),
            React.createElement(Text, { style: styles.quoteNumber }, quoteNum),
            React.createElement(Text, { style: styles.quoteDate }, dateStr),
          ),
        ),

        // ── Prepared for / Contact ──
        React.createElement(View, { style: styles.twoCol },
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "Prepared For"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Name"),
              React.createElement(Text, { style: styles.infoValue }, lead.name ?? "—"),
            ),
            lead.email ? React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Email"),
              React.createElement(Text, { style: styles.infoValue }, lead.email),
            ) : null,
            lead.phone && lead.phone !== "Not provided" ? React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Phone"),
              React.createElement(Text, { style: styles.infoValue }, lead.phone),
            ) : null,
            (lead.suburb || lead.postcode) ? React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Suburb"),
              React.createElement(Text, { style: styles.infoValue },
                [lead.suburb, lead.postcode].filter(Boolean).join(", ")
              ),
            ) : null,
          ),
          React.createElement(View, { style: styles.col },
            React.createElement(Text, { style: styles.sectionTitle }, "From"),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Company"),
              React.createElement(Text, { style: styles.infoValue }, "Hire a Pestie"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "ABN"),
              React.createElement(Text, { style: styles.infoValue }, COMPANY_ABN),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Contact"),
              React.createElement(Text, { style: styles.infoValue }, "Hire a Pestie Team"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Phone"),
              React.createElement(Text, { style: styles.infoValue }, "0448 163 783"),
            ),
            React.createElement(View, { style: styles.infoRow },
              React.createElement(Text, { style: styles.infoLabel }, "Area"),
              React.createElement(Text, { style: styles.infoValue }, "All Melbourne Suburbs"),
            ),
          ),
        ),

        // ── Job Details Table ──
        React.createElement(View, { style: styles.table },
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
        ),

        // ── Line-item Pricing Table (wizard flow) ──
        hasLineItems
          ? React.createElement(View, { style: { ...styles.table, marginBottom: 20 } },
              React.createElement(Text, { style: styles.sectionTitle }, "Pricing Breakdown"),
              React.createElement(View, { style: styles.tableHeader },
                React.createElement(Text, { style: { ...styles.tableHeaderText, flex: 1 } }, "Description"),
                React.createElement(Text, { style: { ...styles.tableHeaderText, width: 80, textAlign: "right" } }, "Price"),
              ),
              ...(lead.quoteLineItems ?? []).map(({ description, price }, i) =>
                React.createElement(View, { key: i, style: [styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}] },
                  React.createElement(Text, { style: { ...styles.tableCell, flex: 1 } }, description),
                  React.createElement(Text, { style: styles.tableCellRight }, price),
                )
              ),
              lead.estimatedTotal != null
                ? React.createElement(View, { style: styles.tableTotal },
                    React.createElement(Text, { style: styles.tableTotalLabel }, "Total"),
                    React.createElement(Text, { style: styles.tableTotalValue },
                      `$${lead.estimatedTotal.toLocaleString()}`
                    ),
                  )
                : null,
            )
          : null,

        // ── Estimate / Final Quote ──
        finalAmount != null
          ? React.createElement(View, { style: { ...styles.estimateBox, backgroundColor: "#5A8F1C" } },
              React.createElement(Text, { style: styles.estimateLabel }, "Final Quote"),
              React.createElement(Text, { style: styles.estimateAmount },
                `$${finalAmount.toLocaleString()}`
              ),
              React.createElement(Text, { style: { ...styles.estimateNote, color: "#a5d6a7" } },
                "This is your confirmed fixed price · No hidden costs"
              ),
            )
          : lead.estimatedTotal != null
            ? React.createElement(View, { style: styles.estimateBox },
                React.createElement(Text, { style: styles.estimateLabel }, "Estimated Total"),
                React.createElement(Text, { style: styles.estimateAmount },
                  `$${lead.estimatedTotal.toLocaleString()}`
                ),
                React.createElement(Text, { style: styles.estimateNote },
                  "Price based on details provided · Final confirmed on-site"
                ),
              )
            : estimate
              ? React.createElement(View, { style: styles.estimateBox },
                  React.createElement(Text, { style: styles.estimateLabel }, "Price Estimate"),
                  React.createElement(Text, { style: styles.estimateAmount },
                    estimate.low === estimate.high
                      ? `$${estimate.low.toLocaleString()}`
                      : `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}`
                  ),
                  React.createElement(Text, { style: styles.estimateNote },
                    "Starting price · Final quote confirmed on-site"
                  ),
                )
              : React.createElement(View, { style: styles.noEstimateBox },
                  React.createElement(Text, { style: styles.noEstimateTitle }, "Free On-Site Inspection Required"),
                  React.createElement(Text, { style: styles.noEstimateNote },
                    "We'll visit your property, measure up, and provide a fixed accurate quote — no obligation."
                  ),
                ),

        // ── Booking Date ──
        bookingDateStr
          ? React.createElement(View, { style: styles.bookingBox },
              React.createElement(View, null,
                React.createElement(Text, { style: styles.bookingLabel }, "Scheduled Booking"),
                React.createElement(Text, { style: styles.bookingValue }, bookingDateStr),
                bookingTimeStr
                  ? React.createElement(Text, { style: { ...styles.bookingValue, fontSize: 10, marginTop: 2 } }, bookingTimeStr)
                  : null,
              ),
              React.createElement(Text, { style: styles.bookingBadge }, "CONFIRMED"),
            )
          : null,

        // ── Disclaimer ──
        finalAmount == null
          ? React.createElement(View, { style: styles.disclaimer },
              React.createElement(Text, { style: styles.disclaimerText },
                "IMPORTANT: This is a rough estimate only, based on the information provided. Final pricing depends on site conditions, access, soil type, excavation requirements, and materials selected. All prices are subject to change. This estimate is valid for 30 days from the date above. A free on-site inspection is required before any formal quote or contract is issued."
              ),
            )
          : React.createElement(View, { style: { ...styles.disclaimer, backgroundColor: "#f0fdf4", borderColor: "#86efac" } },
              React.createElement(Text, { style: { ...styles.disclaimerText, color: "#166534" } },
                "This is your confirmed final quote. Price is fixed and includes all labour and materials as discussed. Quote valid for 30 days from the date above. Payment is due upon completion of works."
              ),
            ),

        // ── Footer ──
        React.createElement(View, { style: styles.footer },
          React.createElement(Text, { style: styles.footerLeft },
            `Hire a Pestie · ABN ${COMPANY_ABN}\nMelbourne · Geelong · Bendigo · Ballarat`
          ),
          React.createElement(Text, { style: styles.footerRight },
            "0448 163 783\ninfo@hireapestie.com.au"
          ),
        ),
      )
    )
  );
}

export async function generateQuotePdf(
  lead: QuoteLead,
  finalAmount?: number,
  booking?: { bookingDate?: string; bookingTime?: string },
): Promise<Buffer> {
  const estimate = isTurfService(lead.service) ? calcTurfEstimate(lead) : calcEstimate(lead);
  const doc = QuotePdfDocument({ lead, estimate, finalAmount, booking });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
