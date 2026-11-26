import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/blog",     label: "Blog"     },
  { href: "/faq",      label: "FAQ"      },
  { href: "/contact",  label: "Contact Us" },
];

const whatWeDo = [
  { href: "/services#pre-construction-pest-control", label: "Pre-construction Pest Control" },
  { href: "/services#pest-control-inspection",       label: "Pest Inspection"               },
  { href: "/services#residential-pest-control",      label: "Residential Pest Control"      },
  { href: "/services#commercial-pest-control",       label: "Commercial Pest Control"       },
  { href: "/services#pests",                         label: "Pests"                         },
];

// Add the real profile links here — an icon only appears once its URL is filled in.
const socials = [
  { label: "Facebook",  Icon: Facebook,  href: "" },
  { label: "Instagram", Icon: Instagram, href: "" },
  { label: "YouTube",   Icon: Youtube,   href: "" },
].filter((s) => s.href);

const contactItems = [
  { Icon: MapPin, content: "Melbourne, Geelong, Bendigo, Ballarat", href: "https://maps.google.com/?q=Melbourne+VIC" },
  { Icon: Mail,   content: "info@hireapestie.com.au",                href: "mailto:info@hireapestie.com.au" },
  { Icon: Phone,  content: "0448 163 783",                           href: "tel:0448163783" },
];

const headingCls = "font-display font-bold text-xl text-accent-500 mb-5";
const linkCls = "text-ink-700 text-sm hover:text-violet-700 hover:underline underline-offset-4 transition-colors";

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-violet-400 text-ink-900">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.3fr_1.3fr] lg:gap-0">

          {/* Brand */}
          <div className="lg:pr-8 flex flex-col items-start gap-4">
            <Link href="/" aria-label="Hire a Pestie — home">
              <Image src="/logo.png" alt="Hire a Pestie" width={240} height={94} className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-ink-500 text-sm leading-relaxed max-w-[16rem]">
              Your pest inspection &amp; control partner. Eco-friendly, licensed and fully insured.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:border-l lg:border-gray-200 lg:px-8">
            <h3 className={headingCls}>Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ href, label }) => (
                <li key={label}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* What We Do */}
          <div className="lg:border-l lg:border-gray-200 lg:px-8">
            <h3 className={headingCls}>What We Do</h3>
            <ul className="flex flex-col gap-2.5">
              {whatWeDo.map(({ href, label }) => (
                <li key={label}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-8">
            <h3 className={headingCls}>Get in Touch</h3>
            <ul className="flex flex-col gap-3">
              {contactItems.map(({ Icon, content, href }) => (
                <li key={content} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                  <a href={href} className={linkCls}>{content}</a>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {socials.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-md bg-accent-500 text-white flex items-center justify-center hover:bg-accent-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-navy-800 px-5 py-4">
        <p className="text-white/70 text-xs text-center">
          © {new Date().getFullYear()} Hire a Pestie. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
