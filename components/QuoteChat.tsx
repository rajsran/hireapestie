"use client";

import { useState, useRef } from "react";
import { X, ChevronLeft, CheckCircle2, Loader2, Phone, Camera } from "lucide-react";

// ─── CONFIG — edit prices, rates and webhook here ────────────────────────────
const CONFIG = {
  webhookUrl: "",          // Formspree / Make / Zapier URL; leave "" for /api/quote/submit
  phone:      "0433 240 617",

  services: [
    { id: "deep-clean",  emoji: "🌿", name: "Synthetic Turf Deep Clean",   sub: "Full brush, groom & vacuum clean · add-ons available", from: "From $199", base: 199, rate: 7, hasAddons: true  },
    { id: "pet-odour",   emoji: "🐾", name: "Pet Odour & Stain Treatment", sub: "Enzyme treatment for pet odours",                       from: "From $99",  base: 99,  rate: 3                  },
    { id: "moss-algae",  emoji: "🍃", name: "Moss & Algae Removal",        sub: "Bio-safe treatment for slippery turf",                  from: "From $89",  base: 89,  rate: 4                  },
    { id: "debris",      emoji: "🍂", name: "Debris & Leaf Clearing",      sub: "Surface clear & drainage refresh",                     from: "From $69",  base: 69,  rate: 2                  },
    { id: "maintenance", emoji: "🔁", name: "Scheduled Maintenance Plan",  sub: "10–15% off · quarterly visits",                        from: "From $179/visit", isMaintenance: true           },
  ] as Service[],

  addons: [
    { id: "pet-odour",  emoji: "🐾", name: "Pet Odour & Stain Treatment", sub: "Enzyme treatment for pet odours",      base: 99, rate: 3 },
    { id: "moss-algae", emoji: "🍃", name: "Moss & Algae Removal",        sub: "Bio-safe treatment for slippery turf", base: 89, rate: 4 },
    { id: "infill",     emoji: "🏝️", name: "Infill Top-Up",               sub: "Kiln-dried sand top-up · ~2kg/m²",     base: 89, rate: 4 },
  ],

  maintenanceDiscount: { quarterly: 0.10, annual: 0.15 } as Record<string, number>,
  addonOff:    0.40,
  sliderMin:   25,
  sliderMax:   200,
  sliderStep:  5,
  customAt:    100,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  id: string; emoji: string; name: string; sub: string; from: string;
  base?: number; rate?: number; hasAddons?: boolean; isMaintenance?: boolean;
}

interface St {
  step: number;
  serviceId: string;
  area: number;
  addons: string[];
  billing: "quarterly" | "annual";
  name: string; email: string; phone: string; suburb: string; postcode: string; notes: string;
}

interface PhotoEntry {
  id: string;
  file: File;
  url: string | null;
  uploading: boolean;
}

const INIT: St = {
  step: 1, serviceId: "", area: CONFIG.sliderMin, addons: [], billing: "quarterly",
  name: "", email: "", phone: "", suburb: "", postcode: "", notes: "",
};

export interface QuoteChatProps { isOpen: boolean; onClose: () => void; }

