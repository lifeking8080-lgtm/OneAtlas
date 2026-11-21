import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { approveSchema } from "@/lib/research/schema";
import { saveDraft, ModelExistsError, MissingCompanyError } from "@/lib/research/save";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Runs ONLY when the Super Admin clicks Approve. Saves the (edited) draft.
export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (!auth.user) return auth.response!;

  // Basic CSRF protection: same-origin requests only.
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });

  const parsed = approveSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const msg = parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return NextResponse.json({ error: `Invalid data — ${msg}` }, { status: 400 });
  }
  try {
    const result = await saveDraft(prisma, parsed.data.draft, parsed.data.updateExisting);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    if (e instanceof ModelExistsError) return NextResponse.json({ error: e.message, code: "EXISTS" }, { status: 409 });
    if (e instanceof MissingCompanyError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error("ai-research approve failed:", e?.message);
    return NextResponse.json({ error: "Saving to the database failed. Nothing was saved." }, { status: 500 });
  }
}
