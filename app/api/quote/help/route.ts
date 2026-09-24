import { NextRequest, NextResponse } from "next/server";
import { getLead } from "@/lib/leads";
import { sendHelpNotificationEmail } from "@/lib/sendQuoteEmail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { leadId } = await req.json() as { leadId: string };

  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
  }

  const lead = await getLead(leadId);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  await sendHelpNotificationEmail({ ...lead });

  return NextResponse.json({ ok: true });
}
