"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How much does synthetic turf cleaning cost in Melbourne?",
    a: "Our synthetic turf deep clean starts from $150 for areas up to 25m². Larger areas are priced based on size and condition. We also offer pet odour & stain treatment, moss & algae removal, and scheduled maintenance plans. Get a free, no-obligation quote in minutes using our online tool.",
  },
  {
    q: "How often should I clean my synthetic turf?",
    a: "We recommend a professional deep clean at least once a year for most residential lawns. If you have pets, children who play outdoors frequently, or experience heavy leaf fall, a clean every 6 months will keep your turf fresh, hygienic, and looking its best. We offer affordable scheduled maintenance plans to make it easy.",
  },
  {
    q: "Can you remove pet odours from synthetic turf?",
    a: "Yes — pet odour removal is one of our most popular services. Pet urine breaks down into ammonia and bacteria that trap themselves in the turf fibres and infill. Our specialist pet odour & stain treatment uses a deep-penetrating enzyme solution that neutralises odours at the source rather than just masking them, leaving your turf fresh and safe for kids and pets.",
  },
  {
    q: "Which Melbourne suburbs do you service?",
    a: "We service all Melbourne suburbs — from the CBD to the outer west (including Melton, Tarneit, Werribee, Point Cook), outer east (Ringwood, Knox, Dandenong), north (Craigieburn, Epping, Whittlesea), south-east (Frankston, Narre Warren, Berwick), and everywhere in between. If you're unsure, enter your suburb in our quote tool and we'll confirm availability.",
  },
  {
    q: "How long does a turf clean take?",
    a: "Most residential cleans take between 1 and 3 hours depending on the size and condition of the turf. Larger commercial areas or heavily soiled turf may take longer. We'll give you a time estimate when you book so you can plan your day.",
  },
  {
    q: "Is synthetic turf cleaning safe for children and pets?",
    a: "Absolutely. We use biodegradable, non-toxic cleaning solutions that are safe for kids and pets once dry — typically within 30–60 minutes after the service. There's no harsh chemical residue left behind. We're fully licensed and insured for residential and commercial work.",
  },
  {
    q: "Do I need to be home during the clean?",
    a: "No — as long as we can access the turf area, you don't need to be present. Many customers simply leave gate access instructions when they book. We'll send you a notification when the job is complete.",
  },
  {
    q: "Can you remove moss and algae from my synthetic turf?",
    a: "Yes. Moss and algae are common in shaded or damp areas and can make turf slippery and unsightly. Our moss & algae removal service treats and removes growth using specialist solutions, then rinses thoroughly. We can also advise on steps to slow regrowth.",
  },
  {
    q: "What's included in a synthetic turf deep clean?",
    a: "Our deep clean includes: debris and leaf removal, high-pressure rinse, a full brush and fibre lift to restore pile direction, deodorising treatment, and an infill top-up check. For pet households we recommend adding our pet odour & stain treatment as an upgrade.",
  },
  {
    q: "Do you offer commercial synthetic turf cleaning?",
    a: "Yes. We clean commercial turf installations at childcare centres, schools, sports facilities, apartment complexes, and retail spaces across Melbourne. Commercial jobs receive a tailored quote based on area size, condition, and preferred scheduling (including after-hours).",
  },
  {
    q: "How do I book a turf cleaning service?",
    a: "The easiest way is to use our instant quote tool on the website — it takes about 2 minutes and gives you a price straight away. You can also call us on 0433 240 617 or use the contact form. We operate Monday to Friday, 8am–4pm, and aim to respond to all enquiries within a few hours.",
  },
  {
    q: "How is synthetic turf cleaning different from just hosing it down?",
    a: "Hosing removes surface dust but doesn't lift embedded debris from deep in the infill, neutralise bacteria and odours, treat moss or algae, or restore the upright pile of the fibres. Professional cleaning uses specialist equipment — rotary brushes, blowers, and targeted treatments — to deep-clean the full depth of the turf and extend its lifespan.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

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
      <section className="pt-32 pb-14 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-ink-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-ink-500 text-lg">
            Everything you need to know about synthetic turf cleaning in Melbourne. Can&apos;t find your answer?{" "}
            <Link href="/contact" className="text-violet-600 hover:underline font-medium">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-ink-900 text-base leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`shrink-0 w-5 h-5 text-violet-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-ink-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ink-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
            Ready to book a turf clean?
          </h2>
          <p className="text-white/70 text-base mb-8">
            Get a free quote in under 2 minutes. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:0433240617"
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              Call 0433 240 617
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
