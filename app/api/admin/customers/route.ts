import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getDb, withDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await withDb(sql => sql`
      SELECT
        c.id, c.name, c.email, c.phone, c.suburb, c.postcode, c.created_at,
        COUNT(q.id)::int AS quote_count,
        MAX(q.created_at) AS last_quote_at
      FROM customers c
      LEFT JOIN quotes q ON q.customer_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ customers });
  } catch (err) {
    console.error("Customers fetch error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Deletes a customer together with their invoices and quotes (FKs have no cascade).
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const sql = getDb();
    // Invoices reference both the customer and their quotes, so they go first.
    await sql.transaction([
      sql`DELETE FROM invoices WHERE customer_id = ${id}
          OR quote_id IN (SELECT id FROM quotes WHERE customer_id = ${id})`,
      sql`DELETE FROM quotes WHERE customer_id = ${id}`,
      sql`DELETE FROM customers WHERE id = ${id}`,
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Customer delete error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
