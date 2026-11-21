import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
export async function GET() { const user = await getAdminUser(); return user ? NextResponse.json({ authenticated: true, email: user.email }) : NextResponse.json({ authenticated: false }, { status: 401 }); }
