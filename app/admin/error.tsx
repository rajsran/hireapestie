"use client";

import Link from "next/link";

// Shown instead of a blank crash page when an admin screen fails to load
// (most commonly: DATABASE_URL missing/invalid, or the database is unreachable).
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border-2 border-ink-900 shadow-card p-8 w-full max-w-md text-center">
        <h1 className="font-display font-bold text-2xl text-ink-900 mb-2">This admin page couldn&apos;t load</h1>
        <p className="text-ink-500 text-sm mb-4">
          Usually this means the database isn&apos;t connected. Check that <code className="bg-gray-100 px-1 rounded">DATABASE_URL</code> in
          {" "}<code className="bg-gray-100 px-1 rounded">.env.local</code> is correct, then restart the server and try again.
        </p>
        {error.digest && <p className="text-xs text-gray-400 mb-4">Error ref: {error.digest}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 rounded-xl bg-accent-500 text-white font-bold text-sm">Try again</button>
          <Link href="/admin/login" className="px-5 py-2.5 rounded-xl border-2 border-ink-900 text-ink-900 font-bold text-sm">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
