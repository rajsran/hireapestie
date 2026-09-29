"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Check, Sparkles, Heart, Leaf, Wind, CalendarCheck, FileText, ArrowRight } from "lucide-react";
import QuoteChat from "@/components/QuoteChat";

const services = [
  {
    id: "synthetic-turf-deep-clean",
    Icon: Sparkles,
    title: "Synthetic Turf Deep Clean",
    tagline: "Restore your turf to like-new condition.",
    desc: "Our signature deep clean removes embedded dirt, dust, organic matter and bacteria from your synthetic turf using professional-grade equipment. We restore drainage flow, revive the fibres and leave your lawn looking and smelling fresh.",
    features: [
      "Debris & dry waste removal",
      "High-powered rotary brush clean",
      "Infill top-up assessment",
      "Drainage flow check",
      "Before & after photos provided",
      "Residential & commercial turf",
    ],
    pricing: "From $150 (up to ~25m²) · $6–8/m² for larger areas",
    image: "/SyntheticTurf%20DeepClean.jpeg",
  },
  {
    id: "pet-odour-stain-treatment",
    Icon: Heart,
    title: "Pet Odour & Stain Treatment",
    tagline: "Eliminate pet smells and stains for good.",
    desc: "Pet urine and waste can penetrate deep into synthetic turf fibres and infill, causing persistent odours and unhygienic conditions. Our enzyme-based treatment neutralises bacteria at the source — not just masking smells, but eliminating them.",
    features: [
      "Enzyme-based deodorising treatment",
      "Bacteria & pathogen neutralisation",
      "Pet-safe, non-toxic products",
      "Suitable for all turf types",
      "Available as add-on or standalone",
      "Fast-drying formula",
    ],
    pricing: "$60–100 as add-on · $120–160 standalone",
    image: "/PetOdour%26StainTreatment.jpg",
  },
  {
    id: "moss-algae-removal",
    Icon: Leaf,
    title: "Moss & Algae Removal",
    tagline: "Safe, slippery-free turf all year round.",
    desc: "Shaded or damp areas are prone to moss and algae growth on synthetic turf, which creates a slippery and unsightly surface. We apply targeted bio-treatments to kill and remove growth without damaging your turf backing or infill.",
    features: [
      "Bio-safe algae & moss treatment",
      "Manual removal of growth",
      "Turf backing protection",
      "Safe for kids and pets after dry",
      "Available as add-on or standalone",
      "Prevents regrowth for longer",
    ],
    pricing: "$80–150 as add-on or standalone",
    image: "/Moss%26AlgaeRemoval.jpg",
  },
  {
    id: "debris-leaf-clearing",
    Icon: Wind,
    title: "Debris & Leaf Clearing",
    tagline: "Keep your turf clean between deep cleans.",
    desc: "Leaves, bark, twigs and organic debris accumulate on synthetic turf and block drainage if left uncleared. Our debris clearing service uses blowers and rakes to quickly remove surface build-up and restore a neat, functional lawn.",
    features: [
      "Surface debris removal",
      "Leaf & bark blowing/raking",
      "Drainage grille clearing",
      "Quick-turnaround service",
      "Great as a regular maintenance visit",
      "Residential & commercial",
    ],
    pricing: "$60–100",
    image: "/Debris%20%26%20Leaf%20Clearing.jpg",
  },
  {
    id: "scheduled-maintenance-plans",
    Icon: CalendarCheck,
    title: "Scheduled Maintenance Plans",
    tagline: "Set and forget — we keep your turf perfect.",
    desc: "Our quarterly maintenance plans combine deep cleaning, treatment and inspection into one scheduled visit — at a discounted rate. Ideal for busy households, landlords, childcare centres and commercial properties that need consistent upkeep.",
    features: [
      "10–15% off standard service rates",
      "Quarterly scheduled visits",
      "Combined deep clean + treatments",
      "Priority booking & fast response",
      "Detailed condition reports",
      "Suits residential & commercial",
    ],
    pricing: "10–15% off standard rates · Quarterly plans",
    image: "/service.jpeg",
  },
];

