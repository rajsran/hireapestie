import * as postmark from "postmark";
import { QuoteLead, calcEstimate, isTurfService, calcTurfEstimate } from "./pricing";

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN!);
}

function buildCustomerHtml(lead: QuoteLead, estimate: { low: number; high: number; note?: string } | null, leadId?: string): string {
  const firstName = lead.name?.split(" ")[0] ?? "there";
  const isLandscaping = lead.service === "Landscaping";
  const isTurf = isTurfService(lead.service);

  const estimateHtml = isLandscaping
    ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
        <p style="font-weight:bold;color:#166534;margin:0 0 6px;">Free On-Site Consultation</p>
        <p style="color:#4b7c5a;font-size:12px;margin:0;">We'll visit, discuss your vision, and provide a fixed quote — no obligation.</p>
      </div>`
    : estimate
      ? `<div style="background:#1a1a2e;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
          <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Starting Price</p>
          <p style="color:#ffffff;font-size:28px;font-weight:bold;margin:0 0 6px;">$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}</p>
          ${estimate.note ? `<p style="color:#6b7280;font-size:12px;margin:0;">${estimate.note}</p>` : ""}
        </div>`
      : `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;text-align:center;margin:20px 0;">
          <p style="font-weight:bold;margin:0 0 6px;">Free On-Site Inspection Required</p>
          <p style="color:#6b7280;font-size:12px;margin:0;">We'll come to you and provide a fixed accurate quote — no obligation.</p>
        </div>`;

  const jobRows = isLandscaping
    ? [["Service", lead.service]]
    : isTurf
      ? lead.service === "Bird Proofing Mesh"
        ? [
            ["Service", lead.service],
            ["Panels",  lead.panels],
          ]
        : [
            ["Service",   lead.service],
            ["Levels",    lead.levels],
            ["Roof Type", lead.roofType],
            ["Bedrooms",  lead.bedrooms],
          ]
      : [["Service", lead.type || lead.service], ["Size", lead.size], ["Timeline", lead.timeline]];

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1b2d6e;padding:28px 32px;border-radius:10px 10px 0 0;">
      <img src="https://turfcleanpros.vercel.app/logo.png" alt="Turf Clean Pros" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />
      <p style="color:#a0b8d8;margin:0;font-size:13px;">Melbourne&apos;s Largest Turf Cleaning Service</p>
    </div>

    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        ${isLandscaping
          ? "Thanks for your landscaping enquiry! We've received your details and will be in touch shortly to arrange a free on-site consultation."
          : "Thanks for getting in touch with Turf Clean Pros! Here's your quote summary based on the details you provided. We've also attached a <strong>PDF copy</strong> to this email for your records."
        }
      </p>

      <h2 style="font-size:13px;color:#1b2d6e;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Job Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${jobRows.filter(([, v]) => v).map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#eef1fb" : "#ffffff"};">
            <td style="padding:9px 12px;font-size:13px;color:#6b7280;width:40%;">${label}</td>
            <td style="padding:9px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
          </tr>
        `).join("")}
      </table>

      ${leadId ? `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;">
        <tr>
          <td align="center" bgcolor="#1b5e20" style="border-radius:8px;padding:0;">
            <a href="${BASE_URL}/quote/accept?lead=${leadId}" style="display:block;padding:16px 24px;color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;font-family:Arial,sans-serif;text-align:center;">&#10003; Accept Quote</a>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
        <tr>
          <td align="center" bgcolor="#e5e7eb" style="border-radius:8px;padding:0;">
            <a href="${BASE_URL}/quote/help?lead=${leadId}" style="display:block;padding:16px 24px;color:#1b2d6e;font-weight:bold;font-size:16px;text-decoration:none;font-family:Arial,sans-serif;text-align:center;">? Need Help</a>
          </td>
        </tr>
      </table>` : ""}

      ${estimateHtml}

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:12px;line-height:1.6;margin:0;">
          <strong>Note:</strong> This is a rough estimate only. Final price depends on site conditions, access, soil type, and materials. A free on-site visit gives you a fixed, accurate quote.
        </p>
      </div>

      <p style="color:#374151;line-height:1.6;margin:0 0 16px;">
        Our team will be in touch within 30 minutes to confirm your booking.
        ${leadId ? "" : `Or feel free to call us directly:`}
      </p>

      ${leadId ? "" : `
      <div style="text-align:center;margin:24px 0;">
        <a href="tel:0420104774" style="display:inline-block;background:#1b2d6e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:14px;width:220px;">
          Call 0420 104 774
        </a>
      </div>`}
    </div>

    <div style="background:#f9fafb;padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Turf Clean Pros · Tarneit VIC 3029 · All Melbourne Suburbs</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">admin@turfcleanpros.com.au · 0420 104 774 · 03 9121 8020</p>
    </div>
  </div>`;
}

function buildBusinessHtml(lead: QuoteLead, estimate: { low: number; high: number; note?: string } | null): string {
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  const isLandscaping = lead.service === "Landscaping";
  const isTurf = isTurfService(lead.service);

  const estimateStr = estimate
    ? `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}${estimate.note ? ` (${estimate.note})` : ""}`
    : "Needs on-site";

  const rows = isLandscaping
    ? [
        ["Name",    lead.name],
        ["Email",   lead.email],
        ["Phone",   lead.phone],
        ["Service", lead.service],
      ]
    : isTurf
      ? lead.service === "Bird Proofing Mesh"
        ? [
            ["Name",     lead.name],
            ["Email",    lead.email],
            ["Phone",    lead.phone],
            ["Service",  lead.service],
            ["Panels",   lead.panels],
            ["Estimate", estimateStr],
          ]
        : [
            ["Name",      lead.name],
            ["Email",     lead.email],
            ["Phone",     lead.phone],
            ["Service",   lead.service],
            ["Levels",    lead.levels],
            ["Roof Type", lead.roofType],
            ["Bedrooms",  lead.bedrooms],
            ["Estimate",  estimateStr],
          ]
      : [
          ["Name",     lead.name],
          ["Email",    lead.email],
          ["Phone",    lead.phone],
          ["Service",  lead.type || lead.service],
          ["Size",     lead.size],
          ["Timeline", lead.timeline],
          ["Estimate", estimateStr],
        ];

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1a1a2e;padding:20px 28px;border-radius:10px 10px 0 0;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">New ${isLandscaping ? "Landscaping Enquiry" : "Quote Lead"}</h2>
      <p style="color:#6b7280;margin:4px 0 0;font-size:12px;">${timestamp}</p>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rows.filter(([, v]) => v && v !== "Not provided").map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">
            <td style="padding:9px 12px;font-size:13px;color:#6b7280;width:35%;">${label}</td>
            <td style="padding:9px 12px;font-size:13px;font-weight:bold;">${value}</td>
          </tr>
        `).join("")}
      </table>
      ${!isLandscaping ? `<p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">PDF quote attached — same one sent to the customer.</p>` : ""}
    </div>
  </div>`;
}

const BASE_URL = "https://turfcleanpros.vercel.app";

export async function sendFinalQuoteEmail(lead: QuoteLead, pdfBuffer: Buffer, finalAmount: number, leadId?: string): Promise<void> {
  const client = getClient();
  const FROM_EMAIL = process.env.POSTMARK_FROM_EMAIL!;
  const firstName = lead.name?.split(" ")[0] ?? "there";

  const acceptUrl = leadId ? `${BASE_URL}/quote/accept?lead=${leadId}` : null;
  const helpUrl   = leadId ? `${BASE_URL}/quote/help?lead=${leadId}`   : null;

  const actionButtons = acceptUrl ? `
    <p style="color:#374151;font-size:14px;margin:20px 0 14px;">Ready to go ahead? Use the buttons below:</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:10px;">
      <tr>
        <td align="center" bgcolor="#1b5e20" style="border-radius:8px;padding:0;">
          <a href="${acceptUrl}" style="display:block;padding:16px 24px;color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;font-family:Arial,sans-serif;text-align:center;">&#10003; Accept Quote</a>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#e5e7eb" style="border-radius:8px;padding:0;">
          <a href="${helpUrl}" style="display:block;padding:16px 24px;color:#1b2d6e;font-weight:bold;font-size:16px;text-decoration:none;font-family:Arial,sans-serif;text-align:center;">? Need Help</a>
        </td>
      </tr>
    </table>` : `
    <p style="color:#374151;font-size:14px;margin:20px 0 14px;">To confirm your booking, call us:</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#1b2d6e" style="border-radius:8px;padding:0;">
          <a href="tel:0420104774" style="display:block;padding:16px 24px;color:#ffffff;font-weight:bold;font-size:16px;text-decoration:none;font-family:Arial,sans-serif;text-align:center;">Call 0420 104 774</a>
        </td>
      </tr>
    </table>`;

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1b2d6e;padding:28px 32px;border-radius:10px 10px 0 0;">
      <img src="${BASE_URL}/logo.png" alt="Turf Clean Pros" style="height:48px;max-width:200px;object-fit:contain;display:block;margin-bottom:8px;" />
      <p style="color:#a0b8d8;margin:0;font-size:13px;">Melbourne's Largest Turf Cleaning Service</p>
    </div>
    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
      <p style="font-size:16px;margin:0 0 16px;">Hi ${firstName},</p>
      <p style="color:#374151;line-height:1.6;margin:0 0 20px;">
        Great news! We've reviewed your job details and prepared your <strong>final confirmed quote</strong>. Please find your PDF attached.
      </p>
      ${actionButtons}
      <div style="background:#1b5e20;border-radius:10px;padding:24px;text-align:center;margin:20px 0;">
        <p style="color:#a5d6a7;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Final Quote</p>
        <p style="color:#ffffff;font-size:36px;font-weight:bold;margin:0 0 6px;">$${finalAmount.toLocaleString()}</p>
        <p style="color:#a5d6a7;font-size:12px;margin:0;">Fixed price · No hidden costs</p>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Turf Clean Pros · Tarneit VIC 3029 · All Melbourne Suburbs</p>
      <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">admin@turfcleanpros.com.au · 0420 104 774 · 03 9121 8020</p>
    </div>
  </div>`;

  if (!lead.email) return;

  await client.sendEmail({
    From: FROM_EMAIL,
    To: lead.email,
    Subject: `Your Final Quote from Turf Clean Pros — $${finalAmount.toLocaleString()}`,
    HtmlBody: html,
    Attachments: [{
      Name: `TurfCleanPros-FinalQuote-${lead.name?.replace(/\s+/g, "-") ?? "Customer"}.pdf`,
      Content: pdfBuffer.toString("base64"),
      ContentType: "application/pdf",
      ContentID: "",
    }],
    MessageStream: "outbound",
  });
}

