import { list, put, del } from '@vercel/blob';

export interface Lead {
  id: string;
  createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
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
}

async function getBlobJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Blob fetch failed: ${url}`);
  return res.json() as Promise<T>;
}

export async function listLeads(): Promise<Lead[]> {
  const { blobs } = await list({ prefix: 'leads/', token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) return [];
  const leads = await Promise.all(blobs.map(b => getBlobJson<Lead>(b.url)));
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function listLeadsPaginated(page: number, pageSize = 10): Promise<{
  leads: Lead[];
  total: number;
  totalPages: number;
}> {
  const { blobs } = await list({ prefix: 'leads/', token: process.env.BLOB_READ_WRITE_TOKEN });
  const total = blobs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Sort blob metadata by uploadedAt (no content fetch yet) then slice to page
  const sorted = [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  const pageBlobs = sorted.slice((page - 1) * pageSize, page * pageSize);
  const leads = await Promise.all(pageBlobs.map(b => getBlobJson<Lead>(b.url)));

  return { leads, total, totalPages };
}

export async function saveLead(lead: Lead): Promise<void> {
  await put(`leads/${lead.id}.json`, JSON.stringify(lead), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function getLead(id: string): Promise<Lead | null> {
  const { blobs } = await list({ prefix: `leads/${id}.json`, token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) return null;
  return getBlobJson<Lead>(blobs[0].url);
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
  const { blobs } = await list({ prefix: `leads/${id}.json`, token: process.env.BLOB_READ_WRITE_TOKEN });
  if (blobs.length) await Promise.all(blobs.map(b => del(b.url, { token: process.env.BLOB_READ_WRITE_TOKEN })));
}
