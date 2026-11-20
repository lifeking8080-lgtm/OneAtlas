import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import { Empty, DemoNote } from "@/components/States";
import { filterOptions, listModels, parseParams } from "@/lib/queries";
export const dynamic = "force-dynamic";
type SP = Record<string, string | string[] | undefined>;
export default async function Models({ searchParams }: { searchParams: SP }) {
  const q = parseParams(searchParams);
  const [res, f] = await Promise.all([listModels(q), filterOptions()]);
  const href = (page: number) => { const p = new URLSearchParams(); Object.entries(q).forEach(([k, v]) => v && k !== "page" && k !== "pageSize" && p.set(k, String(v))); p.set("page", String(page)); return `/models?${p}`; };
  const Sel = ({ name, label, opts }: { name: string; label: string; opts: [string, string][] }) => (
    <select name={name} defaultValue={((q as Record<string, unknown>)[name] as string) ?? ""} className="input" aria-label={label}><option value="">{label}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
  );
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Models</h1>
      <form className="card grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <input name="q" defaultValue={q.q} placeholder="Search by name" className="input" aria-label="Search by name" />
        <Sel name="company" label="Any company" opts={f.companies.map((c) => [c.slug, c.name])} />
        <Sel name="provider" label="Any provider" opts={f.providers.map((c) => [c.slug, c.name])} />
        <Sel name="capability" label="Any capability" opts={f.capabilities.map((c) => [c, c])} />
        <Sel name="category" label="Any category" opts={f.categories.map((c) => [c, c])} />
        <Sel name="sort" label="Sort" opts={[["newest", "Newest first"], ["name", "Name"], ["price_asc", "Input price: low to high"], ["price_desc", "Input price: high to low"], ["context_desc", "Context window: largest"]]} />
        <button className="btn">Apply</button><Link href="/models" className="btn !bg-line !text-slate-200">Reset</Link>
      </form>
      <div className="flex items-center justify-between text-sm text-slate-400"><span>{res.total} models</span><DemoNote /></div>
      {res.items.length === 0 ? <Empty title="No models match these filters" hint="Remove a filter or reset the search." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{res.items.map((m) => <ModelCard key={m.id} m={m} />)}</div>}
      <nav className="flex items-center justify-center gap-3 text-sm" aria-label="Pagination">
        {res.page > 1 && <Link className="btn" href={href(res.page - 1)}>Previous</Link>}
        <span>Page {res.page} of {res.pages}</span>
        {res.page < res.pages && <Link className="btn" href={href(res.page + 1)}>Next</Link>}
      </nav>
    </div>
  );
}
