"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Phone, Star, Sparkles, Heart, Leaf, Wind, CalendarCheck, Award, Clock, MapPin, FileText, Wrench, ShieldCheck } from "lucide-react";
import QuoteChat from "@/components/QuoteChat";

const services = [
  { Icon: Sparkles,      title: "Synthetic Turf Deep Clean",   desc: "Professional deep clean to restore your synthetic turf — from $150 for up to 25m²." },
  { Icon: Heart,         title: "Pet Odour & Stain Treatment", desc: "Enzyme-based treatment that eliminates pet smells and bacteria at the source."       },
  { Icon: Leaf,          title: "Moss & Algae Removal",        desc: "Bio-safe treatment to remove slippery moss and algae growth from your turf."         },
  { Icon: Wind,          title: "Debris & Leaf Clearing",      desc: "Quick surface clear to remove leaves, bark and debris and restore drainage flow."     },
  { Icon: CalendarCheck, title: "Scheduled Maintenance Plans", desc: "Quarterly visits at 10–15% off standard rates — set and forget turf care."           },
];


const STATIC_HERO = [
  { src: "/hero.jpeg",  alt: "Turf Clean Pros — Professional Turf Cleaning Melbourne" },
  { src: "/logo.png",   alt: "Turf Clean Pros Logo" },
];

