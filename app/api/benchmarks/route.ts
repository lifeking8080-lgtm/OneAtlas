import { handle } from "@/lib/api";
import { listBenchmarks } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = () => handle(listBenchmarks);
