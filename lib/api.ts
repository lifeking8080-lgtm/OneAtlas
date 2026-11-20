import { NextResponse } from "next/server";
import { ZodError } from "zod";
export async function handle<T>(fn: () => Promise<T | null>) {
  try {
    const data = await fn();
    if (data === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof ZodError) return NextResponse.json({ error: "Invalid request", issues: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
