import Link from "next/link";
import { Empty } from "@/components/States";
import { prisma } from "@/lib/db";
import { rankings } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function Rankings({ searchParams }: { searchParams: { benchmark?: string; category?: string } }) {
  const cats = (await prisma.benchmark.findMany({ distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } })).map((c) => c.category);
  const { benchmarks, active, rows } = await rankings(searchParams.benchmark, searchParams.category);
  const max = Math.max(1, ...rows.map((r) => r.score));
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Rankings</h1>
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/rankings" className="chip">All categories</Link>{cats.map((c) => <Link key={c} href={`/rankings?category=${encodeURIComponent(c)}`} className="chip">{c}</Link>)}
      </div>
      <div className="flex flex-wrap gap-2">{benchmarks.map((b) => <Link key={b.id} href={`/rankings?benchmark=${b.slug}${searchParams.category ? `&category=${encodeURIComponent(searchParams.category)}` : ""}`} className={`btn ${active?.id === b.id ? "" : "!bg-line !text-slate-200"}`}>{b.name}</Link>)}</div>
      {rows.length === 0 ? <Empty title={active ? `No sourced ${active.name} results yet` : "No benchmarks match"} hint="Scores are never invented. Insert BenchmarkResult rows with a source and they appear here ranked." /> : (
        <ol className="card divide-y divide-line">{rows.map((r, i) => <li key={r.id} className="p-3"><div className="flex justify-between text-sm"><span>{i + 1}. <Link href={`/models/${r.model.slug}`} className="text-sky">{r.model.name}</Link> <span className="text-slate-500">{r.model.company.name}</span></span><span>{r.score}{active?.unit}</span></div><div className="mt-2 h-2 rounded bg-ink"><div className="h-2 rounded bg-gradient-to-r from-violet to-sky" style={{ width: `${(r.score / max) * 100}%` }} /></div><div className="mt-1 text-xs text-slate-500">Source: {r.source}</div></li>)}</ol>)}
    </div>
  );
}
