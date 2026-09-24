"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AcceptForm() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead") ?? "";
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId || !address.trim()) return;
    setStatus("loading");
    const res = await fetch("/api/quote/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, address }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (!leadId) {
    return (
      <div className="text-center py-12 text-gray-500">
        Invalid link. Please check your email and try again.
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Thank you! Our team will be in touch within 30 minutes to schedule your job.
        </p>
        <p className="mt-6 text-sm text-gray-400">
          Questions? Call us on{" "}
          <a href="tel:0420104774" className="text-[#1b2d6e] font-semibold">0420 104 774</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Address
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="e.g. 12 Smith Street, Melbourne VIC 3000"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1b2d6e] focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-400">
          We need this to schedule your job and send our team.
        </p>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          Something went wrong. Please call us on 0420 104 774.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !address.trim()}
        className="w-full bg-[#1b5e20] hover:bg-[#145218] disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm transition-colors"
      >
        {status === "loading" ? "Confirming…" : "Confirm Booking"}
      </button>
    </form>
  );
}

export default function AcceptQuotePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1b2d6e] rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Accept Your Quote</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your property address and we&apos;ll take care of the rest.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-400 text-sm">Loading…</div>}>
          <AcceptForm />
        </Suspense>
      </div>
    </div>
  );
}
