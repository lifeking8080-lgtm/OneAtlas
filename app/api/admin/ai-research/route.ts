import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { researchSearch, SearchConfigError } from "@/lib/search/langsearch";
import { extractDraft } from "@/lib/research/extract";
import { AIConfigError } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Step 1–3: search + extract. Read-only: nothing is written to the database here.
export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (!auth.user) return auth.response!;
  const body = await req.json().catch(() => ({}));
  const modelName = typeof body?.modelName === "string" ? body.modelName.trim() : "";
  if (modelName.length < 2 || modelName.length > 120) return NextResponse.json({ error: "Enter a model name (2–120 characters)." }, { status: 400 });
  try {
    const hits = await researchSearch(modelName);
    if (!hits.length) return NextResponse.json({ error: "No search results found for that model name." }, { status: 404 });
    const draft = await extractDraft(modelName, hits);
    return NextResponse.json({ draft, note: "Draft only. Nothing has been saved to the database." });
  } catch (e: any) {
    if (e instanceof AIConfigError || e instanceof SearchConfigError) return NextResponse.json({ error: e.message }, { status: 503 });
    console.error("ai-research failed:", e?.message);
    return NextResponse.json({ error: e?.message || "Research failed." }, { status: 502 });
  }
}