export async function sendAcceptedNotificationEmail(lead: QuoteLead & { finalQuote?: number }, address: string): Promise<void> {
  const client = getClient();
  const FROM_EMAIL    = process.env.POSTMARK_FROM_EMAIL!;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#1b5e20;padding:20px 28px;border-radius:10px 10px 0 0;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">✓ Quote Accepted!</h2>
      <p style="color:#a5d6a7;margin:4px 0 0;font-size:12px;">${timestamp}</p>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
      <p style="color:#374151;margin:0 0 20px;font-size:14px;">
        <strong>${lead.name ?? "A customer"}</strong> has accepted their quote. Here are their details:
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ["Name",     lead.name],
          ["Phone",    lead.phone],
          ["Email",    lead.email],
          ["Service",  lead.service],
          ["Quote",    lead.finalQuote ? `$${lead.finalQuote.toLocaleString()}` : "—"],
          ["Address",  address],
          ["Suburb",   lead.suburb ? `${lead.suburb}${lead.postcode ? " " + lead.postcode : ""}` : lead.postcode],
        ].filter(([, v]) => v && v !== "Not provided").map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f0fdf4" : "#ffffff"};">
            <td style="padding:10px 12px;font-size:13px;color:#6b7280;width:35%;">${label}</td>
            <td style="padding:10px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  </div>`;

  await client.sendEmail({
    From: FROM_EMAIL,
    To: BUSINESS_EMAIL,
    Subject: `✓ Quote Accepted — ${lead.name ?? "Customer"} · $${lead.finalQuote?.toLocaleString() ?? "?"}`,
    HtmlBody: html,
    MessageStream: "outbound",
  });
}

