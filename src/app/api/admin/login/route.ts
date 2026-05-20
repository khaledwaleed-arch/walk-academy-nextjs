import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_SECRET) {
    return NextResponse.json({ token: getAdminToken() });
  }
  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
