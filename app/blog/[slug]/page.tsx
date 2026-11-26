import type { Metadata } from "next";
import Link from "next/link";
import BlogCover from "@/components/BlogCover";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { posts, getPost, formatDate } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `https://hireapestie.com.au/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, url, type: "article", ...(post.image ? { images: [post.image] } : {}) },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            ...(post.image ? { image: `https://hireapestie.com.au${post.image}` } : {}),
            author: { "@type": "Organization", name: "Hire a Pestie" },
            publisher: { "@type": "Organization", name: "Hire a Pestie" },
          }),
        }}
      />

      <article>
        <header className="pt-28 pb-8 bg-dots border-b-4 border-ink-900">
          <div className="max-w-3xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-violet-700 text-sm font-semibold mb-5 hover:underline">
              <ArrowLeft className="w-4 h-4" /> All posts
            </Link>
            <p className="text-violet-700 text-xs font-bold tracking-widest uppercase mb-2">{post.category}</p>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-ink-900 leading-tight mb-3">{post.title}</h1>
            <p className="text-ink-500 text-sm">{formatDate(post.date)} · {post.readMinutes} min read</p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-ink-900 shadow-card mb-8">
            <BlogCover post={post} priority sizes="(min-width: 768px) 768px, 100vw" />
          </div>

          <div className="space-y-4 text-ink-700 text-base md:text-lg leading-relaxed">
            {post.content.map((b, i) => {
              if (b.type === "h2") return <h2 key={i} className="font-display font-bold text-2xl text-ink-900 pt-4">{b.text}</h2>;
              if (b.type === "ul")
                return (
                  <ul key={i} className="list-disc pl-6 space-y-1.5 marker:text-violet-600">
                    {b.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                );
              return <p key={i}>{b.text}</p>;
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-navy-800 border-2 border-ink-900 shadow-card p-6 md:p-8 text-center">
            <h2 className="font-display font-bold text-2xl text-white mb-2">Ready to evict the uninvited guests?</h2>
            <p className="text-white/70 mb-5">Get a free, no-obligation quote in minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="px-7 py-3 bg-accent-500 text-white font-bold rounded-full text-sm">Get a Free Quote</Link>
              <a href="tel:0448163783" className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-semibold rounded-full text-sm hover:border-white transition-colors">
                <Phone className="w-4 h-4" /> 0448 163 783
              </a>
            </div>
          </div>

          {others.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display font-bold text-xl text-ink-900 mb-4">Keep reading</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.map((o) => (
                  <Link key={o.slug} href={`/blog/${o.slug}`} className="p-4 bg-white border-2 border-ink-900 rounded-2xl shadow-card hover:-translate-y-0.5 transition-transform">
                    <p className="text-ink-300 text-xs mb-1">{o.category}</p>
                    <p className="font-semibold text-ink-900 leading-snug">{o.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
