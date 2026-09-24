import * as postmark from "postmark";
import { InvoiceData } from "./generateInvoicePdf";

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN!);
}

export async function sendInvoiceEmail(invoice: InvoiceData, pdfBuffer: Buffer): Promise<void> {
  if (!invoice.customerEmail) return;

  const client = getClient();
  const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL!;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
  const firstName = invoice.customerName?.split(" ")[0] ?? "there";

  const dueDateHtml = invoice.dueDate
    ? `<p style="color:#92400e;font-size:13px;margin:0 0 4px;"><strong>Payment due:</strong> ${new Date(invoice.dueDate).toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>`
    : "";

  const jobRows = [
    ["Service",  invoice.service],
    ["Levels",   invoice.levels],
    ["Roof Type",invoice.roofType],
    ["Bedrooms", invoice.bedrooms],
    ["Panels",   invoice.panels],
    ["Type",     invoice.type],
    ["Size",     invoice.size],
    ["Timeline", invoice.timeline],
  ].filter(([, v]) => v);

  const jobTableHtml = jobRows.length > 0 ? `
    <h2 style="font-size:13px;color:#1b2d6e;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Job Details</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${jobRows.map(([label, value], i) => `
        <tr style="background:${i % 2 === 0 ? "#eef1fb" : "#ffffff"};">
          <td style="padding:8px 12px;font-size:13px;color:#6b7280;width:40%;">${label}</td>
          <td style="padding:8px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
        </tr>
      `).join("")}
    </table>` : "";

  const customerHtml = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1b2d6e;padding:28px 32px;border-radius:10px 10px 0 0;">
      <img src="https://turfcleanpros.vercel.app/logo.png" alt="Turf Clean Pros" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />
      <p style="color:#a0b8d8;margin:0;font-size:13px;">Tax Invoice — ${invoice.invoiceNumber}</p>
    </div>
    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        Please find your invoice attached. Thank you for choosing Turf Clean Pros!
      </p>

      ${jobTableHtml}

      <div style="background:#1b2d6e;border-radius:10px;padding:24px;text-align:center;margin:20px 0;">
        <p style="color:#a0b8d8;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Amount Due</p>
        <p style="color:#ffffff;font-size:36px;font-weight:bold;margin:0 0 4px;">$${invoice.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</p>
        <p style="color:#a0b8d8;font-size:12px;margin:0;">Includes GST</p>
      </div>

      ${dueDateHtml ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:20px;">${dueDateHtml}</div>` : ""}

      ${invoice.notes ? `<p style="color:#6b7280;font-size:13px;margin:0 0 16px;">${invoice.notes}</p>` : ""}

      <p style="color:#374151;line-height:1.6;margin:0;">
        Questions? Call us on <strong>0433 240 617</strong> or reply to this email.
      </p>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Turf Clean Pros · ABN 44 686 088 264 · Tarneit VIC 3029</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">admin@turfcleanpros.com.au · 0433 240 617</p>
    </div>
  </div>`;

  const adminBannerHtml = `
    <div style="background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;padding:12px 16px;margin-bottom:24px;font-size:12px;color:#374151;">
      <strong>Admin copy</strong> — invoice sent to ${invoice.customerEmail}
    </div>`;

  const attachment = {
    Name: `TurfCleanPros-Invoice-${invoice.invoiceNumber}.pdf`,
    Content: pdfBuffer.toString("base64"),
    ContentType: "application/pdf",
    ContentID: "",
  };

  await client.sendEmailBatch([
    {
      From: FROM_EMAIL,
      To: invoice.customerEmail,
      Subject: `Tax Invoice ${invoice.invoiceNumber} — Turf Clean Pros`,
      HtmlBody: customerHtml,
      Attachments: [attachment],
      MessageStream: "outbound",
    },
    {
      From: FROM_EMAIL,
      To: BUSINESS_EMAIL,
      Subject: `[Copy] Invoice ${invoice.invoiceNumber} — ${invoice.customerName ?? "Customer"}`,
      HtmlBody: customerHtml.replace(
        '<div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">',
        `<div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">${adminBannerHtml}`
      ),
      Attachments: [attachment],
      MessageStream: "outbound",
    },
  ]);
}
