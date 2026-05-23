import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order, visible } = await req.json();
  const { rows } = await pool.query(
    `UPDATE services SET slug=$1, icon=$2, title_en=$3, title_ar=$4, desc_en=$5, desc_ar=$6,
     sort_order=$7, visible=$8 WHERE id=$9 RETURNING *`,
    [slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order, visible, id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM services WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
