import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = req.nextUrl.searchParams.get("customerId");
  if (!customerId) {
    return NextResponse.json({ error: "customerId required" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const quotes = await sql`
      SELECT id, service, levels, roof_type, bedrooms, panels,
             type, size, timeline, estimate_low, estimate_high,
             final_quote, created_at
      FROM quotes
      WHERE customer_id = ${customerId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ quotes });
  } catch (err) {
    console.error("Quotes fetch error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
