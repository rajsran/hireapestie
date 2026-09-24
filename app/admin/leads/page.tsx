import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listLeadsPaginated } from "@/lib/leads";
import { redirect } from "next/navigation";
import LeadsClient from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { leads, total, totalPages } = await listLeadsPaginated(page);
  return <LeadsClient key={page} leads={leads} total={total} page={page} totalPages={totalPages} />;
}
