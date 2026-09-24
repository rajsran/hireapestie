import { NextRequest, NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/adminAuth";
import { listLeads, deleteLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await listLeads();
  return NextResponse.json(leads);
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
