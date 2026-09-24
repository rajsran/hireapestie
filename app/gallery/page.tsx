import Link from "next/link";

export const metadata = {
  title: "Gallery | Turf Cleaning Before & After Photos Melbourne",
  description:
    "See real before and after photos of turf cleaning jobs completed by Turf Clean Pros across Melbourne. Residential and commercial turf cleaning results.",
  openGraph: {
    title: "Turf Cleaning Gallery | Before & After Photos Melbourne",
    description:
      "Real before and after turf cleaning photos from jobs across all Melbourne suburbs.",
    url: "https://www.turfcleanpros.com.au/gallery",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">Our Work</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-ink-900 mb-4">Gallery</h1>
          <p className="text-ink-500 text-lg max-w-2xl">
            A selection of completed projects from across Melbourne&apos;s western suburbs. Real work, real results.
          </p>
        </div>
      </section>

      {/* Empty state */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-ink-400 text-base mb-6">Photos coming soon. Check back after your next job!</p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl text-sm shadow-violet hover:bg-violet-700 transition-colors"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
