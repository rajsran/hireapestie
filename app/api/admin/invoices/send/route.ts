import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";
import { generateInvoicePdf, InvoiceData } from "@/lib/generateInvoicePdf";
import { sendInvoiceEmail } from "@/lib/sendInvoiceEmail";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
    }

    const rows = await sql`
      SELECT
        i.*,
        c.name     AS customer_name,
        c.email    AS customer_email,
        c.phone    AS customer_phone,
        c.suburb   AS customer_suburb,
        c.postcode AS customer_postcode,
        q.service  AS quote_service
      FROM invoices i
      LEFT JOIN customers c ON c.id = i.customer_id
      LEFT JOIN quotes    q ON q.id = i.quote_id
      WHERE i.id = ${invoiceId}
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const row = rows[0];

    if (!row.customer_email) {
      return NextResponse.json({ error: "Customer has no email address" }, { status: 400 });
    }

    // Fetch full quote details if linked
    let quoteRow: Record<string, unknown> = {};
    if (row.quote_id) {
      const qRows = await sql`
        SELECT service, levels, roof_type, bedrooms, panels, type, size, timeline
        FROM quotes WHERE id = ${row.quote_id as string} LIMIT 1
      `;
      if (qRows.length) quoteRow = qRows[0] as Record<string, unknown>;
    }

    const invoiceData: InvoiceData = {
      invoiceNumber:    row.invoice_number as string,
      customerName:     row.customer_name   as string | undefined,
      customerEmail:    row.customer_email  as string,
      customerPhone:    row.customer_phone  as string | undefined,
      customerSuburb:   row.customer_suburb   as string | undefined,
      customerPostcode: row.customer_postcode as string | undefined,
      service:   (quoteRow.service ?? row.service ?? row.quote_service) as string | undefined,
      levels:    quoteRow.levels    as string | undefined,
      roofType:  quoteRow.roof_type as string | undefined,
      bedrooms:  quoteRow.bedrooms  as string | undefined,
      panels:    quoteRow.panels    as string | undefined,
      type:      quoteRow.type      as string | undefined,
      size:      quoteRow.size      as string | undefined,
      timeline:  quoteRow.timeline  as string | undefined,
      amount:    Number(row.amount),
      dueDate:   row.due_date  as string | undefined,
      notes:     row.notes     as string | undefined,
      createdAt: row.created_at as string,
    };

    const pdfBuffer = await generateInvoicePdf(invoiceData);

    // Upload PDF to Blob
    const { url: pdfUrl } = await put(
      `invoices/${row.invoice_number}.pdf`,
      pdfBuffer,
      { access: "public", contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true, token: process.env.BLOB_READ_WRITE_TOKEN },
    );

    // Send email
    await sendInvoiceEmail(invoiceData, pdfBuffer);

    // Update invoice status to 'sent' and store pdf_url
    await sql`
      UPDATE invoices SET status = 'sent', pdf_url = ${pdfUrl}
      WHERE id = ${invoiceId}
    `;

    return NextResponse.json({ ok: true, pdfUrl });
  } catch (err) {
    console.error("Invoice send error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
