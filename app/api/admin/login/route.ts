import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, owner = process.env.SUPER_ADMIN_USER_ID;
  if (!url || !key || !owner) return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  const auth = await fetch(`${url}/auth/v1/token?grant_type=password`, { method: "POST", headers: { "Content-Type": "application/json", apikey: key }, body: JSON.stringify({ email, password }), cache: "no-store" });
  const data = await auth.json();
  if (!auth.ok || !data.access_token || data.user?.id !== owner) return NextResponse.json({ error: "Login failed or this account is not the configured Super Admin" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, data.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: Math.min(data.expires_in || 3600, 3600) });
  return response;
}
