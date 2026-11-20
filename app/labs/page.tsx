import Link from "next/link";
import { listCompanies } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function Labs() {
  const cs = await listCompanies();
  return (
    <div className="space-y-5"><h1 className="text-3xl font-bold">AI labs</h1>
      <div className="grid gap-4 sm:grid-cols-2">{cs.map((c) => (
        <section key={c.id} className="card p-4"><div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold">{c.name}</h2><span className="text-sm text-slate-400">{c._count.models} models</span></div>
          <p className="mt-1 text-sm text-slate-300">{c.description}</p>
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-sky">{c.website.replace("https://", "")}</a>
          <div className="mt-3 flex flex-wrap gap-2">{c.models.map((m) => <Link key={m.id} href={`/models/${m.slug}`} className="chip hover:border-violet">{m.name}</Link>)}</div></section>))}</div></div>
  );
}
