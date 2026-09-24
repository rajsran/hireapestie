"use client";

declare const fbq: ((...args: unknown[]) => void) | undefined;

import { useState, useEffect, useRef } from "react";
import {
  X, Home, Building2, ShieldCheck,
  ChevronRight, ChevronLeft, Phone, CheckCircle2, Loader2,
  MessageCircle, User, BedDouble,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "service" | "levels" | "panels" | "rooftype" | "bedrooms" | "contact" | "quote";

interface Answers {
  service?: string;
  levels?: string;
  panels?: string;
  roofType?: string;
  bedrooms?: string;
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  suburb?: string;
}

export interface QuoteChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Step Options ─────────────────────────────────────────────────────────────
const SERVICE_OPTIONS = [
  { label: "Residential Turf Cleaning", Icon: Home,        desc: "Home turf & downpipe clean" },
  { label: "Commercial Turf Cleaning",  Icon: Building2,   desc: "Offices, warehouses & strata" },
  { label: "Bird Proofing Mesh",          Icon: ShieldCheck, desc: "Stop birds nesting in turfs" },
];

const LEVELS_OPTIONS = [
  { label: "1 level",  Icon: Home,      desc: "Single storey property" },
  { label: "2 levels", Icon: Building2, desc: "Double storey property" },
];

const PANELS_OPTIONS = [
  { label: "15 panels", low: 450,  high: 600,  desc: "Covers approx. 15 turf panels" },
  { label: "30 panels", low: 900, high: 1200, desc: "Covers approx. 30 turf panels" },
];

const ROOFTYPE_OPTIONS = [
  { label: "Tile",              desc: "Terracotta or concrete tiles" },
  { label: "Colorbond / Metal", desc: "Steel or metal sheeting" },
  { label: "Wood Shingles",     desc: "Timber shingle roof" },
  { label: "Asbestos",          desc: "Older fibro / asbestos sheeting" },
  { label: "Other",             desc: "Not sure or mixed material" },
];

const BEDROOMS_OPTIONS = [
  { label: "1–2 bedrooms", Icon: BedDouble, desc: "Small to medium home" },
  { label: "3–4 bedrooms", Icon: BedDouble, desc: "Medium to large home" },
  { label: "5+ bedrooms",  Icon: BedDouble, desc: "Large home or multi-dwelling" },
];

const MESH_STEPS:    Step[] = ["contact", "service", "panels", "quote"];
const DEFAULT_STEPS: Step[] = ["contact", "service", "levels", "rooftype", "bedrooms", "quote"];

const PREV_STEP: Partial<Record<Step, Step>> = {
  service:  "contact",
  levels:   "service",
  panels:   "service",
  rooftype: "levels",
  bedrooms: "rooftype",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuoteChat({ isOpen, onClose }: QuoteChatProps) {
  const [step, setStep]       = useState<Step>("contact");
  const [answers, setAnswers] = useState<Answers>({});
  const [contactName,     setContactName]     = useState("");
  const [contactPhone,    setContactPhone]    = useState("");
  const [contactEmail,    setContactEmail]    = useState("");
  const [contactPostcode, setContactPostcode] = useState("");
  const [contactSuburb,   setContactSuburb]   = useState("");
  const [suburbs,         setSuburbs]         = useState<string[]>([]);
  const [suburbLoading,   setSuburbLoading]   = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [quoteEstimate, setQuoteEstimate] = useState<{ low: number; high: number; note?: string } | null>(null);
  const [submittedRef]       = useState({ value: false });
  const [manualPanels, setManualPanels] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep("contact");
      setAnswers({});
      setContactName("");
      setContactPhone("");
      setContactEmail("");
      setContactPostcode("");
      setContactSuburb("");
      setSuburbs([]);
      setIsLoading(false);
      setQuoteEstimate(null);
      setManualPanels("");
      submittedRef.value = false;
    }
  }, [isOpen]);

  // Fetch suburbs when postcode hits 4 digits
  useEffect(() => {
    if (contactPostcode.length !== 4) {
      setSuburbs([]);
      setContactSuburb("");
      return;
    }
    let cancelled = false;
    setSuburbLoading(true);
    fetch(`/api/suburb?postcode=${contactPostcode}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const list: string[] = data.suburbs ?? [];
        setSuburbs(list);
        if (list.length === 1) setContactSuburb(list[0]);
      })
      .catch(() => { if (!cancelled) setSuburbs([]); })
      .finally(() => { if (!cancelled) setSuburbLoading(false); });
    return () => { cancelled = true; };
  }, [contactPostcode]);

  const scrollTop = () =>
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 60);

  const advance = (key: keyof Answers, value: string, nextStep: Step) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep(nextStep);
    scrollTop();
  };

  const goBack = () => {
    const prev = PREV_STEP[step];
    if (prev) { setStep(prev); scrollTop(); }
  };

  const submitContact = () => {
    setAnswers((prev) => ({
      ...prev,
      name:     contactName.trim()     || "Not provided",
      phone:    contactPhone.trim()    || "Not provided",
      email:    contactEmail.trim()    || "Not provided",
      postcode: contactPostcode.trim() || undefined,
      suburb:   contactSuburb.trim()   || undefined,
    }));
    setStep("service");
    scrollTop();

    // Notify admin immediately — fire and forget
    fetch("/api/quote/early-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:     contactName.trim()     || "Not provided",
        phone:    contactPhone.trim()    || "Not provided",
        email:    contactEmail.trim()    || undefined,
        postcode: contactPostcode.trim() || undefined,
        suburb:   contactSuburb.trim()   || undefined,
      }),
    }).catch(() => {});
  };

  const finishQuote = async (final: Answers) => {
    setStep("quote");
    setIsLoading(true);
    try {
      const res = await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final),
      });
      const data = await res.json();
      if (data.estimate) setQuoteEstimate(data.estimate);
      submittedRef.value = true;
      if (typeof fbq !== "undefined") fbq("track", "Lead");
    } catch {
      // non-critical
    } finally {
      setIsLoading(false);
    }
  };

  const STEP_ORDER = answers.service === "Bird Proofing Mesh" ? MESH_STEPS : DEFAULT_STEPS;
  const progress   = Math.round((STEP_ORDER.indexOf(step) / (STEP_ORDER.length - 1)) * 100);
  const firstName = contactName.split(" ")[0] || answers.name?.split(" ")[0] || "";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel — full screen on mobile, centered card on desktop */}
      <div className="fixed inset-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px]">
        <div
          className="bg-white h-full md:rounded-3xl md:h-[680px] shadow-2xl flex flex-col overflow-hidden"
        >

          {/* ── Header ── */}
          <div className="bg-ink-900 px-5 pt-4 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Back button — shown on all steps except first and last */}
                {step !== "service" && step !== "quote" && (
                  <button
                    onClick={goBack}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                )}
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Get Quotes in Minutes</p>
                  <p className="text-white/50 text-[11px]">Turf Clean Pros · All Melbourne</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            {step !== "quote" && (
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-violet-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* ── Scrollable body ── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-2.5">

            {/* ══ SERVICE ══ */}
            {step === "service" && (
              <StepShell
                q="What service do you need?"
                sub="Tap an option — we'll give you a price in seconds ⚡"
              >
                {SERVICE_OPTIONS.map(({ label, Icon, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    icon={<Icon className="w-5 h-5 text-violet-600" />}
                    onClick={() => advance("service", label, label === "Bird Proofing Mesh" ? "panels" : "levels")}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ LEVELS ══ */}
            {step === "levels" && (
              <StepShell
                q="How many levels is your property?"
                sub="This helps us estimate access and time required"
              >
                {LEVELS_OPTIONS.map(({ label, Icon, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    icon={<Icon className="w-5 h-5 text-violet-600" />}
                    onClick={() => advance("levels", label, "rooftype")}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ PANELS ══ */}
            {step === "panels" && (
              <StepShell
                q="How many panels do you need?"
                sub="Select your panel count — we'll give you an exact price"
              >
                {PANELS_OPTIONS.map(({ label, low, high, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={`$${low.toLocaleString()} – $${high.toLocaleString()} · ${desc}`}
                    onClick={() => {
                      const final = { ...answers, panels: label };
                      setAnswers(final);
                      finishQuote(final);
                    }}
                  />
                ))}
                {/* Manual panel count entry */}
                <div className="mt-2 rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
                  <p className="text-sm font-medium text-gray-700">Enter your own panel count</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 20"
                      value={manualPanels}
                      onChange={e => setManualPanels(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">panels</span>
                  </div>
                  {manualPanels && Number(manualPanels) > 0 && (
                    <p className="text-xs text-gray-500">
                      Estimated price:{" "}
                      <span className="font-semibold text-gray-800">
                        ${(Number(manualPanels) * 30).toLocaleString()} – ${(Number(manualPanels) * 40).toLocaleString()}
                      </span>
                      <span className="ml-1">($30–$40 per panel)</span>
                    </p>
                  )}
                  <button
                    disabled={!manualPanels || Number(manualPanels) <= 0}
                    onClick={() => {
                      const count = Math.round(Number(manualPanels));
                      const label = `${count} panel${count === 1 ? "" : "s"} (custom)`;
                      const final = { ...answers, panels: label };
                      setAnswers(final);
                      finishQuote(final);
                    }}
                    className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white disabled:opacity-40 hover:bg-blue-700 transition-colors"
                  >
                    {manualPanels && Number(manualPanels) > 0
                      ? `Confirm — $${(Number(manualPanels) * 30).toLocaleString()}–$${(Number(manualPanels) * 40).toLocaleString()}`
                      : "Confirm"}
                  </button>
                </div>
              </StepShell>
            )}

            {/* ══ ROOF TYPE ══ */}
            {step === "rooftype" && (
              <StepShell
                q="What is your roof type?"
                sub="Different materials need different cleaning methods"
              >
                {ROOFTYPE_OPTIONS.map(({ label, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    onClick={() => advance("roofType", label, "bedrooms")}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ BEDROOMS ══ */}
            {step === "bedrooms" && (
              <StepShell
                q="How many bedrooms does your home have?"
                sub="Gives us a rough guide to your property size"
              >
                {BEDROOMS_OPTIONS.map(({ label, Icon, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    icon={<Icon className="w-5 h-5 text-violet-600" />}
                    onClick={() => {
                      const final = { ...answers, bedrooms: label };
                      setAnswers(final);
                      finishQuote(final);
                    }}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ CONTACT ══ */}
            {step === "contact" && (
              <StepShell
                q="Almost there! Your contact details"
                sub="So we know who to follow up with"
                icon={<User className="w-4 h-4 text-violet-600" />}
              >
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone number (e.g. 0412 345 678)"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={contactPostcode}
                      onChange={(e) => {
                        setContactSuburb("");
                        setContactPostcode(e.target.value.replace(/\D/g, "").slice(0, 4));
                      }}
                      placeholder="Postcode (e.g. 3000)"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                    {suburbLoading && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400 animate-spin" />
                    )}
                  </div>
                  {suburbs.length > 1 && (
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[11px] text-ink-400 px-1">Select your suburb</p>
                      <div className="flex flex-wrap gap-2">
                        {suburbs.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setContactSuburb(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              contactSuburb === s
                                ? "bg-violet-600 text-white border-violet-600"
                                : "bg-white text-ink-700 border-gray-200 hover:border-violet-400"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {suburbs.length === 1 && (
                    <p className="text-xs text-violet-600 font-semibold px-1">
                      📍 {suburbs[0]}
                    </p>
                  )}
                  <button
                    onClick={submitContact}
                    disabled={!contactName.trim() || !contactPhone.trim()}
                    className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
                  >
                    Get My Quote <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </StepShell>
            )}

            {/* ══ QUOTE RESULT ══ */}
            {step === "quote" && (
              <div className="flex flex-col gap-3 pb-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 gap-6">
                    {/* Animated rings */}
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-24 h-24 rounded-full bg-violet-100 animate-ping opacity-40" />
                      <span className="absolute w-16 h-16 rounded-full bg-violet-200 animate-ping opacity-50" style={{ animationDelay: "0.15s" }} />
                      <div className="relative w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                        <Loader2 className="w-7 h-7 text-white animate-spin" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center">
                      <p className="font-bold text-ink-900 text-lg mb-1">Preparing your quote…</p>
                      <p className="text-ink-400 text-sm">This only takes a moment</p>
                    </div>

                    {/* Animated steps */}
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                      {[
                        { label: "Reviewing your property details", delay: "0s" },
                        { label: "Matching your service requirements", delay: "0.4s" },
                        { label: "Preparing your personalised quote", delay: "0.8s" },
                      ].map(({ label, delay }) => (
                        <div key={label} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full bg-violet-500 animate-pulse shrink-0"
                            style={{ animationDelay: delay }}
                          />
                          <p className="text-ink-500 text-sm">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5 text-center text-white">
                      <CheckCircle2 className="w-10 h-10 text-violet-300 mx-auto mb-2" />
                      <p className="font-black text-lg leading-tight">
                        {firstName ? `Thanks, ${firstName}!` : "Thanks!"}
                      </p>
                      <p className="text-violet-300 text-xs mt-1">We&apos;ve received your enquiry</p>
                    </div>

                    {/* Price estimate */}
                    {(() => {
                      const panelMatch = answers.panels?.match(/^(\d+)/);
                      const panelCount = panelMatch ? Number(panelMatch[1]) : null;
                      if (panelCount) {
                        const low = panelCount * 30;
                        const high = panelCount * 40;
                        return (
                          <div className="bg-ink-900 rounded-2xl p-5 text-center">
                            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Price Estimate</p>
                            <p className="text-white font-black text-3xl">${low.toLocaleString()} – ${high.toLocaleString()}</p>
                            <p className="text-white/40 text-xs mt-1">
                              {panelCount} panel{panelCount === 1 ? "" : "s"} · $30–$40 per panel
                            </p>
                          </div>
                        );
                      }
                      if (quoteEstimate) {
                        return (
                          <div className="bg-ink-900 rounded-2xl p-5 text-center">
                            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Starting Price</p>
                            <p className="text-white font-black text-3xl">
                              {quoteEstimate.low === quoteEstimate.high
                                ? `$${quoteEstimate.low.toLocaleString()}`
                                : `$${quoteEstimate.low.toLocaleString()} – $${quoteEstimate.high.toLocaleString()}`}
                            </p>
                            {quoteEstimate.note && <p className="text-white/40 text-xs mt-1">{quoteEstimate.note}</p>}
                            <p className="text-white/30 text-[10px] mt-2">Final price confirmed on-site</p>
                          </div>
                        );
                      }
                      if (answers.service === "Commercial Turf Cleaning") {
                        return (
                          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 text-center">
                            <p className="text-violet-700 font-bold text-sm mb-1">Pricing discussed over the phone</p>
                            <p className="text-violet-500 text-xs leading-relaxed">Commercial jobs vary in size — our team will call you shortly to discuss pricing and arrange a free on-site quote.</p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Summary card */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                      <p className="text-ink-400 text-[11px] uppercase tracking-widest font-semibold mb-1">Your selections</p>
                      {[
                        { label: "Service",   value: answers.service },
                        { label: "Panels",    value: answers.panels },
                        { label: "Levels",    value: answers.levels },
                        { label: "Roof type", value: answers.roofType },
                        { label: "Bedrooms",  value: answers.bedrooms },
                        { label: "Postcode",  value: answers.postcode ? `${answers.postcode}${answers.suburb ? ` · ${answers.suburb}` : ""}` : undefined },
                      ].map(({ label, value }) => value && (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-ink-400">{label}</span>
                          <span className="font-semibold text-ink-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-ink-900 rounded-2xl p-5 text-center">
                      <p className="text-white/50 text-xs mb-1 uppercase tracking-widest">Next Step</p>
                      <p className="text-white font-bold text-lg">Free On-Site Inspection</p>
                      <p className="text-white/40 text-xs mt-2">We&apos;ll visit, measure and give you a fixed accurate quote — no obligation.</p>
                    </div>

                    {answers.phone && answers.phone !== "Not provided" && (
                      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
                        <p className="text-violet-700 text-sm font-semibold">
                          We&apos;ll call{firstName ? ` ${firstName}` : " you"} on
                        </p>
                        <p className="text-violet-900 font-black text-xl mt-0.5">{answers.phone}</p>
                        <p className="text-violet-500 text-xs mt-1">within 24 hours · usually much sooner</p>
                      </div>
                    )}

                    <a
                      href="tel:0474226785"
                      className="flex items-center justify-center gap-2.5 w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now: 0474 226 785
                    </a>

                    <button
                      onClick={() => {
                        setStep("contact");
                        setAnswers({});
                        setContactName("");
                        setContactPhone("");
                        setContactEmail("");
                        setContactPostcode("");
                        setContactSuburb("");
                        setSuburbs([]);
                        setIsLoading(false);
                        setQuoteEstimate(null);
                        submittedRef.value = false;
                        scrollTop();
                      }}
                      className="w-full py-3 border border-gray-200 text-ink-500 text-sm font-medium rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Start a new quote
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepShell({
  q, sub, icon, children,
}: {
  q: string; sub?: string; icon?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mb-0.5">
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center mb-2">
            {icon}
          </div>
        )}
        <h3 className="font-bold text-ink-900 text-[1rem] leading-snug">{q}</h3>
        {sub && <p className="text-ink-400 text-xs mt-1 leading-relaxed">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function OptionBtn({
  label, desc, icon, onClick,
}: {
  label: string; desc?: string; icon?: React.ReactNode; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-left hover:border-violet-400 hover:bg-violet-50 active:scale-[0.98] transition-all shadow-sm group"
    >
      {icon && (
        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900 text-sm leading-tight">{label}</p>
        {desc && <p className="text-ink-400 text-[11px] mt-0.5 leading-tight">{desc}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-ink-300 shrink-0 group-hover:text-violet-500 transition-colors" />
    </button>
  );
}
