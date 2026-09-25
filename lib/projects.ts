import { neon } from '@neondatabase/serverless';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
}

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function listProjects(): Promise<Project[]> {
  const sql = getDb();
  const rows = await sql`SELECT id, title, description, image_urls, created_at FROM projects ORDER BY created_at DESC`;
  return rows.map(r => ({
    id: r.id as string,
    title: r.title as string,
    description: (r.description ?? '') as string,
    imageUrls: (r.image_urls ?? []) as string[],
    createdAt: String(r.created_at),
  }));
}

export async function saveProject(project: Project): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO projects (id, title, description, image_urls, created_at)
    VALUES (${project.id}, ${project.title}, ${project.description}, ${project.imageUrls}, ${project.createdAt})
    ON CONFLICT (id) DO UPDATE SET
      title       = EXCLUDED.title,
      description = EXCLUDED.description,
      image_urls  = EXCLUDED.image_urls
  `;
}

export async function getProject(id: string): Promise<Project | null> {
  const sql = getDb();
  const rows = await sql`SELECT id, title, description, image_urls, created_at FROM projects WHERE id = ${id}`;
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id as string,
    title: r.title as string,
    description: (r.description ?? '') as string,
    imageUrls: (r.image_urls ?? []) as string[],
    createdAt: String(r.created_at),
  };
}

export async function deleteProject(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}
