import { NextRequest, NextResponse } from "next/server";
import { getLead, saveLead } from "@/lib/leads";
import { sendAcceptedNotificationEmail } from "@/lib/sendQuoteEmail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { leadId, address } = await req.json() as { leadId: string; address: string };

  if (!leadId || !address?.trim()) {
    return NextResponse.json({ error: "Missing leadId or address" }, { status: 400 });
  }

  const lead = await getLead(leadId);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  await saveLead({ ...lead, accepted: true, acceptedAt: new Date().toISOString(), address: address.trim() });
  await sendAcceptedNotificationEmail({ ...lead }, address.trim());

  return NextResponse.json({ ok: true });
}
