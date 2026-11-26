import type { Metadata, Viewport } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

const SITE_URL = "https://hireapestie.com.au";
const SITE_NAME = "Hire a Pestie";
const DEFAULT_TITLE = "Expert Pest Control Solutions in Melbourne | Hire A Pestie";
const DEFAULT_DESC =
  "Hire a Pestie — your pest inspection & control partner in Melbourne, Geelong, Bendigo and Ballarat. Eco-friendly, licensed, fully insured. Get a quote in minutes. Call 0448 163 783.";

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
    "pest control Melbourne",
    "pest inspection Melbourne",
    "residential pest control Melbourne",
    "commercial pest control Melbourne",
    "pre-construction pest control",
    "termite prevention Melbourne",
    "bed bugs rodents Melbourne",
    "eco-friendly pest control",
    "pest control Geelong",
    "pest control Bendigo",
    "pest control Ballarat",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: "/fevicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/fevicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/fevicon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/fevicon/favicon.ico", sizes: "any" },
    ],
    apple: "/fevicon/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [{ url: "/hero.jpeg", width: 1536, height: 1024, alt: "Hire a Pestie — Pest Control Melbourne" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ["/hero.jpeg"],
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
                    "Eco-friendly, licensed and fully insured pest inspection and control for residential and commercial properties across Melbourne, Geelong, Bendigo and Ballarat.",
                  telephone: "+61448163783",
                  email: "info@hireapestie.com.au",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Melbourne",
                    addressRegion: "VIC",
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
                  priceRange: "$$",
                  areaServed: { "@type": "City", name: "Melbourne" },
                  sameAs: [
                    "https://www.facebook.com/profile.php?id=61594866687026",
                    "https://www.instagram.com/hireapestie",
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
                    telephone: "+61448163783",
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
