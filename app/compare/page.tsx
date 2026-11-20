import { Empty } from "@/components/States";
import { compareModels, ctx, date, money } from "@/lib/queries";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Compare({ searchParams }: { searchParams: { m?: string | string[] } }) {
  const sel = (Array.isArray(searchParams.m) ? searchParams.m : searchParams.m ? [searchParams.m] : []).slice(0, 4);
  const [all, picked] = await Promise.all([prisma.aIModel.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }), sel.length ? compareModels(sel) : Promise.resolve([])]);
  const best = (vals: (number | null)[], low: boolean) => { const v = vals.filter((x): x is number => x != null); return v.length > 1 && new Set(v).size > 1 ? (low ? Math.min(...v) : Math.max(...v)) : null; };
  const bIn = best(picked.map((m) => m.inputPrice), true), bOut = best(picked.map((m) => m.outputPrice), true), bCtx = best(picked.map((m) => m.contextWindow), false);
  const caps = Array.from(new Set(picked.flatMap((m) => m.capabilities.map((c) => c.name)))).sort();
  const bms = Array.from(new Map(picked.flatMap((m) => m.results.map((r) => [r.benchmarkId, r.benchmark] as const))).values());
  const hi = (on: boolean) => (on ? "bg-violet/20 font-semibold" : "");
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Compare models</h1>
      <form className="card p-4"><p className="mb-2 text-sm text-slate-400">Select 2 to 4 models.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{all.map((a) => <label key={a.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" name="m" value={a.slug} defaultChecked={sel.includes(a.slug)} />{a.name}</label>)}</div>
        <button className="btn mt-3">Compare</button></form>
      {picked.length < 2 ? <Empty title="Pick at least two models" hint="Highlighted cells show the lowest price and the largest context window." /> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
          <thead><tr className="text-slate-400"><th className="p-3"></th>{picked.map((m) => <th key={m.id} className="p-3 text-white">{m.name}<div className="text-xs font-normal text-slate-400">{m.company.name}</div></th>)}</tr></thead>
          <tbody className="[&_td]:p-3 [&_th]:p-3 [&_th]:font-normal [&_th]:text-slate-400 [&_tr]:border-t [&_tr]:border-line">
            <tr><th>Input / 1M tokens</th>{picked.map((m) => <td key={m.id} className={hi(m.inputPrice === bIn)}>{money(m.inputPrice)}</td>)}</tr>
            <tr><th>Output / 1M tokens</th>{picked.map((m) => <td key={m.id} className={hi(m.outputPrice === bOut)}>{money(m.outputPrice)}</td>)}</tr>
            <tr><th>Context window</th>{picked.map((m) => <td key={m.id} className={hi(m.contextWindow === bCtx)}>{ctx(m.contextWindow)}</td>)}</tr>
            <tr><th>Modalities</th>{picked.map((m) => <td key={m.id}>{m.modalities.join(", ")}</td>)}</tr>
            <tr><th>Released</th>{picked.map((m) => <td key={m.id}>{date(m.releaseDate)}</td>)}</tr>
            {caps.map((c) => <tr key={c}><th>{c}</th>{picked.map((m) => <td key={m.id}>{m.capabilities.some((x) => x.name === c) ? "Yes" : "No"}</td>)}</tr>)}
            {bms.map((b) => { const sc = picked.map((m) => m.results.find((r) => r.benchmarkId === b.id)?.score ?? null); const top = best(sc, false); return <tr key={b.id}><th>{b.name}</th>{sc.map((s, i) => <td key={i} className={hi(s != null && s === top)}>{s ?? "n/a"}</td>)}</tr>; })}
          </tbody></table></div>)}
    </div>
  );
}