export async function sendHelpNotificationEmail(lead: QuoteLead & { finalQuote?: number }): Promise<void> {
  const client = getClient();
  const FROM_EMAIL     = process.env.POSTMARK_FROM_EMAIL!;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#b45309;padding:20px 28px;border-radius:10px 10px 0 0;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">? Customer Needs Help</h2>
      <p style="color:#fde68a;margin:4px 0 0;font-size:12px;">${timestamp}</p>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
      <p style="color:#374151;margin:0 0 20px;font-size:14px;">
        <strong>${lead.name ?? "A customer"}</strong> clicked "Need Help" on their final quote. Please follow up with them.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ["Name",    lead.name],
          ["Phone",   lead.phone],
          ["Email",   lead.email],
          ["Service", lead.service],
          ["Quote",   lead.finalQuote ? `$${lead.finalQuote.toLocaleString()}` : "—"],
        ].filter(([, v]) => v && v !== "Not provided").map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#fffbeb" : "#ffffff"};">
            <td style="padding:10px 12px;font-size:13px;color:#6b7280;width:35%;">${label}</td>
            <td style="padding:10px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  </div>`;

  await client.sendEmail({
    From: FROM_EMAIL,
    To: BUSINESS_EMAIL,
    Subject: `? Help Requested — ${lead.name ?? "Customer"} · ${lead.service ?? "Quote"}`,
    HtmlBody: html,
    MessageStream: "outbound",
  });
}

