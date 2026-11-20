import { z } from "zod";
import { handle } from "@/lib/api";
import { search } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => handle(() => search(z.string().trim().min(1).max(100).parse(new URL(req.url).searchParams.get("q") ?? "")));
