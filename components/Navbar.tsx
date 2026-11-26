"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-4 border-violet-400" style={{ backgroundColor: "#FFFFFF" }}>

      {/* ── Desktop bar ── */}
      <div className="hidden md:flex max-w-7xl mx-auto px-3 py-2.5 items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo.png" alt="Hire a Pestie" width={160} height={48} className="h-12 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm font-medium tracking-wide transition-colors duration-200 ${(pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href + "/"))) ? "text-violet-700 underline underline-offset-8 decoration-4 decoration-accent-500" : "text-ink-700 hover:text-violet-700"}`}>
              {l.label}
            </Link>
          ))}
          <a href="tel:0448163783" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-500 text-white font-bold text-sm">
            <Phone className="w-4 h-4" /> 0448 163 783
          </a>
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="md:hidden flex items-center px-3 py-2 gap-2">

        {/* Left: burger */}
        <button className="flex items-center justify-center shrink-0 w-11 h-11 -ml-1" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X className="w-7 h-7 text-ink-900" /> : <Menu className="w-7 h-7 text-ink-900" />}
        </button>

        {/* Center: logo */}
        <Link href="/" className="flex-1 flex items-center justify-center">
          <Image src="/logo.png" alt="Hire a Pestie" width={120} height={40} className="h-10 w-auto object-contain" priority />
        </Link>

        {/* Right: phone only */}
        <div className="shrink-0">
          <a href="tel:0448163783" aria-label="Call us" className="flex items-center justify-center w-11 h-11">
            <Image src="/callus.png" alt="Call Us" width={28} height={28} className="h-7 w-auto object-contain" />
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-base font-semibold py-2.5 border-b border-gray-100 transition-colors ${
                  (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href + "/"))) ? "text-violet-600" : "text-ink-700"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.instagram.com/hireapestie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                <Image src="/instagram.png" alt="Instagram" width={22} height={22} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594866687026"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="opacity-90 hover:opacity-100 transition-opacity duration-200"
              >
                <Image src="/fb.png" alt="Facebook" width={22} height={22} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
