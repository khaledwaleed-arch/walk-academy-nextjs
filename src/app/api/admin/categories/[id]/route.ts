import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { name, slug, description } = await req.json();
  const { rows } = await pool.query("UPDATE categories SET name=$1, slug=$2, description=$3 WHERE id=$4 RETURNING *", [name, slug, description, id]);
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM categories WHERE id=$1", [id]);
  return NextResponse.json({ success: true });
}
