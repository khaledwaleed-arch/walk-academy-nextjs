import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT * FROM pages WHERE id=$1", [id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title, slug, content, status, template } = await req.json();

  const existing = await pool.query("SELECT status, published_at FROM pages WHERE id=$1", [id]);
  const wasPublished = existing.rows[0]?.status === "published";
  let published_at = existing.rows[0]?.published_at;
  if (status === "published" && !wasPublished) published_at = new Date().toISOString();
  if (status === "draft") published_at = null;

  const { rows } = await pool.query(
    `UPDATE pages SET title=$1, slug=$2, content=$3, status=$4, template=$5, published_at=$6, updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [title, slug, content, status, template || "default", published_at, id]
  );
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM pages WHERE id=$1", [id]);
  return NextResponse.json({ success: true });
}
