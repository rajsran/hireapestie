"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/projects";
import { Plus, Trash2, LogOut, FolderOpen, Pencil, Images, LayoutGrid, Users, FileText, Receipt } from "lucide-react";

function blobSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

export default function AdminDashboardClient({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects(p => p.filter(x => x.id !== id));
    setDeleting(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-2xl font-black text-ink-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            href="/admin/projects/new"
            className="flex flex-col items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] text-white font-bold rounded-2xl py-4 shadow-md shadow-orange-200 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">New Project</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-[0.97] text-white font-bold rounded-2xl py-4 shadow-md shadow-blue-200 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Leads</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            href="/admin/customers"
            className="flex flex-col items-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-[0.97] text-white font-bold rounded-2xl py-4 shadow-md shadow-purple-200 transition-all"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Customers</span>
          </Link>
          <Link
            href="/admin/invoices"
            className="flex flex-col items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-[0.97] text-white font-bold rounded-2xl py-4 shadow-md shadow-green-200 transition-all"
          >
            <Receipt className="w-5 h-5" />
            <span className="text-xs">Invoices</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => setShowProjects(v => !v)}
            className={`flex flex-col items-center gap-2 active:scale-[0.97] font-semibold rounded-2xl py-4 border shadow-sm transition-all ${
              showProjects
                ? "bg-ink-900 text-white border-ink-900 shadow-gray-300"
                : "bg-white hover:bg-gray-50 text-ink-900 border-gray-100"
            }`}
          >
            <LayoutGrid className={`w-5 h-5 ${showProjects ? "text-white" : "text-orange-500"}`} />
            <span className="text-xs">Projects</span>
          </button>
          <Link
            href="/admin/hero"
            className="flex flex-col items-center gap-2 bg-white hover:bg-gray-50 active:scale-[0.97] text-ink-900 font-semibold rounded-2xl py-4 border border-gray-100 shadow-sm transition-all"
          >
            <Images className="w-5 h-5 text-orange-500" />
            <span className="text-xs">Hero Photos</span>
          </Link>
        </div>

        {/* Projects section — shown only when toggled */}
        {showProjects && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-gray-400" />
                <h2 className="font-bold text-ink-900">Projects</h2>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {projects.length} total
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-500">No projects yet</p>
                <p className="text-sm text-gray-400 mt-1 mb-5">Add your first project to show customers your work.</p>
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add First Project
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map(p => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex gap-0"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 shrink-0 bg-gray-100">
                      {p.imageUrls[0] ? (
                        <Image src={blobSrc(p.imageUrls[0])} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <FolderOpen className="w-6 h-6" />
                        </div>
                      )}
                      {p.imageUrls.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                          +{p.imageUrls.length - 1}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-bold text-ink-900 truncate text-sm">{p.title}</h3>
                        {p.description && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-gray-300">
                          {new Date(p.createdAt).toLocaleDateString("en-AU")}
                        </span>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/projects/${p.id}/edit`}
                            className="text-gray-300 hover:text-orange-500 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deleting === p.id}
                            className="text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
