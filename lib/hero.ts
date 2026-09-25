import { put, get, list } from '@vercel/blob';

export async function getHeroImages(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: 'hero/meta.json' });
    if (!blobs.length) return [];
    const result = await get(blobs[0].url, { access: 'private' });
    if (!result) return [];
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as string[];
  } catch {
    return [];
  }
}

export async function saveHeroImages(urls: string[]): Promise<void> {
  await put('hero/meta.json', JSON.stringify(urls), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
