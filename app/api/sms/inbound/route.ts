import { NextRequest } from "next/server";
import { listLeads, saveLead } from "@/lib/leads";

const STOP_KEYWORDS = new Set(["STOP", "UNSUBSCRIBE", "END", "QUIT"]);
const CONFIRM_KEYWORDS = new Set(["Y", "YES", "CONFIRM", "ACCEPT"]);
const CANCEL_KEYWORDS = new Set(["N", "NO", "CANCEL"]);
const START_KEYWORDS = new Set(["START", "SUBSCRIBE", "UNSTOP"]);

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

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.SMS_WEBHOOK_SECRET;
  const gatewayKey = process.env.SMS_GATEWAY_KEY;
  if (webhookSecret || gatewayKey) {
    const auth = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/, "");
    const valid = (webhookSecret && auth === webhookSecret) || (gatewayKey && auth === gatewayKey);
    if (!valid) return new Response("Unauthorized", { status: 401 });
  }

  let payload: { from?: string; body?: string; id?: string };
  try {
    payload = await request.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const from = String(payload.from || "").trim();
  const rawText = String(payload.body || "").trim();
  if (!from || !rawText) return new Response("ok", { status: 200 });

  const keyword = rawText.toUpperCase().split(/\s+/)[0];
  const phone = normalisePhone(from);

  try {
    if (CONFIRM_KEYWORDS.has(keyword)) {
      const leads = await listLeads();
      const lead = leads.find(
        (l) => normalisePhone(l.phone ?? "") === phone && l.finalQuote && !l.accepted,
      );
      if (lead) {
        await saveLead({ ...lead, accepted: true, acceptedAt: new Date().toISOString() });
        await sendSms(
          phone,
          `Great news! Your quote of $${lead.finalQuote} has been accepted. Our team will be in touch shortly to schedule your job. Thanks for choosing Hire a Pestie!`,
        );
      }
    } else if (CANCEL_KEYWORDS.has(keyword)) {
      const leads = await listLeads();
      const lead = leads.find(
        (l) => normalisePhone(l.phone ?? "") === phone && l.finalQuote && !l.accepted,
      );
      if (lead) {
        await saveLead({ ...lead, accepted: false });
        await sendSms(
          phone,
          `No problem! If you'd like a new quote in the future, visit hireapestie.com.au or call us anytime.`,
        );
      }
    } else if (STOP_KEYWORDS.has(keyword)) {
      await sendSms(phone, "You've been unsubscribed from Hire a Pestie SMS updates.");
    } else if (START_KEYWORDS.has(keyword)) {
      await sendSms(phone, "Welcome back! You're subscribed to Hire a Pestie SMS updates.");
    }
    // All other replies: silently acknowledge
  } catch (err) {
    console.error("[sms-inbound] Error handling reply:", err);
  }

  return new Response("ok", { status: 200 });
}
