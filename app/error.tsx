"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-xl font-bold">Could not load data</h1>
      <p className="mt-2 text-sm text-slate-400">Check that DATABASE_URL and DIRECT_URL are set, the schema is pushed and the database is seeded.</p>
      <button onClick={reset} className="btn mt-4">Try again</button>
    </div>
  );
}