function heroSrc(url: string) {
  return url.includes('.private.blob.vercel-storage.com')
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroImages, setHeroImages] = useState(STATIC_HERO);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const heroScrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevHeroSlide = useRef(0);
  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load admin-uploaded hero images, fall back to static if none
  useEffect(() => {
    fetch('/api/hero')
      .then(r => r.json())
      .then(({ urls }: { urls: string[] }) => {
        if (urls.length > 0) {
          setHeroImages(urls.map((src, i) => ({ src: heroSrc(src), alt: `Turf Clean Pros hero ${i + 1}` })));
        }
      })
      .catch(() => {});
  }, []);

  // Sync heroSlide → scroll position (auto-advance + dot clicks)
  useEffect(() => {
    const el = heroScrollRef.current;
    if (!el) return;
    const isWrapping = heroSlide === 0 && prevHeroSlide.current > 0;
    prevHeroSlide.current = heroSlide;
    isProgrammaticScroll.current = true;
    clearTimeout(programmaticScrollTimer.current);
    programmaticScrollTimer.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, isWrapping ? 100 : 600);
    el.scrollTo({ left: heroSlide * el.offsetWidth, behavior: isWrapping ? 'instant' : 'smooth' });
  }, [heroSlide]);

  // Sync scroll position → heroSlide (user swipe only, not programmatic scrolls)
  function onHeroScroll() {
    if (isProgrammaticScroll.current) return;
    clearTimeout(heroScrollTimer.current);
    heroScrollTimer.current = setTimeout(() => {
      const el = heroScrollRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setHeroSlide(idx);
    }, 80);
  }

  // Auto-advance hero every 4 s
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % heroImages.length), 4000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  // ── Marquee (native-scroll approach) ─────────────────────────
  // Uses overflow-x:scroll so the browser handles ALL touch/swipe natively.
  // 3 copies of cards give a full copy-width buffer in both directions.
  // Auto-scroll pauses while the user is touching, resumes on release.
  const scrollRef   = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const isTouching  = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Place the viewport at the start of the 2nd (middle) copy
    // so the user has a full copy-width to swipe left before hitting a boundary
    const init = () => {
      const S = el.scrollWidth / 3;   // width of one copy
      el.scrollLeft = S;
    };
    // Run after first paint so scrollWidth is correct
    const initFrame = requestAnimationFrame(init);

    // ── Auto-scroll loop ────────────────────────────────────────
    const tick = () => {
      if (!isTouching.current) {
        el.scrollLeft += 1;
        // Seamless wrap: stay within the middle copy [S, 2S)
        const S = el.scrollWidth / 3;
        if (el.scrollLeft >= S * 2) el.scrollLeft -= S;
        if (el.scrollLeft <  S)     el.scrollLeft += S;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // ── Pause / resume helpers ──────────────────────────────────
    const pause  = () => {
      isTouching.current = true;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
    const resume = () => {
      // Short delay so momentum scroll finishes before we normalise position
      resumeTimer.current = setTimeout(() => {
        isTouching.current = false;
        // Re-centre into the middle copy so there's always buffer both ways
        const S = el.scrollWidth / 3;
        if (el.scrollLeft >= S * 2) el.scrollLeft -= S;
        if (el.scrollLeft <  S)     el.scrollLeft += S;
      }, 80);
    };

    el.addEventListener('touchstart',  pause,  { passive: true });
    el.addEventListener('touchend',    resume, { passive: true });
    el.addEventListener('touchcancel', resume, { passive: true });
    el.addEventListener('mousedown',   pause);
    window.addEventListener('mouseup', resume);

    return () => {
      cancelAnimationFrame(initFrame);
      cancelAnimationFrame(rafRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      el.removeEventListener('touchstart',   pause);
      el.removeEventListener('touchend',     resume);
      el.removeEventListener('touchcancel',  resume);
      el.removeEventListener('mousedown',    pause);
      window.removeEventListener('mouseup',  resume);
    };
  }, []);
  // ─────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-14 md:flex md:flex-row md:h-screen md:overflow-hidden">

          {/* Hero image slider — native scroll-snap, swipeable */}
          <div className="relative w-full h-56 mb-7 select-none md:w-1/2 md:h-full md:mb-0 md:order-2">
            <div
              ref={heroScrollRef}
              className="flex w-full h-full overflow-x-auto"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={onHeroScroll}
            >
              {heroImages.map((img, i) => (
                <div key={img.src} className="relative flex-none w-full h-full" style={{ scrollSnapAlign: 'start' }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-[60%_center]"
                    priority={i === 0}
                    unoptimized={img.src.startsWith('/api/image')}
                  />
                </div>
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Dot indicators */}
            {heroImages.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-auto">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    className={`rounded-full transition-all duration-300 ${i === heroSlide ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>

        <div className="px-5 pb-10 flex flex-col items-center text-center md:w-1/2 md:order-1 md:items-start md:text-left md:px-16 md:justify-center md:overflow-y-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-700 text-xs font-semibold tracking-wide">Melbourne&apos;s Trusted Turf Specialists</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-[1.65rem] md:text-5xl leading-[1.15] text-ink-900 mb-5">
            Professional Synthetic Turf Cleaning{" "}
            <span className="bg-gradient-to-r from-violet-600 to-accent-500 bg-clip-text text-transparent">
              Across Melbourne
            </span>
          </h1>

          {/* Google rating */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-ink-600 text-sm font-semibold">Top Rated on Google</span>
            <span className="text-ink-300 text-sm">· Verified Reviews</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="btn-pulse relative flex items-center justify-center gap-2.5 w-full md:max-w-sm py-4 md:py-5 bg-gradient-to-b from-violet-500 to-violet-700 text-white font-bold rounded-full active:scale-[0.98] transition-all duration-200 text-base md:text-lg mb-3 overflow-hidden group shadow-[0_4px_24px_rgba(124,58,237,0.55),0_1px_0_rgba(255,255,255,0.18)_inset]"
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
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-start gap-3 text-left hover:border-violet-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-ink-900 text-sm leading-tight">Fully Insured</p>
                <p className="text-ink-400 text-xs mt-0.5">On all workmanship</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-start gap-3 text-left hover:border-violet-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Award className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-ink-900 text-sm leading-tight">All Melbourne</p>
                <p className="text-ink-400 text-xs mt-0.5">Residential &amp; commercial</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Services — infinite marquee */}
      <section id="services" className="pt-10 pb-4 overflow-hidden bg-gradient-to-br from-white via-white to-violet-50">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink-900">Our Services</h2>
        </div>

        {/* Native scroll container — browser handles all touch/swipe, JS adds auto-scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 py-2 px-4 overflow-x-scroll scrollbar-hide select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {[...services, ...services, ...services].map((s, i) => (
            <div
              key={`${s.title}-${i}`}
              className="relative flex-shrink-0 w-72 p-6 rounded-2xl bg-white border border-gray-100 shadow-card flex flex-col"
            >
              {/* Icon circle */}
              <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                <s.Icon className="w-6 h-6 text-violet-600" />
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-ink-900 mb-2">{s.title}</h3>

              {/* Divider */}
              <div className="w-8 h-0.5 bg-violet-600 rounded-full mb-3" />

              {/* Description */}
              <p className="text-ink-400 text-sm leading-relaxed flex-1">{s.desc}</p>

              {/* CTA */}
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-1.5 text-violet-600 text-sm font-semibold hover:gap-3 transition-all duration-200"
              >
                View service <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* Why Us */}
      <section className="pt-8 pb-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">

          {/* Label + underline */}
          <p className="text-violet-600 text-xs font-bold tracking-widest uppercase mb-2">Why Choose Us</p>
          <div className="w-8 h-[3px] bg-violet-600 rounded-full mb-5" />

          {/* Heading */}
          <h2 className="font-display font-black text-4xl text-ink-900 leading-tight mb-5">
            Melbourne&apos;s trusted<br />turf{" "}
            <span className="text-violet-600">specialists.</span>
          </h2>

          {/* Description */}
          <p className="text-ink-500 text-base leading-relaxed mb-8">
            Turf Clean Pros is Melbourne&apos;s largest turf cleaning company — serving happy customers with fast, reliable, and fully insured service across every suburb.
          </p>

          {/* Feature rows */}
          <div className="flex flex-col gap-3">
            {[
              { Icon: FileText,   title: "Free quotes",                        sub: "No obligation. Fast and easy to book."            },
              { Icon: ShieldCheck,title: "Fully licensed & insured",            sub: "Your property is in safe hands."                 },
              { Icon: Award,      title: "Melbourne's most trusted",            sub: "4.9★ rated. Thousands of happy customers."       },
              { Icon: Clock,      title: "Same-day service available",         sub: "We work around your schedule."                   },
              { Icon: MapPin,     title: "All Melbourne suburbs",              sub: "Bonnie Brook-based. We cover everywhere."       },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 shadow-card">
                {/* Icon circle */}
                <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                {/* Vertical divider */}
                <div className="w-px h-10 bg-gray-200 shrink-0" />
                {/* Text */}
                <div>
                  <p className="font-bold text-ink-900 text-sm">{title}</p>
                  <p className="text-ink-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pt-16 pb-14 bg-ink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Ready to start your project?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Call us or send a message and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-4 bg-violet-600 text-white font-bold rounded-xl text-sm shadow-violet hover:bg-violet-700 transition-colors"
            >
              Get a Free Quote
            </button>
            <a
              href="tel:0433240617"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-sm hover:border-white/50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* AI Quote Chat Modal */}
      <QuoteChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