export async function sendEarlyLeadEmail(contact: {
  name: string;
  phone: string;
  email?: string;
  postcode?: string;
  suburb?: string;
}): Promise<void> {
  const client = getClient();
  const FROM_EMAIL     = process.env.POSTMARK_FROM_EMAIL!;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });

  const rows = [
    ["Name",     contact.name],
    ["Phone",    contact.phone],
    ["Email",    contact.email],
    ["Postcode", contact.postcode],
    ["Suburb",   contact.suburb],
  ].filter(([, v]) => v && v !== "Not provided");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#7c3aed;padding:20px 28px;border-radius:10px 10px 0 0;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">🔔 New Lead Started</h2>
      <p style="color:#ddd6fe;margin:4px 0 0;font-size:12px;">${timestamp}</p>
    </div>
    <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
      <p style="color:#374151;margin:0 0 16px;font-size:14px;">
        A customer just entered their contact details and is choosing a service. Follow up now if they don't complete the quote.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows.map(([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f5f3ff" : "#ffffff"};">
            <td style="padding:9px 12px;font-size:13px;color:#6b7280;width:35%;">${label}</td>
            <td style="padding:9px 12px;font-size:13px;font-weight:bold;color:#1a1a2e;">${value}</td>
          </tr>
        `).join("")}
      </table>
      <p style="color:#9ca3af;font-size:11px;margin:20px 0 0;">
        A full lead email will follow once they select a service and submit. This is an early notification only.
      </p>
    </div>
  </div>`;

  await client.sendEmail({
    From: FROM_EMAIL,
    To: BUSINESS_EMAIL,
    Subject: `🔔 Early Lead: ${contact.name} just started a quote`,
    HtmlBody: html,
    MessageStream: "outbound",
  });
}

export async function sendQuoteEmail(lead: QuoteLead, pdfBuffer: Buffer, leadId?: string): Promise<void> {
  const client       = getClient();
  const FROM_EMAIL   = process.env.POSTMARK_FROM_EMAIL!;
  const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL!;
  const estimate = isTurfService(lead.service) ? calcTurfEstimate(lead) : calcEstimate(lead);
  const pdfAttachment = {
    Name: `TurfCleanPros-Quote-${lead.name?.replace(/\s+/g, "-") ?? "Customer"}.pdf`,
    Content: pdfBuffer.toString("base64"),
    ContentType: "application/pdf",
    ContentID: "",
  };

  const emails: postmark.Models.Message[] = [];

  if (lead.email) {
    emails.push({
      From: FROM_EMAIL,
      To: lead.email,
      Subject: `Your Turf Clean Pros Quote — ${lead.service}`,
      HtmlBody: buildCustomerHtml(lead, estimate, leadId),
      Attachments: [pdfAttachment],
      MessageStream: "outbound",
    });
  }

  emails.push({
    From: FROM_EMAIL,
    To: BUSINESS_EMAIL,
    Subject: `New Lead: ${lead.name ?? "Unknown"} — ${lead.service}`,
    HtmlBody: buildBusinessHtml(lead, estimate),
    Attachments: [pdfAttachment],
    MessageStream: "outbound",
  });

  if (emails.length === 1) {
    await client.sendEmail(emails[0]);
  } else {
    await client.sendEmailBatch(emails);
  }
}
