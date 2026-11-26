"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Check, HardHat, Search, Home, Building2, Bug, FileText, ArrowRight } from "lucide-react";
import QuoteChat from "@/components/QuoteChat";

const services = [
  {
    id: "pre-construction-pest-control",
    image: "/service-preconstruction.jpg",
    Icon: HardHat,
    title: "Pre-construction Pest Control",
    tagline: "Termite protection before you build.",
    desc: "Hire a Pestie strongly advocates for a termite prevention procedure before commencing construction, once the concrete preparation has been finished. Our efficient pre-construction pest control process establishes both a physical and chemical defense system, effectively discouraging termites from infiltrating your residence.",
    features: [
      "Treatment once slab preparation is finished",
      "Physical & chemical defense system",
      "Discourages termites from entering",
      "Protects your new build long-term",
      "Licensed & fully insured team",
      "Eco-friendly approach",
    ],
  },
  {
    id: "pest-control-inspection",
    image: "/service-inspection.jpg",
    Icon: Search,
    title: "Pest Control Inspection",
    tagline: "Find the problem before it spreads.",
    desc: "Explore our pest control and inspection services for a thorough and comprehensive approach to pest control. Our skilled technicians will inspect your property, identifying potential pest threats and vulnerabilities. With our expertise, we ensure a pest-free environment, giving you peace of mind. Trust Hire a Pestie for top-notch pest control inspection services.",
    features: [
      "Thorough property inspection",
      "Identifies pest threats & vulnerabilities",
      "Skilled, licensed technicians",
      "Clear advice on next steps",
      "Residential & commercial",
      "Peace of mind, pest-free",
    ],
  },
  {
    id: "residential-pest-control",
    image: "/service-residential.jpg",
    Icon: Home,
    title: "Residential Pest Control",
    tagline: "Your home should be your sanctuary.",
    desc: "Hire a Pestie always believes that your home should be your sanctuary, not a playground for pests. Consider hiring us for all your residential property pest treatment needs, ranging from townhouses, units, apartments, single-story and double-story houses, acreages, large estates, farmlands, and everything in between. Our seasoned pest control team is ready to help you ward off mosquitoes and other pests effectively.",
    features: [
      "Townhouses, units & apartments",
      "Single & double-story houses",
      "Acreages, large estates & farmlands",
      "Mosquito & general pest treatment",
      "Safe for your family and pets",
      "Seasoned, friendly team",
    ],
  },
  {
    id: "commercial-pest-control",
    image: "/service-commercial.jpg",
    Icon: Building2,
    title: "Commercial Pest Control",
    tagline: "Protect your business and reputation.",
    desc: "The Hire a Pestie team provides diverse pest control and maintenance programs tailored to the commercial sector. Our pest control services cater to an array of businesses such as restaurants, cafes, factories, shopping malls, offices, petrol stations, hotels, motels, airports, military bases, and many more. All our services are available at competitive and budget-friendly rates.",
    features: [
      "Restaurants, cafes & hotels",
      "Factories, offices & shopping malls",
      "Petrol stations, airports & more",
      "Tailored maintenance programs",
      "Competitive, budget-friendly rates",
      "Flexible scheduling, 24/7 availability",
    ],
  },
  {
    id: "pests",
    image: "/service-pests.jpg",
    Icon: Bug,
    title: "Pests",
    tagline: "Show them the door.",
    desc: "Welcome to our Pest Control Services, where we tackle your pest problems with a whole lot of expertise. When pests decide to crash your party, it's time to show them the door with our help. So, let's dive into the world of critters and learn how we can make your home a pest-free sanctuary. From bed bugs to rodents, we offer tailored solutions for your unique needs.",
    features: [
      "Bed bugs & cockroaches",
      "Rodents & mice",
      "Mosquitoes & flies",
      "Ants & spiders",
      "Innovative prevention so they don't return",
      "Zero hassle, pest-free delight",
    ],
  },
];

