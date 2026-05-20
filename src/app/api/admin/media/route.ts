import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
function auth(req: NextRequest) { return (req.headers.get("authorization") || "").replace("Bearer ", "") === process.env.ADMIN_TOKEN; }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM media ORDER BY created_at DESC");
  return NextResponse.json(rows);
}
