import { isAdminAuthenticated } from '@/lib/adminAuth';
import { listProjects } from '@/lib/projects';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');

  const projects = await listProjects();
  return <AdminDashboardClient projects={projects} />;
}
