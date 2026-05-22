import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM pages ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, slug, content, status, template } = await req.json();
  const published_at = status === "published" ? new Date().toISOString() : null;
  const { rows } = await pool.query(
    `INSERT INTO pages (title, slug, content, status, template, published_at)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, slug, content, status || "draft", template || "default", published_at]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
