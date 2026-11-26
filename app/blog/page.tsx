import type { Metadata } from "next";
import Link from "next/link";
import BlogCover from "@/components/BlogCover";
import { ArrowRight } from "lucide-react";
import { posts, formatDate } from "@/lib/blog";

const DESC =
  "Pest control tips, advice and news from Hire a Pestie — inspections, pre-construction termite protection, pest-proofing your home and keeping your business pest-free.";

export const metadata: Metadata = {
  title: "Blog | Pest Control Tips & Advice",
  description: DESC,
  openGraph: { title: "Blog | Hire a Pestie", description: DESC, url: "https://hireapestie.com.au/blog" },
  alternates: { canonical: "https://hireapestie.com.au/blog" },
};

export default function BlogPage() {
  return (
    <>
      <section className="pt-28 pb-10 bg-dots border-b-4 border-ink-900">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-3">Blog</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-ink-900 mb-3">
            Pest advice, <span className="mark-orange text-violet-700">straight from the pros</span>
          </h1>
          <p className="text-ink-500 text-base md:text-lg max-w-2xl">
            Practical tips to keep your home and business pest-free.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col bg-white border-2 border-ink-900 rounded-2xl overflow-hidden shadow-card hover:-translate-y-0.5 transition-transform"
            >
              <div className="relative aspect-[16/10] bg-violet-50 border-b-2 border-ink-900">
                <BlogCover post={p} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <span className="absolute top-3 left-3 bg-white border-2 border-ink-900 rounded-full px-3 py-0.5 text-[11px] font-bold text-ink-900">
                  {p.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-ink-300 text-xs mb-2">{formatDate(p.date)} · {p.readMinutes} min read</p>
                <h2 className="font-display font-bold text-xl text-ink-900 mb-2 leading-snug">{p.title}</h2>
                <p className="text-ink-500 text-sm leading-relaxed flex-1">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-violet-700 text-sm font-semibold group-hover:gap-3 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
