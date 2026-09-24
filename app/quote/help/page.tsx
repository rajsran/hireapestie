"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HelpContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead") ?? "";
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!leadId || notified) return;
    setNotified(true);
    fetch("/api/quote/help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    }).catch(() => {});
  }, [leadId, notified]);

  return null;
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">We&apos;re Here to Help</h1>
        <p className="text-gray-500 text-sm mb-8">
          Our team has been notified and will call you back shortly. Or reach us now:
        </p>

        <div className="space-y-3">
          <a
            href="tel:0420104774"
            className="flex items-center justify-center gap-3 w-full bg-[#1b2d6e] text-white font-bold py-3 rounded-lg text-sm hover:bg-[#162558] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call 0420 104 774
          </a>
          <a
            href="tel:0391218020"
            className="flex items-center justify-center gap-3 w-full bg-gray-100 text-[#1b2d6e] font-bold py-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Landline: 03 9121 8020
          </a>
          <a
            href="mailto:admin@turfcleanpros.com.au"
            className="flex items-center justify-center gap-3 w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            admin@turfcleanpros.com.au
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          We&apos;re available Mon&ndash;Sat, 7am&ndash;6pm across all Melbourne suburbs.
        </p>

        <Suspense>
          <HelpContent />
        </Suspense>
      </div>
    </div>
  );
}
