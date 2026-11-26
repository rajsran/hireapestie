"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Trash2, Loader2 } from "lucide-react";
import { compressImage } from "@/app/admin/compressImage";

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

export default function HeroAdminClient({ initialUrls }: { initialUrls: string[] }) {
  const [urls, setUrls] = useState(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file, 1920, 0.8);
        const form = new FormData();
        form.append("file", compressed);
        const res = await fetch("/api/admin/hero", { method: "POST", body: form });
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        setUrls(prev => [url, ...prev]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("Remove this hero photo?")) return;
    setDeleting(url);
    const res = await fetch("/api/admin/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) setUrls(prev => prev.filter(u => u !== url));
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Hero Photos</h1>
            <p className="text-sm text-gray-400 mt-0.5">Shown in the homepage slider</p>
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors mb-6"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Add Photos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {urls.length === 0 ? (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <ImagePlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hero photos yet. Upload some above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {urls.map((url, i) => (
              <div key={url} className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video">
                <Image src={blobSrc(url)} alt={`Hero ${i + 1}`} fill className="object-cover" unoptimized={blobSrc(url).startsWith('/api/image')} />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(url)}
                    disabled={deleting === url}
                    className="bg-black/60 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-2 transition-colors"
                  >
                    {deleting === url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  Slide {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
