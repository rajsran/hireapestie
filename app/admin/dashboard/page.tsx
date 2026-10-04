import { isAdminAuthenticated } from '@/lib/adminAuth';
import { listProjects } from '@/lib/projects';
import { initDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  // Query first; only run migrations if the projects table doesn't exist yet.
  const projects = await listProjects().catch(async () => {
    await initDb();
    return listProjects();
  });
  return <AdminDashboardClient projects={projects} />;
}
