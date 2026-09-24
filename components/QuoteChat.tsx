"use client";

declare const fbq: ((...args: unknown[]) => void) | undefined;

import { useState, useEffect, useRef } from "react";
import {
  X, Sparkles, Heart, Leaf, Wind, CalendarCheck,
  ChevronRight, ChevronLeft, Phone, CheckCircle2, Loader2,
  MessageCircle, User, Maximize2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "contact" | "service" | "turfsize" | "addontype" | "quote";

interface Answers {
  service?: string;
  turfSize?: string;
  serviceDetail?: string;
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
  { label: "Synthetic Turf Deep Clean",    Icon: Sparkles,      desc: "Deep clean from $150 · all turf types" },
  { label: "Pet Odour & Stain Treatment",  Icon: Heart,         desc: "Enzyme treatment · $60–160" },
  { label: "Moss & Algae Removal",         Icon: Leaf,          desc: "Bio-safe removal · $80–150" },
  { label: "Debris & Leaf Clearing",       Icon: Wind,          desc: "Quick surface clear · $60–100" },
  { label: "Scheduled Maintenance Plans",  Icon: CalendarCheck, desc: "10–15% off · quarterly visits" },
];

const TURF_SIZE_OPTIONS = [
  { label: "Up to 25m²",  low: 150, high: 150, desc: "Small yard or balcony turf" },
  { label: "25–50m²",     low: 300, high: 400, desc: "Medium backyard turf" },
  { label: "50–100m²",    low: 500, high: 800, desc: "Large backyard or side area" },
  { label: "100m²+",      low: 0,   high: 0,   desc: "Large commercial or estate — custom quote" },
];

const ADDON_OPTIONS = [
  { label: "Add-on",    desc: "Adding to a Turf Deep Clean booking" },
  { label: "Standalone", desc: "As a separate standalone service" },
];

function getNextStep(service: string): Step {
  if (service === "Synthetic Turf Deep Clean") return "turfsize";
  if (service === "Pet Odour & Stain Treatment") return "addontype";
  if (service === "Moss & Algae Removal") return "addontype";
  return "quote";
}

const PREV_STEP: Partial<Record<Step, Step>> = {
  service:   "contact",
  turfsize:  "service",
  addontype: "service",
};

// ─── Pricing helpers ──────────────────────────────────────────────────────────
function getAddonPricing(service: string, detail: string): { low: number; high: number } {
  if (service === "Pet Odour & Stain Treatment") {
    return detail === "Add-on" ? { low: 60, high: 100 } : { low: 120, high: 160 };
  }
  if (service === "Moss & Algae Removal") {
    return detail === "Add-on" ? { low: 80, high: 120 } : { low: 100, high: 150 };
  }
  return { low: 60, high: 100 };
}

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
  const [isLoading,       setIsLoading]       = useState(false);
  const [quoteEstimate,   setQuoteEstimate]   = useState<{ low: number; high: number; note?: string } | null>(null);
  const [submittedRef]                        = useState({ value: false });

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
      submittedRef.value = false;
    }
  }, [isOpen, submittedRef]);

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

  const advance = (update: Partial<Answers>, nextStep: Step) => {
    setAnswers(prev => ({ ...prev, ...update }));
    setStep(nextStep);
    scrollTop();
  };

  const goBack = () => {
    const prev = PREV_STEP[step];
    if (prev) { setStep(prev); scrollTop(); }
  };

  const submitContact = () => {
    const contactData = {
      name:     contactName.trim()     || "Not provided",
      phone:    contactPhone.trim()    || "Not provided",
      email:    contactEmail.trim()    || undefined,
      postcode: contactPostcode.trim() || undefined,
      suburb:   contactSuburb.trim()   || undefined,
    };
    setAnswers(prev => ({ ...prev, ...contactData }));
    setStep("service");
    scrollTop();

    fetch("/api/quote/early-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
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

  const STEP_ORDER: Step[] = ["contact", "service", "turfsize", "quote"];
  const currentIndex = STEP_ORDER.indexOf(step);
  const progress = Math.round((currentIndex / (STEP_ORDER.length - 1)) * 100);
  const firstName = contactName.split(" ")[0] || answers.name?.split(" ")[0] || "";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px]">
        <div className="bg-white h-full md:rounded-3xl md:h-[680px] shadow-2xl flex flex-col overflow-hidden">

          {/* ── Header ── */}
          <div className="bg-ink-900 px-5 pt-4 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
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
                  <p className="text-white font-bold text-sm leading-tight">Get a Quote in Minutes</p>
                  <p className="text-white/50 text-[11px]">Turf Clean Pros · All Melbourne</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white p-1 transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

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

            {/* ══ CONTACT ══ */}
            {step === "contact" && (
              <StepShell
                q="Let's get started!"
                sub="Enter your details and we'll give you a price in seconds"
                icon={<User className="w-4 h-4 text-violet-600" />}
              >
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="Phone number (e.g. 0412 345 678)"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-ink-900 placeholder-ink-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={contactPostcode}
                      onChange={e => {
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
                    <p className="text-xs text-violet-600 font-semibold px-1">📍 {suburbs[0]}</p>
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

            {/* ══ SERVICE ══ */}
            {step === "service" && (
              <StepShell
                q="What service do you need?"
                sub="Tap an option — we'll price it up instantly ⚡"
              >
                {SERVICE_OPTIONS.map(({ label, Icon, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    icon={<Icon className="w-5 h-5 text-violet-600" />}
                    onClick={() => {
                      const next = getNextStep(label);
                      if (next === "quote") {
                        const final = { ...answers, service: label };
                        setAnswers(final);
                        finishQuote(final);
                      } else {
                        advance({ service: label }, next);
                      }
                    }}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ TURF SIZE ══ */}
            {step === "turfsize" && (
              <StepShell
                q="What's the approximate size of your turf?"
                sub="Pick the closest range — we'll confirm the exact m² on-site"
                icon={<Maximize2 className="w-4 h-4 text-violet-600" />}
              >
                {TURF_SIZE_OPTIONS.map(({ label, low, high, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={
                      label === "100m²+"
                        ? desc
                        : `$${low === high ? low : `${low}–${high}`} · ${desc}`
                    }
                    onClick={() => {
                      const final = { ...answers, turfSize: label };
                      setAnswers(final);
                      finishQuote(final);
                    }}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ ADD-ON TYPE ══ */}
            {step === "addontype" && (
              <StepShell
                q="Will this be an add-on or standalone?"
                sub="Add-ons are discounted when booked with a deep clean"
              >
                {ADDON_OPTIONS.map(({ label, desc }) => (
                  <OptionBtn
                    key={label}
                    label={label}
                    desc={desc}
                    onClick={() => {
                      const final = { ...answers, serviceDetail: label };
                      setAnswers(final);
                      finishQuote(final);
                    }}
                  />
                ))}
              </StepShell>
            )}

            {/* ══ QUOTE RESULT ══ */}
            {step === "quote" && (
              <div className="flex flex-col gap-3 pb-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 gap-6">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-24 h-24 rounded-full bg-violet-100 animate-ping opacity-40" />
                      <span className="absolute w-16 h-16 rounded-full bg-violet-200 animate-ping opacity-50" style={{ animationDelay: "0.15s" }} />
                      <div className="relative w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center shadow-lg">
                        <Loader2 className="w-7 h-7 text-white animate-spin" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-ink-900 text-lg mb-1">Preparing your quote…</p>
                      <p className="text-ink-400 text-sm">This only takes a moment</p>
                    </div>
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                      {[
                        { label: "Reviewing your property details", delay: "0s" },
                        { label: "Matching your service requirements", delay: "0.4s" },
                        { label: "Preparing your personalised quote", delay: "0.8s" },
                      ].map(({ label, delay }) => (
                        <div key={label} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-violet-500 animate-pulse shrink-0" style={{ animationDelay: delay }} />
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
                      const service = answers.service ?? "";

                      if (service === "Scheduled Maintenance Plans") {
                        return (
                          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 text-center">
                            <p className="text-violet-700 font-bold text-sm mb-1">Pricing discussed over the phone</p>
                            <p className="text-violet-500 text-xs leading-relaxed">Maintenance plans are tailored to your turf — our team will call you to discuss frequency, inclusions and your discounted rate (10–15% off).</p>
                          </div>
                        );
                      }

                      if (service === "Synthetic Turf Deep Clean" && answers.turfSize === "100m²+") {
                        return (
                          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 text-center">
                            <p className="text-violet-700 font-bold text-sm mb-1">Custom quote for large areas</p>
                            <p className="text-violet-500 text-xs leading-relaxed">For turf over 100m² we&apos;ll measure and provide a fixed price — our team will be in touch shortly.</p>
                          </div>
                        );
                      }

                      if (service === "Synthetic Turf Deep Clean" && answers.turfSize) {
                        const opt = TURF_SIZE_OPTIONS.find(o => o.label === answers.turfSize);
                        if (opt && opt.low > 0) {
                          return (
                            <div className="bg-ink-900 rounded-2xl p-5 text-center">
                              <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Price Estimate</p>
                              <p className="text-white font-black text-3xl">
                                {opt.low === opt.high ? `$${opt.low}` : `$${opt.low} – $${opt.high}`}
                              </p>
                              <p className="text-white/40 text-xs mt-1">{answers.turfSize} · Final confirmed on-site</p>
                            </div>
                          );
                        }
                      }

                      if ((service === "Pet Odour & Stain Treatment" || service === "Moss & Algae Removal") && answers.serviceDetail) {
                        const { low, high } = getAddonPricing(service, answers.serviceDetail);
                        return (
                          <div className="bg-ink-900 rounded-2xl p-5 text-center">
                            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Price Estimate</p>
                            <p className="text-white font-black text-3xl">${low} – ${high}</p>
                            <p className="text-white/40 text-xs mt-1">{answers.serviceDetail} · Final confirmed on-site</p>
                          </div>
                        );
                      }

                      if (service === "Debris & Leaf Clearing") {
                        return (
                          <div className="bg-ink-900 rounded-2xl p-5 text-center">
                            <p className="text-white/50 text-[11px] uppercase tracking-widest mb-1">Price Estimate</p>
                            <p className="text-white font-black text-3xl">$60 – $100</p>
                            <p className="text-white/40 text-xs mt-1">Final price confirmed on-site</p>
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

                      return null;
                    })()}

                    {/* Summary */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                      <p className="text-ink-400 text-[11px] uppercase tracking-widest font-semibold mb-1">Your selections</p>
                      {[
                        { label: "Service",     value: answers.service },
                        { label: "Turf size",   value: answers.turfSize },
                        { label: "Type",        value: answers.serviceDetail },
                        { label: "Postcode",    value: answers.postcode ? `${answers.postcode}${answers.suburb ? ` · ${answers.suburb}` : ""}` : undefined },
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
                      href="tel:0433240617"
                      className="flex items-center justify-center gap-2.5 w-full py-4 bg-violet-600 text-white font-bold rounded-2xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now: 0433 240 617
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
