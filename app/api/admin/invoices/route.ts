import { NextRequest, NextResponse } from "next/server";
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

    const invoices = await sql`
      SELECT
        i.*,
        c.name  AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.suburb AS customer_suburb,
        c.postcode AS customer_postcode,
        q.service AS quote_service
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      LEFT JOIN quotes    q ON q.id = i.quote_id
      ORDER BY i.created_at DESC
    `;

    return NextResponse.json({ invoices });
  } catch (err) {
    console.error("Invoices fetch error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDb();
    const sql = getDb();

    const body = await req.json();
    const { customerId: existingCustomerId, newCustomer, quoteId, amount, dueDate, notes, service } = body;

    if (!amount) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }

    let customerId: string = existingCustomerId ?? "";

    if (!customerId && newCustomer) {
      const { name, email, phone, suburb, postcode } = newCustomer as {
        name?: string; email?: string; phone?: string; suburb?: string; postcode?: string;
      };
      if (!name?.trim() || !email?.trim()) {
        return NextResponse.json({ error: "New customer requires name and email" }, { status: 400 });
      }
      // Single upsert — reuses existing customer if email matches
      const custId = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const [row] = await sql`
        INSERT INTO customers (id, name, email, phone, suburb, postcode)
        VALUES (${custId}, ${name.trim()}, ${email.trim()}, ${phone ?? null}, ${suburb ?? null}, ${postcode ?? null})
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(EXCLUDED.name, customers.name)
        RETURNING id
      `;
      customerId = row.id as string;
    }

    if (!customerId) {
      return NextResponse.json({ error: "customerId or newCustomer is required" }, { status: 400 });
    }

    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const id = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    await sql`
      INSERT INTO invoices (id, invoice_number, customer_id, quote_id, amount, due_date, notes, status, service)
      VALUES (
        ${id}, ${invoiceNumber}, ${customerId},
        ${quoteId ?? null}, ${Number(amount)},
        ${dueDate ?? null}, ${notes ?? null}, 'draft', ${service ?? null}
      )
    `;

    const [invoice] = await sql`SELECT * FROM invoices WHERE id = ${id}`;
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    console.error("Invoice create error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }

    const paidAt = status === "paid" ? new Date().toISOString() : null;
    await sql`
      UPDATE invoices SET status = ${status}, paid_at = ${paidAt}
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Invoice update error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
