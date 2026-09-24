"use client";

import { Phone, MapPin, Clock, Mail } from "lucide-react";

export default function ContactClient() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-violet-600 text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h1 className="font-display font-black text-5xl md:text-6xl text-ink-900 mb-4">Contact Us</h1>
          <p className="text-ink-500 text-lg max-w-2xl">
            Ready for a free quote? Give us a call or send us a message and we&apos;ll get back to you fast.
          </p>
        </div>
      </section>

      {/* Contact details */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-bold text-2xl text-ink-900 mb-8">Contact Details</h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Phone</p>
                <a href="tel:0420104774" className="text-ink-900 font-semibold hover:text-violet-600 transition-colors block">0420 104 774</a>
                <a href="tel:0391218020" className="text-ink-900 font-semibold hover:text-violet-600 transition-colors block">03 9121 8020 (Landline)</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Address</p>
                <p className="text-ink-900 font-semibold">Tarneit VIC 3029</p>
                <p className="text-ink-500">Servicing all Melbourne suburbs</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Business Hours</p>
                <p className="text-ink-900 font-semibold">Monday – Friday</p>
                <p className="text-ink-500">8:00 am – 4:00 pm</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-ink-300 text-xs uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:admin@turfcleanpros.com.au" className="text-ink-900 font-semibold hover:text-violet-600 transition-colors block">admin@turfcleanpros.com.au</a>
              </div>
            </li>
          </ul>

          {/* Map placeholder */}
          <div className="mt-10 aspect-video rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-card">
            <div className="text-center text-ink-300">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Tarneit VIC 3029</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
