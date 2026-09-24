"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FileText, CheckCircle2, Send, Clock,
  ChevronDown, ChevronUp, Plus, X, Loader2,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "2-digit", month: "short", year: "numeric",
  });
}

const SERVICES = [
  "Residential Turf Cleaning",
  "Commercial Turf Cleaning",
  "Bird Proofing Mesh",
  "Other",
] as const;

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_suburb?: string;
  customer_postcode?: string;
  quote_id?: string;
  quote_service?: string;
  service?: string;
  amount: number;
  status: "draft" | "sent" | "paid";
  due_date?: string;
  paid_at?: string;
  notes?: string;
  pdf_url?: string;
  created_at: string;
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  suburb?: string;
  postcode?: string;
}

interface Quote {
  id: string;
  service?: string;
  levels?: string;
  roof_type?: string;
  bedrooms?: string;
  panels?: string;
  type?: string;
  size?: string;
  timeline?: string;
  final_quote?: number;
  estimate_low?: number;
  estimate_high?: number;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500 border-gray-200",
  sent:  "bg-blue-50 text-blue-600 border-blue-200",
  paid:  "bg-green-50 text-green-700 border-green-200",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft: <Clock className="w-3 h-3" />,
  sent:  <Send className="w-3 h-3" />,
  paid:  <CheckCircle2 className="w-3 h-3" />,
};

