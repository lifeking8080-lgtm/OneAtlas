import { handle } from "@/lib/api";
import { rankings } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => { const p = new URL(req.url).searchParams; return handle(() => rankings(p.get("benchmark") ?? undefined, p.get("category") ?? undefined)); };
