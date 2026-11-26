"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

const faqs = [
  {
    q: "What areas do you service?",
    a: "We provide pest control in Melbourne, Geelong, Bendigo and Ballarat, for both residential and commercial properties. Not sure if we cover your suburb? Call us or request a quote and we'll confirm.",
  },
  {
    q: "What types of pests do you deal with?",
    a: "No pest is too big, too small, or too creepy-crawly. From bed bugs and cockroaches to rodents, mosquitoes, ants, spiders and termites, we offer tailored solutions for your unique needs.",
  },
  {
    q: "How much does pest control cost?",
    a: "It depends on the type of pest, the size of your property and the service you need. Quotes are free and no-obligation — use our online quote tool for a quick estimate, or call us. For commercial work, our rates are competitive and budget-friendly.",
  },
  {
    q: "Are your treatments safe for my family and pets?",
    a: "We use eco-friendly pest control methods and our technicians are licensed and fully insured. Every job is different, so your technician will explain the treatment and any simple precautions for your household and pets before they start.",
  },
  {
    q: "What is a pest control inspection and do I need one?",
    a: "Our technicians inspect your property to identify potential pest threats and vulnerabilities, so problems are caught early — before they spread. An inspection is a good idea if you've spotted signs of pests, before buying or selling, or if you simply want peace of mind.",
  },
  {
    q: "What is pre-construction pest control?",
    a: "It's termite prevention carried out before construction continues — once the concrete preparation has been finished. The process creates both a physical and chemical defence system that discourages termites from getting into your new home.",
  },
  {
    q: "Do you treat both homes and businesses?",
    a: "Yes. Residential work covers townhouses, units, apartments, single and double-storey houses, acreages, large estates and farmlands. Commercial work covers restaurants, cafes, factories, shopping malls, offices, petrol stations, hotels, motels, airports and more.",
  },
  {
    q: "Are you available outside normal business hours?",
    a: "We offer 24/7 availability, so you can reach out whenever pests turn up. Call us or send a quote request at any time and we'll work around your schedule.",
  },
  {
    q: "Will the pests come back?",
    a: "We don't just kick pests out — we make sure they don't come back too. Along with treatment, we focus on prevention. We also stand behind our work with our \"Party-Pooping Pests, Be Gone!\" guarantee.",
  },
  {
    q: "Do I need to be home during the service?",
    a: "Access arrangements depend on the job. When you book, tell us whether you'll be home and how we can get in, and we'll confirm the plan with you.",
  },
  {
    q: "How do I get a quote or book a service?",
    a: "The easiest way is our online quote tool — it only takes a minute or two. You can also call us on 0448 163 783 or use the contact form, and we'll get back to you quickly.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      {/* Header */}
      <section className="pt-28 pb-12 bg-dots border-b-4 border-ink-900">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-violet-700 text-sm font-bold tracking-widest uppercase mb-3">FAQ</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-ink-900 mb-4">
            Got questions? <span className="mark-orange text-violet-700">We&apos;ve got answers.</span>
          </h1>
          <p className="text-ink-500 text-lg">
            Everything you need to know about pest control with Hire a Pestie. Can&apos;t find your answer?{" "}
            <Link href="/contact" className="text-violet-700 hover:underline font-semibold">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`border-2 border-ink-900 rounded-2xl overflow-hidden transition-colors ${isOpen ? "bg-violet-50 shadow-card" : "bg-white"}`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="font-semibold text-ink-900 text-base leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`shrink-0 w-5 h-5 text-violet-700 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    className="px-5 md:px-6 pb-5 text-ink-700 text-sm md:text-base leading-relaxed border-t-2 border-ink-900/10 pt-4"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-800 border-t-4 border-violet-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to evict the uninvited guests?
          </h2>
          <p className="text-white/70 text-base mb-8">
            Get a free quote in minutes. No obligation. Don&apos;t let pests ruin your party!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-accent-500 text-white font-bold rounded-full text-sm"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:0448163783"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full text-sm hover:border-white transition-colors"
            >
              <Phone className="w-4 h-4" /> Call 0448 163 783
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
