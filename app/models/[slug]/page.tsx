import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNote, Empty } from "@/components/States";
import { ctx, date, getModel, money } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function ModelPage({ params }: { params: { slug: string } }) {
  const m = await getModel(params.slug);
  if (!m) notFound();
  const facts: [string, string][] = [["Category", m.category], ["Context window", ctx(m.contextWindow)], ["Input price / 1M tokens", money(m.inputPrice)], ["Output price / 1M tokens", money(m.outputPrice)], ["Modalities", m.modalities.join(", ")], ["Release date", date(m.releaseDate)], ["Last updated", date(m.lastUpdated)], ["Source", m.source ?? "n/a"]];
  return (
    <div className="space-y-8">
      <div><Link href="/models" className="text-sm text-sky">All models</Link>
        <h1 className="mt-2 text-3xl font-bold">{m.name} {m.isSample && <span className="sample align-middle">Demo data</span>}</h1>
        <p className="text-slate-400">by <Link href="/labs" className="text-sky">{m.company.name}</Link></p>
        <p className="mt-3 max-w-2xl text-slate-300">{m.description}</p></div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{facts.map(([k, v]) => <div key={k} className="card p-3"><dt className="text-xs text-slate-400">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
      {m.isSample && <DemoNote />}
      <section><h2 className="mb-2 text-xl font-semibold">Capabilities</h2><div className="flex flex-wrap gap-2">{m.capabilities.map((c) => <span key={c.id} className="chip">{c.name}</span>)}</div></section>
      <section><h2 className="mb-2 text-xl font-semibold">Available providers</h2>
        {m.pricing.length === 0 ? <Empty title="No provider listings yet" /> : <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400"><tr><th className="p-3">Provider</th><th>Input / 1M</th><th>Output / 1M</th><th>Verified</th></tr></thead><tbody>{m.pricing.map((p) => <tr key={p.id} className="border-t border-line"><td className="p-3">{p.provider.name}</td><td>{money(p.inputPrice)}</td><td>{money(p.outputPrice)}</td><td>{p.isSample ? "No (demo)" : "Yes"}</td></tr>)}</tbody></table></div>}</section>
      <section><h2 className="mb-2 text-xl font-semibold">Benchmarks</h2>
        {m.results.length === 0 ? <Empty title="No sourced benchmark results for this model" hint="Add rows to BenchmarkResult with a source to show them here." /> : <ul className="card divide-y divide-line">{m.results.map((r) => <li key={r.id} className="flex justify-between p-3 text-sm"><span>{r.benchmark.name}</span><span>{r.score}{r.benchmark.unit} <span className="text-slate-500">({r.source})</span></span></li>)}</ul>}</section>
      <Link href={`/compare?m=${m.slug}`} className="btn">Compare this model</Link>
    </div>
  );
}
