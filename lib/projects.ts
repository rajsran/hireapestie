import { list, put, del, get } from '@vercel/blob';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
}

async function getBlobJson<T>(url: string): Promise<T> {
  const result = await get(url, { access: 'private' });
  if (!result) throw new Error(`Blob not found: ${url}`);
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function listProjects(): Promise<Project[]> {
  const { blobs } = await list({ prefix: 'projects/' });
  const metaBlobs = blobs.filter(b => b.pathname.endsWith('/meta.json'));
  if (!metaBlobs.length) return [];

  const projects = await Promise.all(
    metaBlobs.map(b => getBlobJson<Project>(b.url))
  );

  return projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveProject(project: Project): Promise<void> {
  await put(`projects/${project.id}/meta.json`, JSON.stringify(project), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const { blobs } = await list({ prefix: `projects/${id}/meta.json` });
  if (!blobs.length) return null;
  return getBlobJson<Project>(blobs[0].url);
}

export async function deleteProject(id: string): Promise<void> {
  const { blobs } = await list({ prefix: `projects/${id}/` });
  if (blobs.length) await Promise.all(blobs.map(b => del(b.url)));
}
