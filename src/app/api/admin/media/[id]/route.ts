import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { Pool } from "pg";
import { unlink } from "fs/promises";
import path from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { alt_text } = await req.json();
  const { rows } = await pool.query("UPDATE media SET alt_text=$1 WHERE id=$2 RETURNING *", [alt_text, id]);
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT filename FROM media WHERE id=$1", [id]);
  if (rows[0]) {
    try { await unlink(path.join(process.cwd(), "public", "uploads", rows[0].filename)); } catch {}
    await pool.query("DELETE FROM media WHERE id=$1", [id]);
  }
  return NextResponse.json({ success: true });
}
