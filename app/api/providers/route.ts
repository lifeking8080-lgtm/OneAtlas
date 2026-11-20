import { handle } from "@/lib/api";
import { listProviders } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = () => handle(listProviders);
