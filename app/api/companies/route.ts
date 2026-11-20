import { handle } from "@/lib/api";
import { listCompanies } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = () => handle(listCompanies);