// ─── Pricing helpers ──────────────────────────────────────────────────────────
function svcPrice(id: string, area: number): number | null {
  const s = CONFIG.services.find(x => x.id === id);
  if (!s || s.isMaintenance || s.base === undefined || s.rate === undefined) return null;
  return Math.round(s.base + s.rate * (area - CONFIG.sliderMin));
}
function addonFull(id: string, area: number) {
  const a = CONFIG.addons.find(x => x.id === id)!;
  return Math.round(a.base + a.rate * (area - CONFIG.sliderMin));
}
function addonBundled(id: string, area: number) {
  return Math.round(addonFull(id, area) * (1 - CONFIG.addonOff));
}
function maintPrice(area: number, billing: string) {
  return Math.round((svcPrice("deep-clean", area) ?? 0) * (1 - CONFIG.maintenanceDiscount[billing]));
}
function total(st: St): number | null {
  if (st.area > CONFIG.customAt) return null;
  const s = CONFIG.services.find(x => x.id === st.serviceId);
  if (!s) return null;
  if (s.isMaintenance) return maintPrice(st.area, st.billing);
  let t = svcPrice(st.serviceId, st.area) ?? 0;
  if (s.hasAddons) for (const id of st.addons) t += addonBundled(id, st.area);
  return t;
}
const fmt = (n: number) => "$" + n.toLocaleString("en-AU");

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuoteChat({ isOpen, onClose }: QuoteChatProps) {
  const [st, setSt]             = useState<St>(INIT);
  const [errs, setErrs]               = useState({ name: false, email: false, phone: false, suburb: false });
  const [submitting, setSub]          = useState(false);
  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const scrollRef                     = useRef<HTMLDivElement>(null);

  // Suburb postcode lookup
  const [suburbQuery, setSuburbQuery]     = useState("");
  const [suburbOptions, setSuburbOptions] = useState<string[]>([]);
  const [suburbLoading, setSuburbLoading] = useState(false);
  const [showSuburbDrop, setShowSuburbDrop] = useState(false);
  const suburbRef = useRef<HTMLDivElement>(null);

  const handleSuburbInput = async (val: string) => {
    // Only allow digits for postcode entry; ignore non-numeric
    const digits = val.replace(/\D/g, "").slice(0, 4);
    setSuburbQuery(digits);
    setShowSuburbDrop(false);
    setSuburbOptions([]);
    up({ suburb: "", postcode: digits });
    if (errs.suburb) setErrs(p => ({ ...p, suburb: false }));
    if (digits.length === 4) {
      setSuburbLoading(true);
      try {
        const res = await fetch(`/api/suburb?postcode=${digits}`);
        const json = await res.json() as { suburbs: string[] };
        const list = json.suburbs ?? [];
        if (list.length === 1) {
          // Single match — auto-fill immediately
          setSuburbQuery(list[0]);
          up({ suburb: list[0], postcode: digits });
          setErrs(p => ({ ...p, suburb: false }));
        } else if (list.length > 1) {
          setSuburbOptions(list);
          setShowSuburbDrop(true);
        }
      } catch { /* silent */ }
      finally { setSuburbLoading(false); }
    }
  };

  const selectSuburb = (name: string) => {
    setSuburbQuery(name);
    up({ suburb: name });
    setShowSuburbDrop(false);
    if (errs.suburb) setErrs(p => ({ ...p, suburb: false }));
  };

  const up  = (patch: Partial<St>) => setSt(prev => ({ ...prev, ...patch }));
  const stl = () => setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 60);
  const go  = (step: number) => { up({ step }); stl(); };
  const reset = () => { setSt(INIT); setErrs({ name: false, email: false, phone: false, suburb: false }); setSub(false); setPhotoEntries([]); setSuburbQuery(""); setSuburbOptions([]); setShowSuburbDrop(false); };

  const handlePhotoSelect = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).slice(0, 6 - photoEntries.length);
    if (files.length === 0) return;
    const newEntries: PhotoEntry[] = files.map(f => ({
      id: Math.random().toString(36).slice(2, 10),
      file: f, url: null, uploading: true,
    }));
    setPhotoEntries(prev => [...prev, ...newEntries]);
    await Promise.all(newEntries.map(async entry => {
      try {
        const fd = new FormData();
        fd.append("photo", entry.file);
        const res = await fetch("/api/quote/upload-photo", { method: "POST", body: fd });
        const url = res.ok ? ((await res.json()).url as string) : null;
        setPhotoEntries(prev => prev.map(p => p.id === entry.id ? { ...p, url, uploading: false } : p));
      } catch {
        setPhotoEntries(prev => prev.map(p => p.id === entry.id ? { ...p, uploading: false } : p));
      }
    }));
  };
  const removePhoto = (id: string) => setPhotoEntries(prev => prev.filter(p => p.id !== id));

  if (!isOpen) return null;

  const svc      = CONFIG.services.find(s => s.id === st.serviceId);
  const isCustom = st.area > CONFIG.customAt;
  const ttl      = total(st);
  const sliderPct = ((st.area - CONFIG.sliderMin) / (CONFIG.sliderMax - CONFIG.sliderMin)) * 100;
  const sliderBg  = `linear-gradient(to right,#1A6B3C ${sliderPct}%,#E5E7EB ${sliderPct}%)`;

  const validateAndContinue = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(st.email.trim());
    const e = { name: !st.name.trim(), email: !emailOk, phone: !st.phone.trim(), suburb: !st.suburb.trim() };
    setErrs(e);
    if (!e.name && !e.email && !e.phone && !e.suburb) go(4);
  };

  const handleSubmit = async () => {
    setSub(true);
    const uploadedUrls = photoEntries.filter(p => p.url).map(p => p.url!);

    // Build line items for the PDF
    const quoteLineItems: { description: string; price: string }[] = [];
    if (svc?.isMaintenance) {
      const maintCost = isCustom ? null : maintPrice(st.area, st.billing);
      quoteLineItems.push({
        description: `Scheduled Maintenance Plan (${st.billing === "quarterly" ? "Quarterly · 10% off" : "Prepaid Annual · 15% off"})`,
        price: maintCost ? fmt(maintCost) + "/visit" : "Custom quote",
      });
    } else {
      const basePrice = isCustom ? null : svcPrice(st.serviceId, st.area);
      quoteLineItems.push({ description: svc?.name ?? "", price: basePrice ? fmt(basePrice) : "Custom quote" });
      for (const id of st.addons) {
        const addon = CONFIG.addons.find(a => a.id === id);
        const ap = isCustom ? null : addonBundled(id, st.area);
        quoteLineItems.push({ description: `${addon?.name} (add-on · 40% off)`, price: ap ? fmt(ap) : "Custom quote" });
      }
    }

    const body = {
      service: svc?.name,
      turfSize: st.area + "m²",
      areaM2: st.area,
      billingPeriod: svc?.isMaintenance ? (st.billing === "quarterly" ? "Quarterly (10% off)" : "Prepaid Annual (15% off)") : undefined,
      estimatedTotal: isCustom ? undefined : ttl ?? undefined,
      quoteLineItems,
      name: st.name, email: st.email, phone: st.phone, suburb: st.suburb, postcode: st.postcode || undefined,
      notes: st.notes || undefined,
      photoUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
    };
    try {
      if (CONFIG.webhookUrl) {
        const fd = new FormData();
        fd.append("data", JSON.stringify(body));
        for (const entry of photoEntries) fd.append("photos", entry.file, entry.file.name);
        await fetch(CONFIG.webhookUrl, { method: "POST", body: fd });
      } else {
        await fetch("/api/quote/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    } catch { /* non-critical */ }
    setSub(false);
    go(5);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px]">
        <div className="relative bg-white h-full md:rounded-3xl md:h-[700px] shadow-2xl flex flex-col overflow-hidden">

          {/* ── Header (steps 1–4) ── */}
          {st.step >= 1 && st.step <= 4 && (
            <div className="bg-ink-900 px-5 pt-4 pb-3 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => go(st.step - 1)}
                  aria-label="Go back"
                  className={`w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors ${st.step === 1 ? "invisible pointer-events-none" : ""}`}
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <span className="text-white/60 text-xs font-semibold tracking-wide">Step {st.step} of 4</span>
                <button onClick={onClose} aria-label="Close" className="text-white/50 hover:text-white p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-violet-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(st.step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Scrollable body ── */}
          <div
            ref={scrollRef}
            className={`flex-1 overflow-y-auto ${st.step >= 1 && st.step <= 4 ? "bg-gray-50" : "bg-white"}`}
          >

            {/* ══ STEP 0: Intro ══ */}
            {st.step === 0 && (
              <div className="flex flex-col h-full">
                <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 text-ink-300 hover:text-ink-600 p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <p className="text-violet-600 text-[11px] font-bold tracking-widest uppercase mb-3">TurfCleanPros</p>
                  <h2 className="font-display font-black text-[1.6rem] text-ink-900 leading-tight mb-3">
                    Ready to book<br />your clean?
                  </h2>
                  <p className="text-ink-400 text-sm leading-relaxed max-w-xs">
                    Tap below to get an instant price estimate — pick your service, tell us the area, and we&apos;ll call you to confirm.
                  </p>
                </div>
                <div className="px-5 pb-8 pt-3 border-t border-gray-100 shrink-0">
                  <button
                    onClick={() => go(1)}
                    className="btn-pulse w-full py-4 bg-gradient-to-b from-violet-500 to-violet-700 text-white font-bold rounded-2xl text-base hover:from-violet-600 hover:to-violet-800 active:scale-[0.98] transition-all shadow-violet"
                  >
                    Get a Quote
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 1: Service ══ */}
            {st.step === 1 && (
              <div className="px-4 pt-5 pb-6">
                <h3 className="font-display font-black text-[1.2rem] text-ink-900 mb-1">What service do you need?</h3>
                <p className="text-ink-400 text-xs mb-4">Tap an option — we&apos;ll price it up instantly ⚡</p>
                <div className="flex flex-col gap-2">
                  {CONFIG.services.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => { up({ serviceId: s.id, addons: [] }); go(2); }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left active:scale-[0.98] transition-all group ${
                        i === 0
                          ? "bg-violet-50 border-2 border-violet-400 shadow-violet ring-2 ring-violet-400/20 hover:border-violet-500 hover:shadow-[0_6px_28px_0_rgba(26,107,60,0.45)]"
                          : "bg-white border border-gray-200 shadow-sm hover:border-violet-400 hover:bg-violet-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg transition-colors ${
                        i === 0
                          ? "bg-violet-600 border border-violet-700 group-hover:bg-violet-700"
                          : "bg-violet-50 border border-violet-100 group-hover:bg-violet-100"
                      }`}>
                        <span className={i === 0 ? "grayscale-0 brightness-200" : ""}>{s.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink-900 text-sm leading-tight">{s.name}</p>
                          {i === 0 && (
                            <span className="shrink-0 text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-ink-400 text-[11px] mt-0.5 leading-tight">{s.sub}</p>
                      </div>
                      <span className={`font-bold text-xs whitespace-nowrap ${i === 0 ? "text-violet-600" : "text-violet-600"}`}>{s.from}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ══ STEP 2: Area + Pricing ══ */}
            {st.step === 2 && svc && (
              <div className="px-4 pt-5 pb-4 space-y-4">
                <div>
                  <h3 className="font-display font-black text-[1.2rem] text-ink-900 mb-1">How big is the area?</h3>
                  <p className="text-ink-400 text-xs">{svc.name}</p>
                </div>

                {/* Area card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
                  <div className="text-center mb-5">
                    <span className="font-display font-black text-5xl text-violet-600">{st.area}</span>
                    <span className="font-bold text-ink-400 text-lg ml-1.5">m²</span>
                  </div>
                  <input
                    type="range"
                    min={CONFIG.sliderMin}
                    max={CONFIG.sliderMax}
                    step={CONFIG.sliderStep}
                    value={st.area}
                    onChange={e => up({ area: +e.target.value })}
                    aria-label="Area in square metres"
                    className="wizard-slider w-full h-2 rounded-full outline-none cursor-pointer appearance-none"
                    style={{ background: sliderBg }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[11px] text-ink-300 font-medium">25m² min</span>
                    <span className="text-[11px] text-ink-300 font-medium">200m²</span>
                  </div>
                </div>

                {/* Maintenance: billing toggle */}
                {svc.isMaintenance && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 mb-2">Billing</p>
                    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                      {(["quarterly", "annual"] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => up({ billing: p })}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${st.billing === p ? "bg-white text-violet-700 shadow-sm" : "text-ink-400 hover:text-ink-600"}`}
                        >
                          {p === "quarterly" ? "Quarterly · 10% off" : "Prepaid annual · 15% off"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deep clean: add-ons */}
                {svc.hasAddons && (
                  <div>
                    <p className="text-xs font-semibold text-ink-500 mb-2">
                      Add extra treatments — 40% off when bundled with your Deep Clean
                    </p>
                    <div className="flex flex-col gap-2">
                      {CONFIG.addons.map(addon => {
                        const sel  = st.addons.includes(addon.id);
                        const full = addonFull(addon.id, st.area);
                        const bund = addonBundled(addon.id, st.area);
                        return (
                          <button
                            key={addon.id}
                            onClick={() => {
                              const next = sel
                                ? st.addons.filter(id => id !== addon.id)
                                : [...st.addons, addon.id];
                              up({ addons: next });
                            }}
                            aria-pressed={sel}
                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${sel ? "bg-violet-50 border-violet-400" : "bg-white border-gray-200 hover:border-violet-300"}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-colors ${sel ? "bg-violet-600" : "bg-violet-50 border border-violet-100"}`}>
                              {sel ? <span className="text-white font-bold text-sm">✓</span> : addon.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-ink-900 text-[13px] leading-tight">{addon.name}</p>
                              <p className="text-ink-400 text-[11px] mt-0.5">{addon.sub}</p>
                            </div>
                            {isCustom ? (
                              <span className="text-violet-600 font-bold text-xs shrink-0">Custom</span>
                            ) : (
                              <div className="text-right shrink-0">
                                <p className="text-ink-300 text-[11px] line-through">{fmt(full)}</p>
                                <p className="text-violet-600 font-bold text-[13px]">{fmt(bund)}</p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ══ STEP 3: Details ══ */}
            {st.step === 3 && (
              <div className="px-4 pt-5 pb-4">
                <h3 className="font-display font-black text-[1.2rem] text-ink-900 mb-1">Your details</h3>
                <p className="text-ink-400 text-xs mb-4">So we can send your estimate and call to confirm.</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <input
                      type="text"
                      value={st.name}
                      onChange={e => { up({ name: e.target.value }); if (errs.name) setErrs(p => ({ ...p, name: false })); }}
                      placeholder="Name *"
                      autoComplete="name"
                      className={`w-full bg-white border rounded-2xl px-4 py-3.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all ${errs.name ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
                    />
                    {errs.name && <p className="text-red-500 text-xs mt-1 ml-1">Enter your name</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      value={st.email}
                      onChange={e => { up({ email: e.target.value }); if (errs.email) setErrs(p => ({ ...p, email: false })); }}
                      placeholder="Email * (we'll send your quote PDF here)"
                      autoComplete="email"
                      className={`w-full bg-white border rounded-2xl px-4 py-3.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all ${errs.email ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
                    />
                    {errs.email && <p className="text-red-500 text-xs mt-1 ml-1">Enter a valid email address</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={st.phone}
                      onChange={e => { up({ phone: e.target.value }); if (errs.phone) setErrs(p => ({ ...p, phone: false })); }}
                      placeholder="Phone * (04XX XXX XXX)"
                      autoComplete="tel"
                      className={`w-full bg-white border rounded-2xl px-4 py-3.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all ${errs.phone ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
                    />
                    {errs.phone && <p className="text-red-500 text-xs mt-1 ml-1">Enter a phone number</p>}
                  </div>
                  <div className="relative" ref={suburbRef}>
                    <div className="relative">
                      {st.suburb ? (
                        /* Suburb selected — show pill with suburb name + change button */
                        <div className={`w-full flex items-center justify-between bg-white border-2 border-violet-400 rounded-2xl px-4 py-3.5 ${errs.suburb ? "border-red-400" : ""}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                            <span className="text-sm font-semibold text-ink-900 truncate">{st.suburb}</span>
                            {st.postcode && <span className="text-xs text-ink-300 shrink-0">{st.postcode}</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => { setSuburbQuery(""); up({ suburb: "", postcode: "" }); setSuburbOptions([]); }}
                            className="text-ink-300 hover:text-ink-600 text-xs font-medium transition-colors shrink-0 ml-2"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        /* Postcode entry */
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="\d*"
                          maxLength={4}
                          value={suburbQuery}
                          onChange={e => handleSuburbInput(e.target.value)}
                          onBlur={() => setTimeout(() => setShowSuburbDrop(false), 150)}
                          placeholder="Postcode * (e.g. 3029)"
                          autoComplete="postal-code"
                          className={`w-full bg-white border rounded-2xl px-4 py-3.5 pr-10 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all ${errs.suburb ? "border-red-400" : "border-gray-200 focus:border-violet-400"}`}
                        />
                      )}
                      {suburbLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    {showSuburbDrop && suburbOptions.length > 1 && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-card-lg overflow-hidden">
                        <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold text-ink-300 uppercase tracking-wide">
                          Select your suburb — {st.postcode}
                        </p>
                        {suburbOptions.map(s => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={() => selectSuburb(s)}
                            className="w-full text-left px-4 py-3 text-sm text-ink-900 hover:bg-violet-50 hover:text-violet-700 transition-colors border-t border-gray-100 first:border-0 flex items-center justify-between"
                          >
                            <span>{s}</span>
                            <span className="text-ink-300 text-xs">{st.postcode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {errs.suburb && <p className="text-red-500 text-xs mt-1 ml-1">Enter your postcode to find your suburb</p>}
                  </div>
                  <div>
                    {photoEntries.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {photoEntries.map(entry => (
                          <div key={entry.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            {entry.uploading ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                              </div>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={URL.createObjectURL(entry.file)} alt="" className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(entry.id)}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                            {entry.url && (
                              <div className="absolute bottom-1 left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[8px] font-bold leading-none">✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {photoEntries.length < 6 && (
                      <label className="flex items-center gap-3 px-4 py-3.5 bg-white border border-dashed border-gray-200 hover:border-violet-300 rounded-2xl cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4 text-violet-500" />
                        </div>
                        <span className="text-sm text-ink-400 group-hover:text-ink-600 transition-colors">
                          {photoEntries.length === 0 ? "Upload photos (optional)" : `Add another (${photoEntries.length}/6)`}
                        </span>
                        <input
                          type="file" accept="image/*" multiple className="hidden"
                          onChange={e => {
                            if (e.target.files) handlePhotoSelect(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <textarea
                    value={st.notes}
                    onChange={e => up({ notes: e.target.value })}
                    placeholder="Notes (optional) — gate code, dog on property, access notes…"
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* ══ STEP 4: Review ══ */}
            {st.step === 4 && svc && (
              <div className="px-4 pt-5 pb-4 space-y-4">
                <div>
                  <h3 className="font-display font-black text-[1.2rem] text-ink-900 mb-1">Review your quote</h3>
                  <p className="text-ink-400 text-xs">Check the details, then send it through.</p>
                </div>

                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                  {[
                    { k: "Service",  v: svc.name },
                    { k: "Area",     v: st.area + " m²" },
                    ...(!svc.isMaintenance ? [
                      { k: svc.name, v: isCustom ? "Custom quote" : fmt(svcPrice(svc.id, st.area) ?? 0), green: !isCustom },
                      ...st.addons.map(id => {
                        const a = CONFIG.addons.find(x => x.id === id)!;
                        return { k: `+ ${a.name} (add-on, 40% off)`, v: isCustom ? "Custom" : fmt(addonBundled(id, st.area)), green: !isCustom };
                      }),
                    ] : [
                      { k: "Billing",        v: st.billing === "quarterly" ? "Quarterly · 10% off" : "Prepaid annual · 15% off" },
                      { k: "Price per visit", v: isCustom ? "Custom quote" : fmt(maintPrice(st.area, st.billing)), green: !isCustom },
                    ]),
                    { k: "Name",   v: st.name },
                    { k: "Email",  v: st.email },
                    { k: "Phone",  v: st.phone },
                    { k: "Suburb", v: [st.suburb, st.postcode].filter(Boolean).join(", ") },
                    ...(st.notes ? [{ k: "Notes", v: st.notes }] : []),
                  ].map(({ k, v, green }, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
                      <span className="text-ink-400 text-xs font-medium shrink-0 pt-0.5">{k}</span>
                      <span className={`text-sm font-semibold text-right ${green ? "text-violet-600" : "text-ink-900"}`}>{v}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ══ STEP 5: Success ══ */}
            {st.step === 5 && (
              <div className="flex flex-col h-full">
                <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 text-ink-300 hover:text-ink-600 p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-violet-600" />
                  </div>
                  <h3 className="font-display font-black text-xl text-ink-900 mb-2">
                    Thanks{st.name ? `, ${st.name.split(" ")[0]}` : ""}!
                  </h3>
                  <p className="text-ink-400 text-sm leading-relaxed max-w-xs">
                    We&apos;ve received your request and sent your quote PDF to <strong className="text-ink-700">{st.email}</strong>. We&apos;ll call you shortly to confirm.
                  </p>
                  {st.phone && (
                    <div className="mt-5 bg-violet-50 border border-violet-100 rounded-2xl px-6 py-3 text-center">
                      <p className="text-violet-500 text-xs">We&apos;ll call you on</p>
                      <p className="font-display font-black text-violet-700 text-xl mt-0.5">{st.phone}</p>
                      <p className="text-violet-400 text-[11px] mt-1">within 24 hours · usually much sooner</p>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-8 pt-3 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                  <a
                    href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4" /> Call Now: {CONFIG.phone}
                  </a>
                  <button
                    onClick={() => { reset(); go(0); }}
                    className="w-full py-3 text-ink-400 text-sm font-medium hover:text-ink-600 transition-colors"
                  >
                    Start a new quote
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ── Pinned footer CTA (steps 2–4 only) ── */}
          {st.step >= 2 && st.step <= 4 && (
            <div className="shrink-0 bg-white border-t border-gray-100">
              {/* Price bar — steps 2 and 4 only */}
              {(st.step === 2 || st.step === 4) && svc && (
                <div className="bg-ink-900 px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest leading-snug">
                      {st.step === 2
                        ? isCustom ? "Over 100m²"
                          : svc.isMaintenance ? "Price per visit"
                          : st.addons.length > 0 ? "Total (clean + add-ons)"
                          : "Estimated price"
                        : svc.isMaintenance ? "Estimated price per visit" : "Estimated total"}
                    </p>
                    {isCustom && st.step === 2 && <p className="text-white/30 text-[10px] mt-0.5">Quoted individually</p>}
                  </div>
                  <p className="font-display font-black text-white text-2xl">
                    {isCustom ? "Custom" : ttl ? fmt(ttl) : "—"}
                  </p>
                </div>
              )}
              <div className="px-5 pb-6 pt-3">
                <button
                  onClick={
                    st.step === 2 ? () => go(3) :
                    st.step === 3 ? validateAndContinue :
                    handleSubmit
                  }
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-b from-violet-500 to-violet-700 text-white font-bold rounded-2xl text-sm hover:from-violet-600 hover:to-violet-800 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-violet"
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    : st.step === 4 ? "Send Quote Request" : "Continue"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
