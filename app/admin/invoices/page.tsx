import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { getDb, initDb } from "@/lib/db";
import InvoicesClient from "./InvoicesClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; customerName?: string; quoteId?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = await searchParams;

  try {
    await initDb();
    const sql = getDb();

    const invoices = await sql`
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
      ORDER BY i.created_at DESC
    `;

    // Load customers for the new-invoice form dropdown
    const customers = await sql`
      SELECT id, name, email, phone, suburb, postcode FROM customers ORDER BY name ASC
    `;

    // Load quotes for the selected customer if creating a new invoice
    const quotes = params.customerId ? await sql`
      SELECT id, service, final_quote, estimate_low, estimate_high, created_at
      FROM quotes WHERE customer_id = ${params.customerId}
      ORDER BY created_at DESC
    ` : [];

    return (
      <InvoicesClient
        invoices={invoices as never}
        customers={customers as never}
        quotes={quotes as never}
        prefillCustomerId={params.customerId}
        prefillCustomerName={params.customerName}
        prefillQuoteId={params.quoteId}
      />
    );
  } catch {
    return (
      <InvoicesClient
        invoices={[]}
        customers={[]}
        quotes={[]}
        error="Could not connect to database. Check NEON_DATABASE_URL."
      />
    );
  }
}
