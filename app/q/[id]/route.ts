import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

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
    const { blobs } = await list({
      prefix: `pdfs/${id}.pdf`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (blobs.length) {
      return NextResponse.redirect(blobs[0].url);
    }
  } catch {
    // fall through to homepage redirect
  }

  return NextResponse.redirect(siteUrl);
}
