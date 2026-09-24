import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getDb, initDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDb();
    const sql = getDb();

    const customers = await sql`
      SELECT
        c.id, c.name, c.email, c.phone, c.suburb, c.postcode, c.created_at,
        COUNT(q.id)::int AS quote_count,
        MAX(q.created_at) AS last_quote_at
      FROM customers c
      LEFT JOIN quotes q ON q.customer_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    return NextResponse.json({ customers });
  } catch (err) {
    console.error("Customers fetch error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
