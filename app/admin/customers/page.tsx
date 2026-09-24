import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { getDb, initDb } from "@/lib/db";
import CustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

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
    return <CustomersClient customers={customers as never} />;
  } catch {
    return <CustomersClient customers={[]} error="Could not connect to database. Check NEON_DATABASE_URL." />;
  }
}
