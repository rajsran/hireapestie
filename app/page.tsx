"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Phone, Star, Bug, Search, Home, Building2, HardHat, Leaf, Clock, MapPin, FileText, Wrench, ShieldCheck } from "lucide-react";
import QuoteChat from "@/components/QuoteChat";

const services = [
  { Icon: HardHat,   title: "Pre-construction Pest Control", desc: "Termite prevention before construction begins, once the concrete preparation has been finished." },
  { Icon: Search,    title: "Pest Control Inspection",       desc: "We inspect your property, identifying potential pest threats and vulnerabilities."                },
  { Icon: Home,      title: "Residential Pest Control",      desc: "Townhouses, units, apartments, houses, acreages and large estates — pest-free and protected."    },
  { Icon: Building2, title: "Commercial Pest Control",       desc: "Restaurants, cafes, factories, offices, hotels and more — competitive, budget-friendly rates."   },
  { Icon: Bug,       title: "Pests",                         desc: "From bed bugs to rodents, mosquitoes and beyond — tailored solutions for every pest problem."    },
];

const testimonials = [
  { name: "Shivansh Gupta", text: "So professional and friendly. I am definitely getting back to them for any problem." },
  { name: "Ramneek Singh",  text: "I have been taking their advice even before this started and they have been accurate." },
  { name: "Lina Ashar",     text: "Great Team and professional service." },
  { name: "Kartik Singh",   text: "They are so quick in responding and reasonable with prices." },
  { name: "David Brad",     text: "Amazing services and always on time. They are so straightforward and go above and beyond..." },
];

const STATIC_HERO = [
  { src: "/hero.jpeg", alt: "Hire a Pestie technician outside a Melbourne home" },
  { src: "/logo.png",  alt: "Hire-a-Pestie logo" },
];

function heroSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroAnimate, setHeroAnimate] = useState(true);
  const [heroImages, setHeroImages] = useState(STATIC_HERO);

  // A copy of the first slide sits at the end so the loop always slides right-to-left
  const heroSlides = heroImages.length > 1 ? [...heroImages, heroImages[0]] : heroImages;
  const activeHero = heroSlide % heroImages.length;

  function goToHeroSlide(i: number) {
    setHeroAnimate(true);
    setHeroSlide(i);
  }

  // Load admin-uploaded hero images, fall back to static if none
  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(({ urls }: { urls: string[] }) => {
        if (urls.length > 0) {
          setHeroImages(urls.map((src, i) => ({ src: heroSrc(src), alt: `Hire a Pestie hero ${i + 1}` })));
          setHeroSlide(0);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance every 4 s (always forwards: right-to-left)
  useEffect(() => {
    if (heroImages.length < 2) return;
    const t = setInterval(() => {
      setHeroAnimate(true);
      setHeroSlide((s) => Math.min(s + 1, heroImages.length));
    }, 4000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  // After sliding onto the cloned first slide, snap back to the real first slide (no animation)
  useEffect(() => {
    if (heroSlide < heroImages.length) return;
    const t = setTimeout(() => {
      setHeroAnimate(false);
      setHeroSlide(0);
    }, 750);
    return () => clearTimeout(t);
  }, [heroSlide, heroImages.length]);


  return (
    <>
      {/* Hero */}
      <section className="bg-dots pt-14 md:flex md:flex-row md:h-screen md:overflow-hidden">

          {/* Hero image slider — slides right-to-left, loops seamlessly */}
          <div className="relative w-full h-56 mb-7 select-none overflow-hidden md:w-1/2 md:h-full md:mb-0 md:order-2">
            <div
              className="flex w-full h-full"
              style={{
                transform: `translateX(-${heroSlide * 100}%)`,
                transition: heroAnimate ? 'transform 700ms cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
              }}
            >
              {heroSlides.map((img, i) => {
                const isLogo = img.src.includes('logo');
                return (
                  <div key={`${img.src}-${i}`} className={`relative flex-none w-full h-full ${isLogo ? 'bg-white' : ''}`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className={isLogo ? 'object-contain p-8 md:p-14' : 'object-cover object-center'}
                      priority={i === 0}
                      unoptimized={img.src.startsWith('/api/image')}
                    />
                  </div>
                );
              })}
            </div>

            {/* Overlay (photo slides only — keeps the logo slide clean white) */}
            {!heroImages[activeHero]?.src.includes('logo') && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Dot indicators */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-auto">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToHeroSlide(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`rounded-full border border-ink-900/40 transition-all duration-300 ${i === activeHero ? "w-5 h-2 bg-accent-500" : "w-2 h-2 bg-white/90"}`}
                  />
                ))}
              </div>
            )}
          </div>

        <div className="px-5 pb-10 flex flex-col items-center text-center md:w-1/2 md:order-1 md:items-start md:text-left md:px-16 md:justify-center md:overflow-y-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-ink-900 shadow-[2px_2px_0_0_#1E2328] rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-700 text-xs font-semibold tracking-wide">Your Pest Inspection &amp; Control Partner</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-[1.65rem] md:text-5xl leading-[1.15] text-ink-900 mb-5">
            Pest Control{" "}
            <span className="mark-orange text-violet-700">
              in Melbourne
            </span>
          </h1>

          <p className="text-ink-500 text-sm md:text-base leading-relaxed mb-4 max-w-md">
            Protect your home from pests. We&apos;re so confident in our service that we offer the
            &ldquo;Party-Pooping Pests, Be Gone!&rdquo; guarantee.
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-ink-600 text-sm font-semibold">Trusted Local Pest Experts</span>
            <span className="text-ink-300 text-sm">· Verified Reviews</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="btn-pulse relative flex items-center justify-center gap-2.5 w-full md:max-w-sm py-4 md:py-5 bg-gradient-to-b from-accent-400 to-accent-600 text-white font-bold rounded-full active:scale-[0.98] transition-all duration-200 text-base md:text-lg mb-3 overflow-hidden group "
          >
            <span className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
            <FileText className="w-5 h-5 relative z-10 drop-shadow-sm" />
            <span className="relative z-10 drop-shadow-sm">Get Quotes in Minutes</span>
          </button>

          {/* Secondary CTAs */}
          <div className="flex gap-3 w-full md:max-w-sm mb-8">
            <a
              href="/services"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-violet-600 text-violet-600 font-bold rounded-full hover:bg-violet-50 active:scale-[0.98] transition-all duration-200 text-sm"
            >
              <Wrench className="w-4 h-4" />
              Our Services
            </a>
          </div>

          {/* Trust cards — 2 col */}
          <div className="grid grid-cols-2 gap-3 w-full md:max-w-sm">
            <div className="bg-white border-2 border-ink-900 shadow-card rounded-2xl p-4 flex items-start gap-3 text-left hover:border-violet-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-ink-900 text-sm leading-tight">Fully Insured</p>
                <p className="text-ink-400 text-xs mt-0.5">Licensed &amp; insured</p>
              </div>
            </div>
            <div className="bg-white border-2 border-ink-900 shadow-card rounded-2xl p-4 flex items-start gap-3 text-left hover:border-violet-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Leaf className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-ink-900 text-sm leading-tight">Eco-Friendly</p>
                <p className="text-ink-400 text-xs mt-0.5">Residential &amp; commercial</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Services */}
      <section id="services" className="pt-12 pb-12 bg-white border-y-4 border-ink-900">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-2">What We Do</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-900 mb-2">Our Top Services</h2>
          <p className="text-ink-500 mb-8">Because pest problems need experts like us.</p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.title}
                href="/services"
                className="group p-6 rounded-2xl bg-white border-2 border-ink-900 shadow-card flex flex-col hover:-translate-y-0.5 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-100 border-2 border-ink-900 flex items-center justify-center mb-4">
                  <s.Icon className="w-6 h-6 text-violet-700" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-2">{s.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-violet-700 text-sm font-semibold group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-violet-50">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-ink-900 text-center mb-8">Pest-free in 3 easy steps</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {[
              { n: 1, t: "Tell us what's bugging you", d: "Answer a few quick questions — takes about a minute." },
              { n: 2, t: "Get your quote",             d: "See a clear, no-obligation quote straight away."      },
              { n: 3, t: "We take care of it",         d: "Book a time that suits you and we'll handle the rest." },
            ].map((st) => (
              <li key={st.n} className="bg-white border-2 border-ink-900 shadow-card rounded-2xl p-5 flex gap-4 items-start">
                <span className="w-10 h-10 shrink-0 rounded-full bg-accent-500 border-2 border-ink-900 text-white font-display font-bold text-lg flex items-center justify-center">{st.n}</span>
                <div>
                  <p className="font-bold text-ink-900">{st.t}</p>
                  <p className="text-ink-500 text-sm mt-1">{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-14 md:py-20 bg-dots">
        <div className="max-w-7xl mx-auto px-5">

          {/* Intro: text + photo */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center mb-10 md:mb-14">
            <div>
              <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-2">Why Choose Us</p>
              <div className="w-10 h-[4px] bg-accent-500 rounded-full mb-5" />
              <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-900 leading-tight mb-5">
                Pest problems,<br />powerful{" "}
                <span className="mark-orange text-violet-700">solutions!</span>
              </h2>
              <p className="text-ink-500 text-base md:text-lg leading-relaxed mb-7 max-w-xl">
                Tired of pests crashing your home and causing chaos? At Hire a Pestie we&apos;ve turned pest control into a piece of cake — zero hassle, maximum fun, and innovative prevention so pests don&apos;t come back.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent-500 text-white font-bold rounded-full text-sm"
                >
                  <FileText className="w-4 h-4" /> Get a Free Quote
                </button>
                <a
                  href="tel:0448163783"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border-2 border-ink-900 text-ink-900 font-semibold rounded-full text-sm hover:bg-violet-50 transition-colors"
                >
                  <Phone className="w-4 h-4" /> 0448 163 783
                </a>
              </div>
            </div>

            <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border-2 border-ink-900 shadow-card-lg">
              <Image
                src="/service-residential.jpg"
                alt="Hire a Pestie technician treating a family home"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white border-2 border-ink-900 rounded-2xl px-4 py-3 shadow-[3px_3px_0_0_#1E2328] flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 rounded-full bg-violet-400 border-2 border-ink-900 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-navy-900" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display font-bold text-ink-900 text-sm">&ldquo;Party-Pooping Pests, Be Gone!&rdquo;</span>
                  <span className="block text-ink-500 text-xs">Our service guarantee</span>
                </span>
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { Icon: FileText,    title: "Free quotes",              sub: "No obligation. Fast and easy to book."      },
              { Icon: Leaf,        title: "Eco-friendly",             sub: "Safer solutions for your family and pets."  },
              { Icon: ShieldCheck, title: "Licensed & fully insured", sub: "Your property is in safe hands."            },
              { Icon: Clock,       title: "24/7 availability",        sub: "We work around your schedule."              },
              { Icon: MapPin,      title: "Melbourne, Geelong, Bendigo & Ballarat", sub: "Residential and commercial spaces." },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                className={`bg-white border-2 border-ink-900 rounded-2xl p-5 shadow-card flex flex-col items-start hover:-translate-y-0.5 transition-transform ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 border-2 border-ink-900 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-violet-700" />
                </div>
                <p className="font-display font-bold text-ink-900 text-base leading-snug mb-1">{title}</p>
                <p className="text-ink-500 text-sm leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-violet-600 text-xs font-bold tracking-widest uppercase mb-2">Testimonials</p>
          <div className="w-8 h-[3px] bg-accent-500 rounded-full mb-5" />
          <h2 className="font-display font-black text-3xl md:text-4xl text-ink-900 mb-6">What our customers say</h2>
        </div>

        {/* Scrolls right-to-left; the list is doubled so the loop is seamless. Hover to pause. */}
        <div className="marquee overflow-hidden py-3">
          <div className="marquee-track flex w-max">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <figure
                key={`${t.name}-${idx}`}
                aria-hidden={idx >= testimonials.length}
                className="w-[18.5rem] md:w-80 flex-none mr-5 bg-white border-2 border-ink-900 shadow-card rounded-2xl p-5"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent-500 fill-accent-500" />)}
                </div>
                <blockquote className="text-ink-700 text-sm leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="font-bold text-ink-900 text-sm">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pt-16 pb-14 bg-navy-800 border-t-4 border-violet-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Ready to evict the uninvited guests?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Don&apos;t let pests ruin your party! Get a quote in minutes or call us now.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-4 bg-accent-500 text-white font-bold rounded-xl text-sm hover:bg-accent-600 transition-colors"
            >
              Get a Free Quote
            </button>
            <a
              href="tel:0448163783"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-sm hover:border-white/50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Mobile sticky action bar */}
      {!isChatOpen && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t-4 border-violet-400 px-3 py-2.5 flex gap-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <a href="tel:0448163783" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-ink-900 font-bold text-sm text-ink-900 bg-white">
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <button onClick={() => setIsChatOpen(true)} className="flex-[1.4] flex items-center justify-center gap-2 py-3 rounded-full bg-accent-500 text-white font-bold text-sm">
            <FileText className="w-4 h-4" /> Get a Quote
          </button>
        </div>
      )}
      <div className="md:hidden h-20" aria-hidden />

      {/* AI Quote Chat Modal */}
      <QuoteChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
