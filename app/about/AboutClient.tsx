"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Phone, Bug, Home, Building2, HardHat, Leaf, Sparkles, Smile, Armchair } from "lucide-react";
import QuoteChat from "@/components/QuoteChat";

const reasons = [
  {
    icon: Bug,
    title: "Pest-Busting Pros",
    desc: "No pest is too big, too small, or too creepy-crawly — from ants in the attic to termites in the toolshed.",
  },
  {
    icon: Home,
    title: "Residential Refuge",
    desc: "We keep your home pest-free, so it stays the sanctuary it's meant to be.",
  },
  {
    icon: Building2,
    title: "Commercial Commandos",
    desc: "We keep your business pest-free — because a cockroach has no place at a client meeting.",
  },
  {
    icon: HardHat,
    title: "Pre-construction Pros",
    desc: "Protection before the building even goes up, laying the foundation for pest-free success.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Enforcers",
    desc: "We use eco-friendly pest control methods that get the job done with care.",
  },
];

const philosophy = [
  { icon: Sparkles, title: "Pest-free spaces", desc: "We eliminate the pests and secure your space." },
  { icon: Smile,    title: "Happy faces",      desc: "Professional, friendly service from start to finish." },
  { icon: Armchair, title: "A relaxed experience", desc: "Pests are stressful. We aim to lighten the load along the way." },
];

export default function AboutClient() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <section className="pt-24 pb-8 bg-dots border-b-4 border-ink-900">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-2">Our Story</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-ink-900 mb-3">
            About <span className="mark-orange text-violet-700">Hire a Pestie</span>
          </h1>
          <p className="text-ink-500 text-base md:text-lg max-w-2xl">
            Your pest inspection &amp; control partner — where pest problems meet their solutions.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden border-2 border-ink-900 shadow-card-lg">
            <Image
              src="/hero.jpeg"
              alt="A Hire a Pestie technician outside a Melbourne home"
              fill
              className="object-cover object-center"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute bottom-4 left-4 bg-white border-2 border-ink-900 px-4 py-2 rounded-xl shadow-[3px_3px_0_0_#1E2328]">
              <p className="text-ink-900 font-bold text-sm">Hire a Pestie</p>
              <p className="text-violet-700 text-xs font-medium">Your Pest Inspection &amp; Control Partner</p>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-ink-900 mb-4">
              Welcome to the quirky world of Hire a Pestie.
            </h2>
            <div className="space-y-3 text-ink-500 text-sm md:text-base leading-relaxed">
              <p>
                Are you tired of pests crashing your home, causing chaos, and stealing the spotlight? That&apos;s where we come in. With
                pest-removal skills and years of dedicated experience, our mission is simple: rid your world of those pesky critters.
              </p>
              <p>
                Meet the &ldquo;X-Pest&rdquo; team — the Avengers of Ants, the Exterminators of Evil and the Protectors of Pantries.
                We serve homes and businesses across Melbourne, Geelong, Bendigo and Ballarat.
              </p>
              <p>
                We&apos;re so confident in our work that we back it with our &ldquo;Party-Pooping Pests, Be Gone!&rdquo; guarantee.
              </p>
            </div>
            <button
              onClick={() => setQuoteOpen(true)}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent-500 text-white text-sm font-semibold rounded-full"
            >
              Get a free quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-10 md:py-20 bg-dots border-y-4 border-ink-900">
        <div className="max-w-7xl mx-auto px-5">
          <div className="mb-8 md:mb-12">
            <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-2">Why choose us?</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink-900">Pest problems, powerful solutions</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r) => (
              <div key={r.title} className="p-5 md:p-6 rounded-2xl bg-white border-2 border-ink-900 shadow-card">
                <div className="w-11 h-11 rounded-xl bg-violet-100 border-2 border-ink-900 flex items-center justify-center mb-3">
                  <r.icon className="w-5 h-5 text-violet-700" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink-900 mb-1">{r.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-2">What we believe</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink-900">The &lsquo;Hire a Pestie&rsquo; Philosophy</h2>
            <p className="text-ink-500 mt-3 max-w-xl mx-auto text-sm md:text-base">
              We believe in three things — and the Pestie Promise: eliminate the pests, secure the space, and stay professional throughout.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {philosophy.map((p) => (
              <div key={p.title} className="p-6 rounded-2xl bg-violet-50 border-2 border-ink-900 shadow-card text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent-500 border-2 border-ink-900 flex items-center justify-center mb-3">
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink-900 mb-1">{p.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 pb-14 bg-navy-800 border-t-4 border-violet-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">Ready to evict the uninvited guests?</h2>
          <p className="text-white/70 mb-8">Call us now, and let the pest removal begin!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setQuoteOpen(true)}
              className="sm:min-w-[200px] text-center px-6 py-4 bg-accent-500 text-white font-bold rounded-full text-sm"
            >
              Get a Free Quote
            </button>
            <a
              href="tel:0448163783"
              className="sm:min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-white/40 text-white font-semibold rounded-full text-sm hover:border-white transition-colors"
            >
              <Phone className="w-4 h-4" /> 0448 163 783
            </a>
          </div>
        </div>
      </section>

      <QuoteChat isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
