import { NextRequest, NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/adminAuth";
import { getLead, saveLead, savePdf } from "@/lib/leads";
import { generateQuotePdf } from "@/lib/generateQuotePdf";
import { sendFinalQuoteEmail } from "@/lib/sendQuoteEmail";
import { shortenUrl } from "@/lib/shortenUrl";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  await fetch(`${url}/api/sms/send`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ to, body }),
  });
};

export async function POST(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { leadId: string; finalAmount: number; updates?: Partial<{ turfSize: string; serviceDetail: string; type: string; size: string; timeline: string }>; bookingDate?: string; bookingTime?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { leadId, finalAmount, updates, bookingDate, bookingTime } = body;

  if (!leadId || !finalAmount || finalAmount <= 0) {
    return NextResponse.json({ error: "Missing leadId or valid finalAmount" }, { status: 400 });
  }

  try {
    const lead = await getLead(leadId);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    const updatedLead = { ...lead, ...updates };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hireapestie.com.au";
    const shortId = lead.shortId || Math.random().toString(36).slice(2, 8);

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateQuotePdf(updatedLead, finalAmount, { bookingDate, bookingTime });
    } catch (err) {
      console.error("[send-quote] PDF generation failed:", err);
      return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }

    let pdfUrl: string | undefined;
    try {
      pdfUrl = await savePdf(shortId, pdfBuffer);
    } catch (err) {
      console.error("[send-quote] PDF upload failed:", err);
    }

    // Email, DB save, and SMS all run in parallel — none depend on each other
    let emailFailed = false;
    const firstName = (lead.name ?? "").split(" ")[0] || "there";

    await Promise.all([
      lead.email
        ? sendFinalQuoteEmail(updatedLead, pdfBuffer, finalAmount, leadId)
            .catch(err => { console.error("[send-quote] Email failed (non-fatal):", err); emailFailed = true; })
        : null,

      saveLead({ ...updatedLead, shortId, pdfUrl, finalQuote: finalAmount, quoteSentAt: new Date().toISOString() }),

      lead.phone
        ? (async () => {
            const quoteLink = pdfUrl ? await shortenUrl(`${siteUrl}/q/${shortId}`) : "";
            const linkText = quoteLink ? ` View your quote: ${quoteLink}` : "";
            let bookingText = "";
            if (bookingDate) {
              const d = new Date(bookingDate + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
              const t = bookingTime ? ` at ${bookingTime}` : "";
              bookingText = ` Your booking is confirmed for ${d}${t}.`;
            }
            const smsBody = `Hi ${firstName}, your Hire a Pestie quote is $${finalAmount}.${bookingText}${linkText} Reply Y to accept or N to decline. Questions? Call us anytime!`;
            await sendSms(normalisePhone(lead.phone!), smsBody);
          })().catch(err => console.error("[send-quote] SMS failed:", err))
        : null,
    ]);

    return NextResponse.json({ ok: true, emailFailed });
  } catch (err) {
    console.error("[send-quote] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
