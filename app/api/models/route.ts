import { handle } from "@/lib/api";
import { listModels, parseParams } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = (req: Request) => handle(() => listModels(parseParams(Object.fromEntries(new URL(req.url).searchParams))));