export default function ServicesClient() {
  const [active, setActive] = useState(services[0].id);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-violet-600 text-xs font-bold tracking-widest uppercase mb-3">What We Offer</p>
          <h1 className="font-display font-black text-4xl md:text-6xl text-ink-900 leading-tight mb-4">Our Services</h1>
          <p className="text-ink-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Five specialist services. One trusted team. Covering all Melbourne suburbs.
          </p>
        </div>
      </section>

      {/* Sticky tab nav */}
      <div className="sticky top-[57px] md:top-[68px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-1 px-4 py-2 md:justify-center" style={{ scrollbarWidth: "none" }}>
          {services.map(({ id, Icon, title }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActive(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-violet"
                    : "text-ink-500 hover:text-violet-600 hover:bg-violet-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {title}
              </a>
            );
          })}
        </div>
      </div>

      {/* Service sections */}
      <div className="bg-gray-50">
        {services.map((s, i) => {
          const imageRight = i % 2 === 0;
          return (
            <section key={s.id} id={s.id} className={i !== 0 ? "border-t border-gray-100" : ""}>
              <div className="md:grid md:grid-cols-2 md:min-h-[520px]">

                {/* Image */}
                <div className={`relative w-full aspect-[16/9] md:aspect-auto overflow-hidden bg-gray-200 ${imageRight ? "md:order-1" : "md:order-2"}`}>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/30 md:via-transparent md:to-transparent" />

                  {/* Mobile badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 md:hidden">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-violet">
                      <s.Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg leading-tight">{s.title}</p>
                      <p className="text-white/70 text-xs leading-tight">{s.tagline}</p>
                    </div>
                  </div>

                  {/* Desktop number badge */}
                  <div className="hidden md:flex absolute top-6 left-6 items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg">
                      <s.Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/80 text-sm font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      0{i + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`bg-white px-5 pt-6 pb-8 md:px-12 md:py-14 flex flex-col justify-center ${imageRight ? "md:order-2" : "md:order-1"}`}>

                  {/* Desktop heading */}
                  <div className="hidden md:flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                      <s.Icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="font-display font-black text-2xl text-ink-900 leading-tight">{s.title}</h2>
                      <p className="text-violet-600 text-sm font-medium">{s.tagline}</p>
                    </div>
                  </div>

                  <p className="text-ink-500 text-sm md:text-base leading-relaxed mb-4">{s.desc}</p>

                  {/* Pricing badge */}
                  <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 mb-5 self-start">
                    <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">Pricing</span>
                    <span className="text-sm font-semibold text-violet-700">{s.pricing}</span>
                  </div>

                  <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-3">What&apos;s included</p>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-7">
                    {s.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-violet-600" />
                        </div>
                        <span className="text-xs md:text-sm text-ink-700 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="flex-1 md:flex-none md:px-7 flex items-center justify-center gap-2 py-3 bg-violet-600 text-white text-sm font-bold rounded-2xl shadow-violet active:scale-[0.98] transition-all hover:bg-violet-700 group"
                    >
                      <FileText className="w-4 h-4" />
                      Get Free Quote
                      <ArrowRight className="w-4 h-4 hidden md:block group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <a
                      href="tel:0433240617"
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-ink-700 text-sm font-semibold rounded-2xl hover:border-violet-300 hover:text-violet-600 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden md:inline">0433 240 617</span>
                      <span className="md:hidden">Call</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-ink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="text-violet-400 text-xs font-bold tracking-widest uppercase mb-3">Ready to Start?</p>
          <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 leading-tight">
            Let&apos;s discuss your job
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Free quotes. No obligation. We cover all Melbourne suburbs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setQuoteOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl text-sm shadow-violet hover:bg-violet-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Get a Free Quote
            </button>
            <a
              href="tel:0433240617"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl text-sm hover:border-white/50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              0433 240 617
            </a>
          </div>
        </div>
      </section>

      <QuoteChat isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
