import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';

export interface Lead {
  id: string;
  createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  turfSize?: string;
  serviceDetail?: string;
  levels?: string;
  roofType?: string;
  bedrooms?: string;
  panels?: string;
  postcode?: string;
  suburb?: string;
  type?: string;
  size?: string;
  timeline?: string;
  estimate?: { low: number; high: number; note?: string } | null;
  finalQuote?: number;
  quoteSentAt?: string;
  accepted?: boolean;
  acceptedAt?: string;
  address?: string;
  shortId?: string;
  pdfUrl?: string;
  photoUrl?: string;
  notes?: string;
}

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

function rowToLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    createdAt: r.created_at ? new Date(r.created_at as string).toISOString() : '',
    name: r.name as string | undefined,
    email: r.email as string | undefined,
    phone: r.phone as string | undefined,
    service: r.service as string | undefined,
    turfSize: r.turf_size as string | undefined,
    serviceDetail: r.service_detail as string | undefined,
    levels: r.levels as string | undefined,
    roofType: r.roof_type as string | undefined,
    bedrooms: r.bedrooms as string | undefined,
    panels: r.panels as string | undefined,
    postcode: r.postcode as string | undefined,
    suburb: r.suburb as string | undefined,
    type: r.type as string | undefined,
    size: r.size as string | undefined,
    timeline: r.timeline as string | undefined,
    estimate: (r.estimate_low != null && r.estimate_high != null)
      ? { low: Number(r.estimate_low), high: Number(r.estimate_high) }
      : null,
    finalQuote: r.final_quote != null ? Number(r.final_quote) : undefined,
    quoteSentAt: r.quote_sent_at ? new Date(r.quote_sent_at as string).toISOString() : undefined,
    accepted: r.accepted as boolean | undefined,
    acceptedAt: r.accepted_at ? new Date(r.accepted_at as string).toISOString() : undefined,
    address: r.address as string | undefined,
    shortId: r.short_id as string | undefined,
    pdfUrl: r.pdf_url as string | undefined,
    photoUrl: r.photo_url as string | undefined,
    notes: r.notes as string | undefined,
  };
}

export async function listLeads(): Promise<Lead[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT q.*, c.name, c.email, c.phone, c.suburb, c.postcode
    FROM quotes q
    LEFT JOIN customers c ON c.id = q.customer_id
    ORDER BY q.created_at DESC
  `;
  return rows.map(rowToLead);
}

export async function listLeadsPaginated(page: number, pageSize = 10): Promise<{
  leads: Lead[];
  total: number;
  totalPages: number;
}> {
  const sql = getDb();
  const offset = (page - 1) * pageSize;
  const [countRows, rows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total FROM quotes`,
    sql`
      SELECT q.*, c.name, c.email, c.phone, c.suburb, c.postcode
      FROM quotes q
      LEFT JOIN customers c ON c.id = q.customer_id
      ORDER BY q.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
  ]);
  const total = Number(countRows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { leads: rows.map(rowToLead), total, totalPages };
}

export async function getLead(id: string): Promise<Lead | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT q.*, c.name, c.email, c.phone, c.suburb, c.postcode
    FROM quotes q
    LEFT JOIN customers c ON c.id = q.customer_id
    WHERE q.id = ${id}
  `;
  if (!rows.length) return null;
  return rowToLead(rows[0]);
}

export async function saveLead(lead: Lead): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE quotes SET
      service        = COALESCE(${lead.service ?? null}, service),
      turf_size      = COALESCE(${lead.turfSize ?? null}, turf_size),
      service_detail = COALESCE(${lead.serviceDetail ?? null}, service_detail),
      levels         = COALESCE(${lead.levels ?? null}, levels),
      roof_type      = COALESCE(${lead.roofType ?? null}, roof_type),
      bedrooms       = COALESCE(${lead.bedrooms ?? null}, bedrooms),
      panels         = COALESCE(${lead.panels ?? null}, panels),
      type           = COALESCE(${lead.type ?? null}, type),
      size           = COALESCE(${lead.size ?? null}, size),
      timeline       = COALESCE(${lead.timeline ?? null}, timeline),
      estimate_low   = COALESCE(${lead.estimate?.low ?? null}, estimate_low),
      estimate_high  = COALESCE(${lead.estimate?.high ?? null}, estimate_high),
      final_quote    = COALESCE(${lead.finalQuote ?? null}, final_quote),
      quote_sent_at  = COALESCE(${lead.quoteSentAt ? lead.quoteSentAt : null}::timestamptz, quote_sent_at),
      accepted       = COALESCE(${lead.accepted ?? null}, accepted),
      accepted_at    = COALESCE(${lead.acceptedAt ? lead.acceptedAt : null}::timestamptz, accepted_at),
      address        = COALESCE(${lead.address ?? null}, address),
      short_id       = COALESCE(${lead.shortId ?? null}, short_id),
      pdf_url        = COALESCE(${lead.pdfUrl ?? null}, pdf_url),
      photo_url      = COALESCE(${lead.photoUrl ?? null}, photo_url),
      notes          = COALESCE(${lead.notes ?? null}, notes)
    WHERE id = ${lead.id}
  `;
}

export async function savePdf(shortId: string, pdfBuffer: Buffer): Promise<string> {
  const { url } = await put(`pdfs/${shortId}.pdf`, pdfBuffer, {
    access: 'public',
    contentType: 'application/pdf',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

export async function deleteLead(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM quotes WHERE id = ${id}`;
}
