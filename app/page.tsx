import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { prisma } from "@/lib/db";
import { stats, listModels, parseParams } from "@/lib/queries";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [s, featured, recent, providers] = await Promise.all([
    stats(),
    prisma.aIModel.findMany({ where: { featured: true }, take: 3, include: { company: true, capabilities: true } }),
    listModels(parseParams({ sort: "newest", pageSize: 3 })),
    prisma.provider.findMany({ take: 6, orderBy: { pricing: { _count: "desc" } }, include: { _count: { select: { pricing: true } } } }),
  ]);
  const tiles: [number, string][] = [[s.models, "models"], [s.companies, "AI labs"], [s.providers, "providers"], [s.benchmarkResults, "sourced benchmark results"]];
  return (
    <div className="space-y-12">
      <section className="pt-6">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Find the right AI model before you write a line of code.</h1>
        <p className="mt-4 max-w-xl text-slate-300">Browse models from every major lab, compare price and context side by side, and see which providers serve them.</p>
        <form action="/search" className="mt-6 flex max-w-lg gap-2"><input name="q" required placeholder="Try “Claude” or “open weights”" className="input" aria-label="Search" /><button className="btn">Search</button></form>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map(([n, l]) => <div key={l} className="card p-4"><dt className="text-2xl font-bold text-violet">{n}</dt><dd className="text-xs text-slate-400">{l}</dd></div>)}
        </dl>
      </section>
      <section><h2 className="mb-3 text-xl font-semibold">Featured models</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.map((m) => <ModelCard key={m.id} m={m} />)}</div></section>
      <section><div className="mb-3 flex items-baseline justify-between"><h2 className="text-xl font-semibold">Recently released</h2><Link href="/models" className="text-sm text-sky">All models</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recent.items.map((m) => <ModelCard key={m.id} m={m} />)}</div></section>
      <section><h2 className="mb-3 text-xl font-semibold">Popular providers</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{providers.map((p) => <Link key={p.id} href="/providers" className="card p-4 hover:border-violet"><div className="font-semibold">{p.name}</div><div className="text-sm text-slate-400">{p._count.pricing} models listed</div></Link>)}</div></section>
    </div>
  );
}
