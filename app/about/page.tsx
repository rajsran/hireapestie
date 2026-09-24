import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Droplets, Shield } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Quality First",
    desc: "We never cut corners. Every turf, every roof — cleaned or repaired to the highest standard.",
  },
  {
    icon: Users,
    title: "Trusted Customers",
    desc: "Melbourne's most trusted turf cleaning company — built on word-of-mouth and glowing customer reviews.",
  },
  {
    icon: MapPin,
    title: "All Melbourne Suburbs",
    desc: "Based in Tarneit, we service every suburb across Melbourne — north, south, east and west.",
  },
  {
    icon: Droplets,
    title: "Safe & Respectful",
    desc: "We treat your property like our own — no mess, no damage, and always a thorough clean-up.",
  },
];

export const metadata = {
  title: "About Us | Melbourne Turf Cleaning Experts",
  description:
    "Turf Clean Pros is Melbourne's most trusted turf cleaning company. Thousands of happy customers, top-rated on Google, fully insured, all suburbs covered.",
  openGraph: {
    title: "About Turf Clean Pros | Melbourne's Most Trusted Turf Cleaners",
    description:
      "Melbourne's most trusted turf cleaners. Thousands of happy customers, top-rated on Google, fully insured. Based in Tarneit, all suburbs serviced.",
    url: "https://www.turfcleanpros.com.au/about",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-violet-600 text-xs font-semibold tracking-widest uppercase mb-2">Our Story</p>
          <h1 className="font-display font-black text-4xl md:text-6xl text-ink-900 mb-3">About Turf Clean Pros</h1>
          <p className="text-ink-500 text-base md:text-lg max-w-2xl">
            Keeping Melbourne&apos;s turfs clean, safe, and flowing — proudly serving thousands of happy customers.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden shadow-card-lg">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
              alt="Turf Clean Pros at work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-violet-600 px-4 py-2 rounded-xl shadow-violet">
              <p className="text-white font-bold text-sm">Turf Clean Pros</p>
              <p className="text-violet-200 text-xs">Melbourne&apos;s Largest Turf Cleaner</p>
            </div>
          </div>

          <div>
            <h2 className="font-display font-black text-2xl md:text-4xl text-ink-900 mb-3">
              Melbourne&apos;s most trusted turf cleaners.
            </h2>
            <div className="space-y-3 text-ink-500 text-sm md:text-base leading-relaxed">
              <p>
                Turf Clean Pros was founded with a simple mission: provide Melbourne homeowners and businesses with a fast, reliable, and fully insured turf cleaning service they can trust.
              </p>
              <p>
                We&apos;ve grown to become Melbourne&apos;s largest turf cleaning company — serving every suburb from our base in Tarneit. Trusted by thousands of happy customers, our reputation speaks for itself.
              </p>
              <p>
                Whether it&apos;s a residential home, a commercial building, roof cleaning, repairs, or turf cleaning installation — we handle it all with care and professionalism.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-full shadow-violet hover:bg-violet-700 transition-colors"
            >
              Get a free quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-8 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="mb-6 md:mb-14">
            <p className="text-violet-600 text-xs font-semibold tracking-widest uppercase mb-2">What We Stand For</p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-ink-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="p-4 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-lg transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-3 border border-violet-100">
                  <v.icon className="w-4 h-4 text-violet-600" />
                </div>
                <h3 className="text-ink-900 font-semibold text-sm mb-1">{v.title}</h3>
                <p className="text-ink-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 pb-14 bg-ink-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600 rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display font-black text-4xl text-white mb-4">Ready to get started?</h2>
          <p className="text-white/60 mb-8">Call us or request a quote — we&apos;ll get back to you fast.</p>
          <div className="flex flex-row justify-center gap-4">
            <Link href="/contact" className="flex-1 max-w-[200px] text-center px-6 py-4 bg-violet-600 text-white font-bold rounded-full text-sm shadow-violet hover:bg-violet-700 transition-colors">
              Free Quote
            </Link>
            <a href="tel:0474226785" className="flex-1 max-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/20 text-white font-semibold rounded-full text-sm hover:border-white/50 transition-colors">
              0474 226 785
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
