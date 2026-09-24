"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lead } from "@/lib/leads";
import { ArrowLeft, Trash2, Phone, Mail, Users, ChevronDown, ChevronUp, SendHorizonal, CheckCircle2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";

const SENDING_MESSAGES = [
  "📤 Sending the quote...",
  "🖨️ Printing pixels onto the PDF...",
  "📡 Beaming it to their inbox...",
  "🚀 Quote is cleared for launch...",
  "☕ Grab a coffee, almost there...",
  "📬 Delivering to their letterbox...",
  "🔧 Tightening the last bolt...",
  "✨ Sprinkling some professionalism...",
  "🛸 Sending via satellite...",
  "🐦 Carrier pigeon dispatched...",
];

function SendingDialog() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex(i => (i + 1) % SENDING_MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-16 h-16 rounded-full bg-orange-100 animate-ping opacity-50" />
          <div className="relative w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
            <SendHorizonal className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-center min-h-[48px] flex items-center justify-center">
          <p
            key={msgIndex}
            className="text-sm font-semibold text-gray-700 animate-pulse"
          >
            {SENDING_MESSAGES[msgIndex]}
          </p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const LEVELS_OPTIONS   = ["1 level", "2 levels"];
const ROOF_OPTIONS     = ["Tile", "Colorbond / Metal", "Wood Shingles"];
const BEDROOM_OPTIONS  = ["1–2 bedrooms", "3–4 bedrooms", "5+ bedrooms"];

function Select({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function isTurf(service?: string) {
  return service === "Residential Turf Cleaning" || service === "Commercial Turf Cleaning";
}
function isMesh(service?: string) {
  return service === "Bird Proofing Mesh";
}

function LeadCard({ lead, onDelete, onQuoteSent }: {
  lead: Lead;
  onDelete: (id: string) => void;
  onQuoteSent: (id: string, amount: number, updates: Partial<Lead>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Editable fields
  const [levels,   setLevels]   = useState(lead.levels   ?? LEVELS_OPTIONS[0]);
  const [roofType, setRoofType] = useState(lead.roofType ?? ROOF_OPTIONS[0]);
  const [bedrooms, setBedrooms] = useState(lead.bedrooms ?? BEDROOM_OPTIONS[0]);
  const [panels,   setPanels]   = useState(lead.panels   ?? "");
  const [amount,      setAmount]      = useState(lead.finalQuote ? String(lead.finalQuote) : "");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(!!lead.quoteSentAt);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [warning,  setWarning]  = useState("");

  async function handleDelete() {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/leads?id=${lead.id}`, { method: "DELETE" });
    onDelete(lead.id);
  }

  async function handleSendQuote() {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError("Enter a valid amount"); return; }
    setError("");
    setWarning("");
    setSending(true);

    const updates = isTurf(lead.service)
      ? { levels, roofType, bedrooms }
      : isMesh(lead.service)
        ? { panels }
        : {};

    try {
      const res = await fetch("/api/admin/leads/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, finalAmount: parsed, updates, bookingDate: bookingDate || undefined, bookingTime: bookingTime || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to send");
      } else {
        const data = await res.json().catch(() => ({}));
        setSent(true);
        setShowEdit(false);
        onQuoteSent(lead.id, parsed, updates);
        if (data.emailFailed) {
          setWarning("Email bounced — sent via SMS only");
        }
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSending(false);
    }
  }

  const estimateText = lead.estimate
    ? `$${lead.estimate.low}–$${lead.estimate.high}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top row */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-ink-900 text-sm">{lead.name ?? "Unknown"}</span>
            {lead.service && (
              <span className="text-[10px] bg-orange-50 text-orange-600 font-semibold px-2 py-0.5 rounded-full border border-orange-100">
                {lead.service}
              </span>
            )}
            {lead.accepted ? (
              <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Accepted
              </span>
            ) : sent && lead.finalQuote ? (
              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <SendHorizonal className="w-3 h-3" />
                Quote sent · ${lead.finalQuote.toLocaleString()}
              </span>
            ) : estimateText ? (
              <span className="text-[10px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded-full border border-gray-200">
                Est. {estimateText}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(lead.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setShowEdit(false); setExpanded(e => !e); }}
            className="text-gray-300 hover:text-gray-500 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-3">
          {/* Contact */}
          <div className="space-y-1.5">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {lead.phone}
              </a>
            )}
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {lead.email}
              </a>
            ) : (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> No email — cannot send PDF
              </p>
            )}
          </div>

          {/* Job details (read-only summary when not editing) */}
          {!showEdit && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {lead.levels   && <Detail label="Levels"   value={lead.levels} />}
              {lead.roofType && <Detail label="Roof"     value={lead.roofType} />}
              {lead.bedrooms && <Detail label="Bedrooms" value={lead.bedrooms} />}
              {lead.panels   && <Detail label="Panels"   value={lead.panels} />}
              {lead.type     && <Detail label="Type"     value={lead.type} />}
              {lead.size     && <Detail label="Size"     value={lead.size} />}
              {lead.timeline && <Detail label="Timeline" value={lead.timeline} />}
            </div>
          )}

          {/* Accepted address */}
          {lead.accepted && lead.address && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 space-y-0.5">
              <span className="text-[10px] text-green-600 uppercase tracking-wider font-semibold">Property Address</span>
              <p className="text-sm text-green-900 font-medium">{lead.address}</p>
              {lead.acceptedAt && (
                <p className="text-[11px] text-green-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Accepted {formatDate(lead.acceptedAt)}
                </p>
              )}
            </div>
          )}

          {/* Edit / Send panel */}
          <div className="pt-1">
            {!showEdit ? (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                {sent ? "Send updated quote" : "Enter final quote & send PDF"}
              </button>
            ) : (
              <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">

                {/* Editable job fields */}
                {isTurf(lead.service) && (
                  <div className="grid grid-cols-1 gap-3">
                    <Select label="Levels"   value={levels}   options={LEVELS_OPTIONS}  onChange={setLevels} />
                    <Select label="Roof Type" value={roofType} options={ROOF_OPTIONS}    onChange={setRoofType} />
                    <Select label="Bedrooms" value={bedrooms} options={BEDROOM_OPTIONS}  onChange={setBedrooms} />
                  </div>
                )}
                {isMesh(lead.service) && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Panels</span>
                    <input
                      type="number"
                      min="1"
                      value={panels.replace(/\D/g, "")}
                      onChange={e => setPanels(e.target.value ? `${e.target.value} panels` : "")}
                      placeholder="e.g. 20"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                )}

                {/* Final amount */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Final Quote Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500">$</span>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={e => { setAmount(e.target.value); setError(""); }}
                      placeholder="e.g. 350"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>
                </div>

                {/* Booking date & time */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Booking Date & Time <span className="normal-case text-gray-300">(optional)</span></span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="">Select time</option>
                      {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                {sending && <SendingDialog />}

                <div className="flex gap-2">
                  <button
                    onClick={handleSendQuote}
                    disabled={sending || !lead.email}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg py-2.5 transition-colors"
                  >
                    <SendHorizonal className="w-3.5 h-3.5" />
                    Send PDF to Customer
                  </button>
                  <button
                    onClick={() => { setShowEdit(false); setError(""); }}
                    className="px-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {sent && lead.quoteSentAt && !lead.accepted && (
            <p className="text-[11px] text-blue-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Last sent {formatDate(lead.quoteSentAt)}
            </p>
          )}
          {warning && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1">
              ⚠ {warning}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="text-xs text-gray-700 font-medium">{value}</p>
    </div>
  );
}

export default function LeadsClient({
  leads: initial,
  total,
  page,
  totalPages,
}: {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const [leads, setLeads] = useState(initial);

  function handleDelete(id: string) {
    setLeads(l => l.filter(x => x.id !== id));
  }

  function handleQuoteSent(id: string, amount: number, updates: Partial<Lead>) {
    setLeads(l => l.map(x => x.id === id
      ? { ...x, ...updates, finalQuote: amount, quoteSentAt: new Date().toISOString() }
      : x
    ));
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-2xl font-black text-ink-900">Leads</h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h2 className="font-bold text-ink-900">All Leads</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {total} total
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500">No leads yet</p>
            <p className="text-sm text-gray-400 mt-1">New quote submissions will appear here.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {leads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onDelete={handleDelete}
                  onQuoteSent={handleQuoteSent}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                {page > 1 ? (
                  <Link
                    href={`/admin/leads?page=${page - 1}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    href={`/admin/leads?page=${page + 1}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
