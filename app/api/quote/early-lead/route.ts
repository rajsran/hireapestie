import { NextRequest, NextResponse } from "next/server";
import { sendEarlyLeadEmail } from "@/lib/sendQuoteEmail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, postcode, suburb } = await req.json() as {
      name: string;
      phone: string;
      email?: string;
      postcode?: string;
      suburb?: string;
    };

    if (!name || !phone) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Fire-and-forget — don't await in the background, just kick it off
    sendEarlyLeadEmail({ name, phone, email, postcode, suburb }).catch(
      (err) => console.error("[early-lead] Email failed:", err),
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
