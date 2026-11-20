import Link from "next/link";
import { listProviders, money } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function Providers() {
  const ps = await listProviders();
  return (
    <div className="space-y-5"><h1 className="text-3xl font-bold">Providers</h1><p className="text-xs text-amber-300">Listed prices are demo seed data and not verified.</p>
      <div className="grid gap-4">{ps.map((p) => (
        <section key={p.id} className="card p-4"><h2 className="text-lg font-semibold">{p.name} <span className="text-sm font-normal text-slate-400">{p.pricing.length} models</span></h2>
          <p className="text-sm text-slate-300">{p.description}</p><a href={p.website} target="_blank" rel="noopener noreferrer" className="text-sm text-sky">{p.website.replace("https://", "")}</a>
          <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{p.pricing.map((x) => <li key={x.id} className="flex justify-between"><Link href={`/models/${x.model.slug}`} className="hover:text-sky">{x.model.name}</Link><span className="text-slate-400">{money(x.inputPrice)} / {money(x.outputPrice)}</span></li>)}</ul></section>))}</div></div>
  );
}
