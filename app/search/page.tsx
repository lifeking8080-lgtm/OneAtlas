import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { Empty } from "@/components/States";
import { search } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim().slice(0, 100);
  if (!q) return <Empty title="Type something to search" />;
  const r = await search(q);
  const none = !r.models.length && !r.providers.length && !r.companies.length;
  return (
    <div className="space-y-6"><h1 className="text-3xl font-bold">Results for “{q}”</h1>
      {none && <Empty title="No matches" hint="Try a model, lab or provider name." />}
      {r.models.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{r.models.map((m) => <ModelCard key={m.id} m={m} />)}</div>}
      {r.companies.length > 0 && <div><h2 className="mb-2 font-semibold">AI labs</h2><Link href="/labs" className="chip">{r.companies.map((c) => c.name).join(", ")}</Link></div>}
      {r.providers.length > 0 && <div><h2 className="mb-2 font-semibold">Providers</h2><Link href="/providers" className="chip">{r.providers.map((c) => c.name).join(", ")}</Link></div>}</div>
  );
}
