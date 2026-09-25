import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://turfcleanpros.com.au";

  if (!id || !/^[a-z0-9]{4,12}$/i.test(id)) {
    return NextResponse.redirect(siteUrl);
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT pdf_url FROM quotes WHERE short_id = ${id} LIMIT 1`;
    if (rows.length && rows[0].pdf_url) {
      return NextResponse.redirect(rows[0].pdf_url as string);
    }
  } catch {
    // fall through
  }

  return NextResponse.redirect(siteUrl);
}