export default function ServicesClient() {
  const [active, setActive] = useState(services[0].id);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-10 bg-dots border-b-4 border-ink-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-3">Our Top Services</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-ink-900 leading-tight mb-4">
            Pest problems need <span className="mark-orange text-violet-700">experts like us</span>
          </h1>
          <p className="text-ink-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Five specialist services. One trusted team. Serving Melbourne, Geelong, Bendigo and Ballarat.
          </p>
        </div>
      </section>

      {/* Sticky tab nav */}
      <div className="sticky top-[57px] md:top-[68px] z-40 bg-white border-b-2 border-ink-900">
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
                    ? "bg-accent-500 text-white"
                    : "text-ink-500 hover:text-violet-700 hover:bg-violet-50"
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
      <div className="bg-violet-50">
        {services.map((s, i) => {
          const panelFirst = i % 2 === 0;
          return (
            <section key={s.id} id={s.id} className={`scroll-mt-32 ${i !== 0 ? "border-t-2 border-ink-900" : ""}`}>
              <div className="md:grid md:grid-cols-2 md:min-h-[480px]">

                {/* Photo (when available) or icon panel */}
                {"image" in s && s.image ? (
                  <div className={`relative w-full aspect-[16/10] md:aspect-auto overflow-hidden bg-navy-800 ${panelFirst ? "md:order-1" : "md:order-2"}`}>
                    <Image src={s.image} alt={s.title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} />
                    <span className="absolute top-4 left-4 flex items-center gap-2 bg-white border-2 border-ink-900 rounded-full pl-1.5 pr-3 py-1 shadow-[2px_2px_0_0_#1E2328]">
                      <span className="w-7 h-7 rounded-full bg-violet-400 flex items-center justify-center"><s.Icon className="w-4 h-4 text-navy-900" /></span>
                      <span className="text-ink-900 text-xs font-bold">0{i + 1}</span>
                    </span>
                  </div>
                ) : (
                <div className={`relative flex items-center justify-center py-12 md:py-0 bg-navy-800 overflow-hidden ${panelFirst ? "md:order-1" : "md:order-2"}`}>
                  <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-violet-400 opacity-20" />
                  <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-accent-500 opacity-20" />
                  <div className="relative flex flex-col items-center text-center px-6">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-violet-400 border-4 border-white flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,0.35)]">
                      <s.Icon className="w-14 h-14 md:w-[4.5rem] md:h-[4.5rem] text-navy-900" strokeWidth={1.75} />
                    </div>
                    <span className="mt-6 text-white/80 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">0{i + 1}</span>
                    <p className="mt-3 text-white font-display font-bold text-xl md:hidden">{s.title}</p>
                  </div>
                </div>
                )}

                {/* Content */}
                <div className={`bg-white px-5 pt-6 pb-8 md:px-12 md:py-14 flex flex-col justify-center ${panelFirst ? "md:order-2" : "md:order-1"}`}>
                  <div className="mb-4">
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-ink-900 leading-tight">{s.title}</h2>
                    <p className="text-violet-700 text-sm font-medium mt-1">{s.tagline}</p>
                  </div>

                  <p className="text-ink-500 text-sm md:text-base leading-relaxed mb-4">{s.desc}</p>

                  <div className="inline-flex items-center gap-2 bg-accent-50 border-2 border-ink-900 rounded-xl px-3 py-2 mb-5 self-start">
                    <span className="text-[10px] font-bold text-accent-700 uppercase tracking-widest">Pricing</span>
                    <span className="text-sm font-semibold text-ink-900">Free, no-obligation quote</span>
                  </div>

                  <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-3">What&apos;s included</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 mb-7">
                    {s.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-violet-700" />
                        </div>
                        <span className="text-xs md:text-sm text-ink-700 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setQuoteOpen(true)}
                      className="flex-1 md:flex-none md:px-7 flex items-center justify-center gap-2 py-3 bg-accent-500 text-white text-sm font-bold rounded-2xl group"
                    >
                      <FileText className="w-4 h-4" />
                      Get Free Quote
                      <ArrowRight className="w-4 h-4 hidden md:block group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <a
                      href="tel:0448163783"
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-ink-900 text-ink-900 text-sm font-semibold rounded-2xl hover:bg-violet-50 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden md:inline">0448 163 783</span>
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
      <section className="py-16 md:py-24 bg-navy-800 border-t-4 border-violet-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="text-violet-400 text-xs font-bold tracking-widest uppercase mb-3">Ready to Evict the Uninvited Guests?</p>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
            Don&apos;t let pests ruin your party!
          </h2>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            Free quotes. No obligation. Melbourne, Geelong, Bendigo and Ballarat.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setQuoteOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-bold rounded-2xl text-sm"
            >
              <FileText className="w-4 h-4" />
              Get a Free Quote
            </button>
            <a
              href="tel:0448163783"
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-2xl text-sm hover:border-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              0448 163 783
            </a>
          </div>
        </div>
      </section>

      <QuoteChat isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