function InvoiceCard({
  invoice,
  onStatusChange,
  onSend,
  onToast,
}: {
  invoice: Invoice;
  onStatusChange: (id: string, status: string) => void;
  onSend: (id: string) => void;
  onToast: (msg: string, type: "loading" | "success" | "error") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [sending, setSending] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!confirm("Send this invoice to the customer?")) return;
    setSending(true);
    setError("");
    onToast("Sending invoice to customer…", "loading");
    try {
      const res = await fetch("/api/admin/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        const msg = d.error ?? "Failed to send";
        setError(msg);
        onToast(msg, "error");
      } else {
        onSend(invoice.id);
        onToast("Invoice sent successfully!", "success");
      }
    } catch {
      setError("Network error");
      onToast("Network error — please try again", "error");
    } finally {
      setSending(false);
    }
  }

  async function handleMarkPaid() {
    setMarkingPaid(true);
    setError("");
    onToast("Marking invoice as paid…", "loading");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoice.id, status: "paid" }),
      });
      if (res.ok) {
        onStatusChange(invoice.id, "paid");
        onToast("Invoice marked as paid!", "success");
      } else {
        setError("Failed to update");
        onToast("Failed to update status", "error");
      }
    } catch {
      setError("Network error");
      onToast("Network error — please try again", "error");
    } finally {
      setMarkingPaid(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-ink-900 text-sm">{invoice.customer_name ?? "Unknown"}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${STATUS_STYLES[invoice.status]}`}>
              {STATUS_ICONS[invoice.status]}
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
            <span className="text-[10px] font-mono text-gray-400">{invoice.invoice_number}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs font-bold text-orange-500">
              ${Number(invoice.amount).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-gray-400">{formatDate(invoice.created_at)}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {invoice.customer_email && (
              <div><span className="text-gray-400">Email</span><p className="font-medium text-gray-700 truncate">{invoice.customer_email}</p></div>
            )}
            {invoice.customer_phone && (
              <div><span className="text-gray-400">Phone</span><p className="font-medium text-gray-700">{invoice.customer_phone}</p></div>
            )}
            {(invoice.quote_service ?? invoice.service) && (
              <div><span className="text-gray-400">Service</span><p className="font-medium text-gray-700">{invoice.quote_service ?? invoice.service}</p></div>
            )}
            {invoice.due_date && (
              <div><span className="text-gray-400">Due</span><p className="font-medium text-gray-700">{formatDate(invoice.due_date)}</p></div>
            )}
            {invoice.notes && (
              <div className="col-span-2"><span className="text-gray-400">Notes</span><p className="font-medium text-gray-700">{invoice.notes}</p></div>
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            {invoice.status !== "paid" && (
              <>
                {invoice.status === "draft" && (
                  <button
                    onClick={handleSend}
                    disabled={sending || !invoice.customer_email}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg py-2.5 transition-colors"
                  >
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {sending ? "Sending…" : "Send Invoice"}
                  </button>
                )}
                <button
                  onClick={handleMarkPaid}
                  disabled={markingPaid}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg py-2.5 transition-colors"
                >
                  {markingPaid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {markingPaid ? "Updating…" : "Mark as Paid"}
                </button>
              </>
            )}
            {invoice.pdf_url && (
              <a
                href={invoice.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvoicesClient({
  invoices: initial,
  customers,
  quotes: initialQuotes,
  prefillCustomerId,
  prefillCustomerName,
  prefillQuoteId,
  error,
}: {
  invoices: Invoice[];
  customers: Customer[];
  quotes: Quote[];
  prefillCustomerId?: string;
  prefillCustomerName?: string;
  prefillQuoteId?: string;
  error?: string;
}) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initial);
  const [showForm, setShowForm] = useState(!!prefillCustomerId);
  const [toast, setToast] = useState<{ msg: string; type: "loading" | "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string, type: "loading" | "success" | "error") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    if (type !== "loading") {
      toastTimer.current = setTimeout(() => setToast(null), 3000);
    }
  }

  const [customerMode, setCustomerMode] = useState<"existing" | "new">(prefillCustomerId ? "existing" : "existing");
  const [customerId, setCustomerId] = useState(prefillCustomerId ?? "");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSuburb, setNewSuburb] = useState("");
  const [newPostcode, setNewPostcode] = useState("");
  const [quoteId, setQuoteId] = useState(prefillQuoteId ?? "");
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [service, setService] = useState("");
  const [otherService, setOtherService] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedQuote = quotes.find(q => q.id === quoteId);

  // Fetch quotes whenever existing customer changes
  useEffect(() => {
    if (!customerId || customerMode !== "existing") { setQuotes([]); setQuoteId(""); setAmount(""); return; }
    setLoadingQuotes(true);
    fetch(`/api/admin/customers/quotes?customerId=${customerId}`)
      .then(r => r.json())
      .then(d => {
        const qs: Quote[] = d.quotes ?? [];
        setQuotes(qs);
        if (qs.length > 0) {
          const first = qs[0];
          setQuoteId(first.id);
          setAmount(String(first.final_quote ?? first.estimate_low ?? ""));
          if (first.service) setService(SERVICES.includes(first.service as typeof SERVICES[number]) ? first.service : "Other");
        } else {
          setQuoteId("");
          setAmount("");
        }
      })
      .catch(() => setQuotes([]))
      .finally(() => setLoadingQuotes(false));
  }, [customerId, customerMode]);

  async function handleCreate() {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setFormError("Enter a valid amount"); return; }

    const resolvedService = service === "Other" ? (otherService.trim() || undefined) : (service || undefined);

    let body: Record<string, unknown>;
    if (customerMode === "existing") {
      if (!customerId) { setFormError("Select a customer"); return; }
      body = { customerId, quoteId: quoteId || undefined, service: resolvedService, amount: parsed, dueDate: dueDate || undefined, notes: notes || undefined };
    } else {
      if (!newName.trim()) { setFormError("Customer name is required"); return; }
      if (!newEmail.trim()) { setFormError("Customer email is required"); return; }
      body = {
        newCustomer: { name: newName.trim(), email: newEmail.trim(), phone: newPhone.trim() || undefined, suburb: newSuburb.trim() || undefined, postcode: newPostcode.trim() || undefined },
        service: resolvedService,
        amount: parsed,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
      };
    }

    setFormError("");
    setCreating(true);
    showToast("Creating invoice…", "loading");

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json();
        const msg = d.error ?? "Failed to create";
        setFormError(msg);
        showToast(msg, "error");
        return;
      }

      showToast("Invoice created!", "success");
      router.refresh();
      setShowForm(false);
      setCustomerMode("existing");
      setCustomerId("");
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewSuburb(""); setNewPostcode("");
      setQuoteId("");
      setService("");
      setOtherService("");
      setAmount("");
      setDueDate("");
      setNotes("");
    } catch {
      setFormError("Network error");
      showToast("Network error — please try again", "error");
    } finally {
      setCreating(false);
    }
  }

  function handleStatusChange(id: string, status: string) {
    setInvoices(inv => inv.map(i => i.id === id ? { ...i, status: status as Invoice["status"] } : i));
  }

  function handleSend(id: string) {
    setInvoices(inv => inv.map(i => i.id === id ? { ...i, status: "sent" } : i));
    router.refresh();
  }

  const totals = {
    draft: invoices.filter(i => i.status === "draft").length,
    sent:  invoices.filter(i => i.status === "sent").length,
    paid:  invoices.filter(i => i.status === "paid").length,
    total: invoices.reduce((s, i) => i.status === "paid" ? s + Number(i.amount) : s, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Global toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all
          ${toast.type === "loading" ? "bg-[#1A6B3C] text-white" : ""}
          ${toast.type === "success" ? "bg-green-600 text-white" : ""}
          ${toast.type === "error"   ? "bg-red-600 text-white" : ""}
        `}>
          {toast.type === "loading" && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {toast.type === "error"   && <X className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-2xl font-black text-ink-900">Invoices</h1>
          </div>
          <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Stats row */}
        {invoices.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: "Draft", value: totals.draft, color: "text-gray-500" },
              { label: "Sent",  value: totals.sent,  color: "text-blue-500" },
              { label: "Paid",  value: totals.paid,  color: "text-green-600" },
              { label: "Revenue", value: `$${totals.total.toLocaleString()}`, color: "text-orange-500" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-3 py-3 text-center shadow-sm">
                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* New Invoice button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <h2 className="font-bold text-ink-900">All Invoices</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{invoices.length}</span>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 py-2 transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Cancel" : "New Invoice"}
          </button>
        </div>

        {/* New Invoice Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 mb-4 space-y-3">
            <p className="text-sm font-bold text-ink-900">Create Invoice</p>

            {/* Customer mode toggle */}
            {!prefillCustomerId && (
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-bold">
                <button
                  onClick={() => { setCustomerMode("existing"); setNewName(""); setNewEmail(""); setNewPhone(""); setNewSuburb(""); setNewPostcode(""); }}
                  className={`flex-1 py-2 transition-colors ${customerMode === "existing" ? "bg-orange-500 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}
                >
                  Existing Customer
                </button>
                <button
                  onClick={() => { setCustomerMode("new"); setCustomerId(""); setQuoteId(""); setQuotes([]); }}
                  className={`flex-1 py-2 transition-colors ${customerMode === "new" ? "bg-orange-500 text-white" : "bg-white text-gray-400 hover:text-gray-600"}`}
                >
                  New Customer
                </button>
              </div>
            )}

            {/* Existing customer dropdown */}
            {customerMode === "existing" && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Customer</span>
                {prefillCustomerId && prefillCustomerName ? (
                  <p className="text-sm font-bold text-ink-900">{prefillCustomerName}</p>
                ) : (
                  <select
                    value={customerId}
                    onChange={e => { setCustomerId(e.target.value); setQuoteId(""); }}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Select customer…</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name ?? c.email ?? c.id}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* New customer fields */}
            {customerMode === "new" && (
              <div className="space-y-2 border border-gray-100 rounded-xl px-3 py-3 bg-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">New Customer Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Name *</span>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Full name"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Email *</span>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</span>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="04xx xxx xxx"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Suburb</span>
                    <input
                      type="text"
                      value={newSuburb}
                      onChange={e => setNewSuburb(e.target.value)}
                      placeholder="Suburb"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Postcode</span>
                    <input
                      type="text"
                      value={newPostcode}
                      onChange={e => setNewPostcode(e.target.value)}
                      placeholder="3000"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Linked quote (existing customer only) */}
            {customerMode === "existing" && (loadingQuotes || quotes.length > 0) && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Linked Quote {loadingQuotes && <span className="text-gray-300">(loading…)</span>}
                </span>
                <select
                  value={quoteId}
                  disabled={loadingQuotes}
                  onChange={e => {
                    setQuoteId(e.target.value);
                    const q = quotes.find(x => x.id === e.target.value);
                    if (q) {
                      setAmount(String(q.final_quote ?? q.estimate_low ?? ""));
                      if (q.service) setService(SERVICES.includes(q.service as typeof SERVICES[number]) ? q.service : "Other");
                    }
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                >
                  <option value="">No linked quote</option>
                  {quotes.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.service ?? "Quote"} — {formatDate(q.created_at)}
                      {q.final_quote ? ` · $${q.final_quote}` : q.estimate_low ? ` · Est. $${q.estimate_low}–$${q.estimate_high}` : ""}
                    </option>
                  ))}
                </select>

                {selectedQuote && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { label: "Service",  value: selectedQuote.service },
                      { label: "Levels",   value: selectedQuote.levels },
                      { label: "Roof",     value: selectedQuote.roof_type },
                      { label: "Bedrooms", value: selectedQuote.bedrooms },
                      { label: "Panels",   value: selectedQuote.panels },
                      { label: "Type",     value: selectedQuote.type },
                      { label: "Size",     value: selectedQuote.size },
                      { label: "Timeline", value: selectedQuote.timeline },
                    ].filter(r => r.value).map(r => (
                      <div key={r.label}>
                        <span className="text-[9px] text-blue-400 uppercase tracking-wider">{r.label}</span>
                        <p className="text-xs font-semibold text-blue-900">{r.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Service */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Service</span>
              <select
                value={service}
                onChange={e => setService(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select service…</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {service === "Other" && (
                <input
                  type="text"
                  value={otherService}
                  onChange={e => setOtherService(e.target.value)}
                  placeholder="Describe the service…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Amount ($)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-400">$</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 350"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Due Date (optional)</span>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Any additional notes for the customer…"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-sm font-bold rounded-xl py-3 transition-colors"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {creating ? "Creating…" : "Create Invoice"}
            </button>

            {customerMode === "existing" && selectedCustomer && !selectedCustomer.email && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                This customer has no email — you can create the invoice but won&apos;t be able to send it.
              </p>
            )}
          </div>
        )}

        {/* Invoice list */}
        {invoices.length === 0 && !error ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500">No invoices yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first invoice using the button above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invoices.map(inv => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                onStatusChange={handleStatusChange}
                onSend={handleSend}
                onToast={showToast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
