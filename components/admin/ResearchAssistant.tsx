"use client";
import { useState } from "react";
import type { ResearchDraft } from "@/lib/research/schema";

type Draft = ResearchDraft;
const UNKNOWN = "unknown";

// Text <-> nullable helpers: empty field = unknown (null). Never auto-filled.
const s = (v: string | null | undefined) => v ?? "";
const toStr = (v: string) => (v.trim() === "" ? null : v);
const toNum = (v: string) => { const n = Number(v); return v.trim() === "" || !isFinite(n) ? null : n; };

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <input className="input mt-1" type={type} value={value} placeholder={UNKNOWN} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function ResearchAssistant() {
  const [name, setName] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [result, setResult] = useState<string>("");

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setDraft(null); setResult(""); setExists(false);
    try {
      const r = await fetch("/api/admin/ai-research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ modelName: name }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Research failed");
      setDraft(d.draft);
    } catch (x: any) { setError(x.message); } finally { setBusy(false); }
  }

  async function approve(updateExisting = false) {
    if (!draft) return;
    setSaving(true); setError(""); setResult("");
    try {
      const r = await fetch("/api/admin/ai-research/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ draft, updateExisting }) });
      const d = await r.json();
      if (r.status === 409 && d.code === "EXISTS") { setExists(true); setError(d.error); return; }
      if (!r.ok) throw new Error(d.error || "Save failed");
      setExists(false);
      setResult(`Saved "${draft.model.name}" (${d.pricingSaved} pricing row(s), ${d.benchSaved} benchmark result(s)).` + (d.warnings?.length ? ` Skipped: ${d.warnings.join(" ")}` : ""));
      setDraft(null);
    } catch (x: any) { setError(x.message); } finally { setSaving(false); }
  }

  const setModel = (p: Partial<Draft["model"]>) => setDraft((d) => d && { ...d, model: { ...d.model, ...p } });
  const setCompany = (p: Partial<Draft["model"]["company"]>) => setDraft((d) => d && { ...d, model: { ...d.model, company: { ...d.model.company, ...p } } });
  const upd = <K extends "providers" | "pricing" | "benchmarks">(k: K, i: number, p: Partial<Draft[K][number]>) =>
    setDraft((d) => d && ({ ...d, [k]: d[k].map((row, j) => (j === i ? { ...row, ...p } : row)) } as Draft));
  const del = (k: "providers" | "pricing" | "benchmarks", i: number) => setDraft((d) => d && ({ ...d, [k]: d[k].filter((_, j) => j !== i) } as Draft));

  return (
    <section className="card p-5">
      <h2 className="text-xl font-semibold">AI Research Assistant (Groq + LangSearch)</h2>
      <p className="mt-1 text-sm text-slate-400">Enter a new AI model name. The assistant searches the web, extracts structured data, and shows an editable preview. Nothing is saved until you approve.</p>
      <form onSubmit={run} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input className="input" placeholder="e.g. Llama 4 Maverick" maxLength={120} required value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn shrink-0" disabled={busy || saving}>{busy ? "Researching…" : "Research model"}</button>
      </form>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {result && <p className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{result}</p>}

      {draft && (
        <div className="mt-5 space-y-6">
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            Preview only — nothing has been saved. Empty fields are <b>unknown</b> and will be stored as unknown. Verify every value against its source URL, edit as needed, then approve.
          </div>

          <div>
            <h3 className="font-semibold">Group 1 — AI Model</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Field label="Model name" value={draft.model.name} onChange={(v) => setModel({ name: v })} />
              <Field label="Slug" value={draft.model.slug} onChange={(v) => setModel({ slug: v })} />
              <Field label="Category" value={s(draft.model.category)} onChange={(v) => setModel({ category: toStr(v) })} />
              <Field label="Modalities (comma separated)" value={draft.model.modalities.join(", ")} onChange={(v) => setModel({ modalities: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
              <Field label="Context window (tokens)" value={s(draft.model.contextWindow?.toString())} onChange={(v) => { const n = toNum(v); setModel({ contextWindow: n === null ? null : Math.round(n) }); }} />
              <Field label="Release date (YYYY-MM-DD)" value={s(draft.model.releaseDate)} onChange={(v) => setModel({ releaseDate: toStr(v) })} />
              <Field label="Input price (USD / 1M tokens)" value={s(draft.model.inputPrice?.toString())} onChange={(v) => setModel({ inputPrice: toNum(v) })} />
              <Field label="Output price (USD / 1M tokens)" value={s(draft.model.outputPrice?.toString())} onChange={(v) => setModel({ outputPrice: toNum(v) })} />
              <Field label="Company" value={s(draft.model.company.name)} onChange={(v) => setCompany({ name: toStr(v) })} />
              <Field label="Company website" value={s(draft.model.company.website)} onChange={(v) => setCompany({ website: toStr(v) })} />
              <Field label="Source URL" value={s(draft.model.sourceUrl)} onChange={(v) => setModel({ sourceUrl: toStr(v) })} />
            </div>
            <label className="mt-3 block text-xs text-slate-400">Description
              <textarea className="input mt-1 min-h-[70px]" value={s(draft.model.description)} placeholder={UNKNOWN} onChange={(e) => setModel({ description: toStr(e.target.value) })} />
            </label>
          </div>

          <div>
            <h3 className="font-semibold">Group 2 — Providers ({draft.providers.length})</h3>
            {draft.providers.length === 0 && <p className="mt-1 text-sm text-slate-500">No providers found.</p>}
            {draft.providers.map((p, i) => (
              <div key={i} className="mt-2 rounded-lg border border-line p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Provider name" value={p.name} onChange={(v) => upd("providers", i, { name: v })} />
                  <Field label="Website" value={s(p.website)} onChange={(v) => upd("providers", i, { website: toStr(v) })} />
                  <Field label="Description" value={s(p.description)} onChange={(v) => upd("providers", i, { description: toStr(v) })} />
                  <Field label="Model availability" value={s(p.modelAvailability)} onChange={(v) => upd("providers", i, { modelAvailability: toStr(v) })} />
                </div>
                <button type="button" className="mt-2 text-xs text-red-300" onClick={() => del("providers", i)}>Remove</button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Group 3 — Pricing ({draft.pricing.length})</h3>
            {draft.pricing.length === 0 && <p className="mt-1 text-sm text-slate-500">No pricing found.</p>}
            {draft.pricing.map((p, i) => (
              <div key={i} className="mt-2 rounded-lg border border-line p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Model name" value={p.modelName} onChange={(v) => upd("pricing", i, { modelName: v })} />
                  <Field label="Provider name" value={p.providerName} onChange={(v) => upd("pricing", i, { providerName: v })} />
                  <Field label="Input price" value={s(p.inputPrice?.toString())} onChange={(v) => upd("pricing", i, { inputPrice: toNum(v) })} />
                  <Field label="Output price" value={s(p.outputPrice?.toString())} onChange={(v) => upd("pricing", i, { outputPrice: toNum(v) })} />
                  <Field label="Currency" value={s(p.currency)} onChange={(v) => upd("pricing", i, { currency: toStr(v) })} />
                  <Field label="Last updated (YYYY-MM-DD)" value={s(p.lastUpdated)} onChange={(v) => upd("pricing", i, { lastUpdated: toStr(v) })} />
                  <Field label="Source URL" value={s(p.sourceUrl)} onChange={(v) => upd("pricing", i, { sourceUrl: toStr(v) })} />
                </div>
                <button type="button" className="mt-2 text-xs text-red-300" onClick={() => del("pricing", i)}>Remove</button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Group 4 — Benchmarks ({draft.benchmarks.length})</h3>
            {draft.benchmarks.length === 0 && <p className="mt-1 text-sm text-slate-500">No benchmarks found.</p>}
            {draft.benchmarks.map((b, i) => (
              <div key={i} className="mt-2 rounded-lg border border-line p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Benchmark name" value={b.name} onChange={(v) => upd("benchmarks", i, { name: v })} />
                  <Field label="Category" value={s(b.category)} onChange={(v) => upd("benchmarks", i, { category: toStr(v) })} />
                  <Field label="Score" value={s(b.score?.toString())} onChange={(v) => upd("benchmarks", i, { score: toNum(v) })} />
                  <Field label="Unit" value={s(b.unit)} onChange={(v) => upd("benchmarks", i, { unit: toStr(v) })} />
                  <Field label="Measurement date (YYYY-MM-DD)" value={s(b.measurementDate)} onChange={(v) => upd("benchmarks", i, { measurementDate: toStr(v) })} />
                  <Field label="Source URL" value={s(b.sourceUrl)} onChange={(v) => upd("benchmarks", i, { sourceUrl: toStr(v) })} />
                </div>
                <button type="button" className="mt-2 text-xs text-red-300" onClick={() => del("benchmarks", i)}>Remove</button>
              </div>
            ))}
          </div>

          {draft.unknowns.length > 0 && (
            <div>
              <h3 className="font-semibold">Unknown / not found</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-400">{draft.unknowns.map((u, i) => <li key={i}>{u}</li>)}</ul>
            </div>
          )}
          <details className="text-sm text-slate-400">
            <summary className="cursor-pointer">Search sources ({draft.sources.length})</summary>
            <ul className="mt-2 space-y-1">{draft.sources.map((x, i) => <li key={i}><a className="text-sky-300 underline" href={x.url} target="_blank" rel="noopener noreferrer">{x.title || x.url}</a></li>)}</ul>
          </details>

          <div className="flex flex-wrap gap-3">
            {exists
              ? <button className="btn" disabled={saving} onClick={() => approve(true)}>{saving ? "Saving…" : "Update existing model & save"}</button>
              : <button className="btn" disabled={saving} onClick={() => approve(false)}>{saving ? "Saving…" : "Approve & save to database"}</button>}
            <button className="btn" disabled={saving} onClick={() => { setDraft(null); setExists(false); setError(""); }}>Discard</button>
          </div>
        </div>
      )}
    </section>
  );
}
