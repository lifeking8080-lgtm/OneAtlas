import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const COOKIE = "oneatlas_admin_access";
export async function getAdminUser() {
  const token = cookies().get(COOKIE)?.value;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const owner = process.env.SUPER_ADMIN_USER_ID;
  if (!token || !url || !key || !owner) return null;
  try {
    const res = await fetch(`${url}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return null;
    const user = await res.json();
    if (user.id !== owner) return null;
    return user;
  } catch { return null; }
}
export async function requireSuperAdmin() {
  const user = await getAdminUser();
  if (!user) return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { user, response: null };
}
export const ADMIN_COOKIE = COOKIE;
