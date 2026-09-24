import { NextRequest, NextResponse, after } from "next/server";
import { QuoteLead, isTurfService, calcTurfEstimate } from "@/lib/pricing";
import { generateQuotePdf } from "@/lib/generateQuotePdf";
import { sendQuoteEmail } from "@/lib/sendQuoteEmail";
import { saveLead, savePdf } from "@/lib/leads";
import { shortenUrl } from "@/lib/shortenUrl";
import { getDb, initDb } from "@/lib/db";

export const runtime = "nodejs";

const normalisePhone = (phone: string): string => {
  const digits = phone.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  if (digits.startsWith("0")) return "+61" + digits.slice(1);
  if (!digits.startsWith("+")) return "+" + digits;
  return digits;
};

const sendSms = async (to: string, body: string): Promise<void> => {
  const url = process.env.SMS_GATEWAY_URL;
  const key = process.env.SMS_GATEWAY_KEY;
  if (!url || !key) return;
  const res = await fetch(`${url}/api/sms/send`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ to, body }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS gateway error ${res.status}: ${text}`);
  }
};

async function upsertCustomerAndQuote(
  lead: QuoteLead,
  quoteId: string,
  shortId: string,
  estimate: { low: number; high: number } | null,
  pdfUrl?: string,
): Promise<void> {
  try {
    await initDb();
    const sql = getDb();

    let customerId: string;
    if (lead.email) {
      const existing = await sql`
        SELECT id FROM customers WHERE email = ${lead.email} LIMIT 1
      `;
      if (existing.length > 0) {
        customerId = existing[0].id as string;
        await sql`
          UPDATE customers SET
            name     = COALESCE(${lead.name ?? null}, name),
            phone    = COALESCE(${lead.phone ?? null}, phone),
            suburb   = COALESCE(${lead.suburb ?? null}, suburb),
            postcode = COALESCE(${lead.postcode ?? null}, postcode)
          WHERE id = ${customerId}
        `;
      } else {
        customerId = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        await sql`
          INSERT INTO customers (id, name, email, phone, suburb, postcode)
          VALUES (${customerId}, ${lead.name ?? null}, ${lead.email}, ${lead.phone ?? null}, ${lead.suburb ?? null}, ${lead.postcode ?? null})
        `;
      }
    } else {
      customerId = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      await sql`
        INSERT INTO customers (id, name, email, phone, suburb, postcode)
        VALUES (${customerId}, ${lead.name ?? null}, NULL, ${lead.phone ?? null}, ${lead.suburb ?? null}, ${lead.postcode ?? null})
      `;
    }

    await sql`
      INSERT INTO quotes (
        id, customer_id, service, levels, roof_type, bedrooms, panels,
        type, size, timeline, estimate_low, estimate_high, pdf_url, short_id, created_at
      ) VALUES (
        ${quoteId}, ${customerId}, ${lead.service ?? null},
        ${lead.levels ?? null}, ${lead.roofType ?? null}, ${lead.bedrooms ?? null},
        ${lead.panels ?? null}, ${lead.type ?? null}, ${lead.size ?? null},
        ${lead.timeline ?? null},
        ${estimate?.low ?? null}, ${estimate?.high ?? null},
        ${pdfUrl ?? null}, ${shortId}, NOW()
      )
    `;
  } catch (err) {
    console.error("⚠️  DB save failed (lead still captured in Blob):", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json() as QuoteLead;

    if (!lead.service) {
      return NextResponse.json({ error: "Missing service" }, { status: 400 });
    }

    // Calculate estimate synchronously — no async needed
    const estimate = isTurfService(lead.service) ? calcTurfEstimate(lead) : null;

    const leadId = `lead-${Date.now()}`;
    const shortId = Math.random().toString(36).slice(2, 8);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://turfcleanpros.com.au";

    const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📋 NEW QUOTE LEAD — ${timestamp}`);
    console.log(`   Name:    ${lead.name    ?? "Not provided"}`);
    console.log(`   Phone:   ${lead.phone   ?? "Not provided"}`);
    console.log(`   Service: ${lead.service}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Respond immediately — do all heavy work after the response is sent
    after(async () => {
      let pdfUrl: string | undefined;

      try {
        // Generate PDF once, then upload + email in parallel
        const pdfBuffer = await generateQuotePdf(lead);
        [pdfUrl] = await Promise.all([
          savePdf(shortId, pdfBuffer).catch(err => { console.error("⚠️  PDF upload failed:", err); return undefined; }),
          sendQuoteEmail(lead, pdfBuffer, leadId).then(() => console.log("✅ Quote email sent")).catch(err => console.error("⚠️  Email failed:", err)),
        ]);
      } catch (err) {
        console.error("⚠️  PDF generation failed:", err);
      }

      // Persist lead to Blob + DB in parallel
      await Promise.all([
        saveLead({ id: leadId, createdAt: new Date().toISOString(), shortId, pdfUrl, ...lead, estimate })
          .catch(err => console.error("⚠️  Blob lead save failed:", err)),
        upsertCustomerAndQuote(lead, leadId, shortId, estimate, pdfUrl),
      ]);

      // Send SMS last (needs pdfUrl)
      if (lead.phone) {
        try {
          const firstName = (lead.name ?? "").split(" ")[0] || "there";
          const estimateText = estimate
            ? ` Your estimate is ${estimate.low === estimate.high ? `$${estimate.low}` : `$${estimate.low}–$${estimate.high}`}.`
            : "";
          const quoteLink = pdfUrl ? await shortenUrl(`${siteUrl}/q/${shortId}`) : "";
          const linkText = quoteLink ? ` View your quote: ${quoteLink}` : "";
          await sendSms(
            normalisePhone(lead.phone),
            `Hi ${firstName}, thanks for requesting a quote with Turf Clean Pros!${estimateText}${linkText} We'll confirm your final quote shortly. Questions? Call us anytime!`,
          );
          console.log("✅ Quote SMS sent");
        } catch (err) {
          console.error("⚠️  SMS failed:", err);
        }
      }
    });

    return NextResponse.json({ ok: true, estimate });
  } catch (err) {
    console.error("Quote submit error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
