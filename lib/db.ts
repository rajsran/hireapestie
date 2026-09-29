import { neon } from "@neondatabase/serverless";

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id          TEXT PRIMARY KEY,
      name        TEXT,
      email       TEXT UNIQUE,
      phone       TEXT,
      suburb      TEXT,
      postcode    TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id             TEXT PRIMARY KEY,
      customer_id    TEXT REFERENCES customers(id),
      service        TEXT,
      levels         TEXT,
      roof_type      TEXT,
      bedrooms       TEXT,
      panels         TEXT,
      type           TEXT,
      size           TEXT,
      timeline       TEXT,
      estimate_low   INTEGER,
      estimate_high  INTEGER,
      final_quote    NUMERIC,
      quote_sent_at  TIMESTAMPTZ,
      pdf_url        TEXT,
      short_id       TEXT,
      accepted       BOOLEAN DEFAULT FALSE,
      accepted_at    TIMESTAMPTZ,
      address        TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id             TEXT PRIMARY KEY,
      invoice_number TEXT UNIQUE,
      customer_id    TEXT REFERENCES customers(id),
      quote_id       TEXT REFERENCES quotes(id),
      amount         NUMERIC NOT NULL,
      status         TEXT DEFAULT 'draft',
      due_date       DATE,
      paid_at        TIMESTAMPTZ,
      notes          TEXT,
      pdf_url        TEXT,
      service        TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS service TEXT`;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL DEFAULT '',
      description TEXT DEFAULT '',
      image_urls  TEXT[] DEFAULT '{}',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS turf_size TEXT`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS service_detail TEXT`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS photo_url TEXT`;
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS notes TEXT`;
}

export interface DbCustomer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  suburb?: string;
  postcode?: string;
  created_at: string;
}

export interface DbQuote {
  id: string;
  customer_id?: string;
  service?: string;
  levels?: string;
  roof_type?: string;
  bedrooms?: string;
  panels?: string;
  type?: string;
  size?: string;
  timeline?: string;
  estimate_low?: number;
  estimate_high?: number;
  final_quote?: number;
  quote_sent_at?: string;
  pdf_url?: string;
  short_id?: string;
  accepted: boolean;
  accepted_at?: string;
  address?: string;
  created_at: string;
}

export interface DbInvoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  quote_id?: string;
  amount: number;
  status: "draft" | "sent" | "paid";
  due_date?: string;
  paid_at?: string;
  notes?: string;
  pdf_url?: string;
  service?: string;
  created_at: string;
}
