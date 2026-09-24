import type { Metadata, Viewport } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

const SITE_URL = "https://www.turfcleanpros.com.au";
const SITE_NAME = "Turf Clean Pros";
const DEFAULT_TITLE = "Turf Clean Pros | Melbourne's #1 Turf Cleaning Service";
const DEFAULT_DESC =
  "Professional synthetic turf cleaning across all Melbourne suburbs. 4.9★ rated on Google. From $150. Call 0433 240 617.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESC,
  keywords: [
    "turf cleaning Melbourne",
    "turf cleaner Melbourne",
    "residential turf cleaning",
    "commercial turf cleaning",
    "synthetic turf cleaning near me",
    "artificial grass cleaning Melbourne",
    "turf deep clean Melbourne",
    "pet odour turf treatment Melbourne",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Turf Clean Pros — Melbourne's #1 Turf Cleaning Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5PCBTXBT');`,
          }}
        />
        <meta name="facebook-domain-verification" content="8zzcgqernph7qmxia6287plusid81g" />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1729439991612263');fbq('track','PageView');`,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1729439991612263&ev=PageView&noscript=1" alt="" />
        </noscript>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HPXEE5CM5T" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HPXEE5CM5T');`,
          }}
        />
      </head>
      <body className="antialiased bg-white text-ink-900">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5PCBTXBT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PublicShell>{children}</PublicShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": `${SITE_URL}/#business`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}/logo.png`,
                  image: `${SITE_URL}/og-image.jpg`,
                  description:
                    "Melbourne's largest synthetic turf cleaning service. Professional residential and commercial turf cleaning across all Melbourne suburbs.",
                  telephone: "+61433240617",
                  email: "admin@turfcleanpros.com.au",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "15 Nokota Circuit",
                    addressLocality: "Bonnie Brook",
                    addressRegion: "VIC",
                    postalCode: "3335",
                    addressCountry: "AU",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: -37.8378,
                    longitude: 144.6954,
                  },
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "08:00",
                      closes: "16:00",
                    },
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "93774",
                    bestRating: "5",
                  },
                  priceRange: "$$",
                  areaServed: { "@type": "City", name: "Melbourne" },
                  sameAs: [
                    "https://www.facebook.com/turfcleanpros",
                    "https://www.instagram.com/turfcleanpros",
                  ],
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#org`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+61433240617",
                    contactType: "customer service",
                    areaServed: "AU",
                    availableLanguage: "English",
                  },
                },
              ],
            }),
          }}
        />

      </body>
    </html>
  );
}
