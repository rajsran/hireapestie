"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Phone, Mail, MapPin, FileText, Calendar, Trash2 } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "2-digit", month: "short", year: "numeric",
  });
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  suburb?: string;
  postcode?: string;
  created_at: string;
  quote_count: number;
  last_quote_at?: string;
}

export default function CustomersClient({
  customers,
  error,
}: {
  customers: Customer[];
  error?: string;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete(c: Customer) {
    const label = c.name || c.email || "this customer";
    if (!confirm(`Delete ${label}? This also deletes their ${c.quote_count} quote(s) and all their invoices. This cannot be undone.`)) return;

    setDeletingId(c.id);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/customers?id=${encodeURIComponent(c.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setDeleteError("Could not delete customer. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-2xl font-black text-ink-900">Customers</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {(error || deleteError) && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-600">{error || deleteError}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h2 className="font-bold text-ink-900">All Customers</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {customers.length} total
          </span>
        </div>

        {customers.length === 0 && !error ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500">No customers yet</p>
            <p className="text-sm text-gray-400 mt-1">Customers are added automatically when a quote is submitted.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {customers.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink-900 text-sm">{c.name ?? "Unknown"}</p>
                    <div className="mt-1.5 space-y-1">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          {c.email}
                        </a>
                      )}
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {c.phone}
                        </a>
                      )}
                      {(c.suburb || c.postcode) && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {[c.suburb, c.postcode].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right space-y-1.5">
                    <div className="flex items-center gap-1 justify-end">
                      <FileText className="w-3 h-3 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-500">{c.quote_count} quote{c.quote_count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-gray-300" />
                      <span className="text-[10px] text-gray-400">{formatDate(c.created_at)}</span>
                    </div>
                    <Link
                      href={`/admin/invoices?customerId=${c.id}&customerName=${encodeURIComponent(c.name ?? "")}`}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100 rounded-lg px-2 py-1 hover:bg-orange-100 transition-colors"
                    >
                      + Invoice
                    </Link>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      className="inline-flex items-center gap-1 ml-1 text-[10px] font-semibold bg-red-50 text-red-600 border border-red-100 rounded-lg px-2 py-1 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      {deletingId === c.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
