export async function shortenUrl(url: string): Promise<string> {
  try {
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (res.ok) {
      const short = (await res.text()).trim();
      if (short.startsWith("http")) return short;
    }
  } catch {
    // fall through to original
  }
  return url;
}
