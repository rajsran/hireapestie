export default function InvoicesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
            <h1 className="text-2xl font-black text-gray-900">Invoices</h1>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-green-100 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mt-1.5" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
