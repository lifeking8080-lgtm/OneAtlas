export type SearchHit = { title: string; url: string; snippet: string; summary: string; publishedAt: string | null };
export class SearchConfigError extends Error {}
export class SearchRequestError extends Error {}

// LangSearch Web Search API (free tier available).
export async function langSearch(query: string, count = 8): Promise<SearchHit[]> {
  const apiKey = process.env.LANGSEARCH_API_KEY;
  if (!apiKey) throw new SearchConfigError("LANGSEARCH_API_KEY is not configured on the server.");
  const res = await fetch("https://api.langsearch.com/v1/web-search", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, freshness: "noLimit", summary: true, count }),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 429) throw new SearchRequestError("LangSearch free-tier rate limit reached. Try again shortly.");
    throw new SearchRequestError(body?.message || `LangSearch request failed (${res.status}).`);
  }
  const values: any[] = body?.data?.webPages?.value ?? body?.webPages?.value ?? [];
  return values
    .filter((v) => typeof v?.url === "string" && /^https?:\/\//i.test(v.url))
    .map((v) => ({
      title: String(v.name ?? v.title ?? ""),
      url: v.url,
      snippet: String(v.snippet ?? ""),
      summary: String(v.summary ?? ""),
      publishedAt: v.datePublished ?? v.dateLastCrawled ?? null,
    }));
}

/** Runs several focused queries and merges results by URL. */
export async function researchSearch(modelName: string): Promise<SearchHit[]> {
  const queries = [
    `${modelName} AI model release context window modalities`,
    `${modelName} API pricing per million tokens input output`,
    `${modelName} benchmark results MMLU GPQA SWE-bench`,
    `${modelName} model providers availability`,
  ];
  const settled = await Promise.allSettled(queries.map((q) => langSearch(q, 6)));
  const ok = settled.filter((s): s is PromiseFulfilledResult<SearchHit[]> => s.status === "fulfilled");
  if (!ok.length) {
    const first = settled[0] as PromiseRejectedResult;
    throw first.reason instanceof Error ? first.reason : new SearchRequestError("Search failed.");
  }
  const seen = new Map<string, SearchHit>();
  for (const r of ok) for (const h of r.value) if (!seen.has(h.url)) seen.set(h.url, h);
  return [...seen.values()].slice(0, 20);
}
