import Link from "next/link";
import { ctx, money } from "@/lib/queries";
type Props = { m: { slug: string; name: string; description: string; category: string; contextWindow: number | null; inputPrice: number | null; outputPrice: number | null; isSample: boolean; company: { name: string }; capabilities: { name: string }[] } };
export default function ModelCard({ m }: Props) {
  return (
    <Link href={`/models/${m.slug}`} className="card flex flex-col gap-2 p-4 transition-colors hover:border-violet">
      <div className="flex items-start justify-between gap-2">
        <div><div className="font-semibold">{m.name}</div><div className="text-xs text-slate-400">{m.company.name} · {m.category}</div></div>
        {m.isSample && <span className="sample">Demo data</span>}
      </div>
      <p className="line-clamp-2 text-sm text-slate-300">{m.description}</p>
      <div className="mt-auto flex flex-wrap gap-1">{m.capabilities.slice(0, 3).map((c) => <span key={c.name} className="chip">{c.name}</span>)}</div>
      <div className="flex justify-between border-t border-line pt-2 text-xs text-slate-400">
        <span>{ctx(m.contextWindow)} context</span><span>{money(m.inputPrice)} in / {money(m.outputPrice)} out per 1M</span>
      </div>
    </Link>
  );
}
