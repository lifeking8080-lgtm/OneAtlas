import { z } from "zod";
import { handle } from "@/lib/api";
import { compareModels } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => handle(() => {
  const slugs = z.array(z.string().min(1).max(100)).min(2).max(4).parse((new URL(req.url).searchParams.get("slugs") ?? "").split(",").filter(Boolean));
  return compareModels(slugs);
});
