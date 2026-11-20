import { handle } from "@/lib/api";
import { getModel } from "@/lib/queries";
export const dynamic = "force-dynamic";
export const GET = (_: Request, { params }: { params: { slug: string } }) => handle(() => getModel(params.slug));
