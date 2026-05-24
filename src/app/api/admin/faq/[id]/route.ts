import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { question_en, question_ar, answer_en, answer_ar, sort_order, is_visible } = await req.json();
  try {
    const { rows } = await pool.query(
      `UPDATE faq_items SET question_en=$1, question_ar=$2, answer_en=$3, answer_ar=$4,
       sort_order=$5, is_visible=$6 WHERE id=$7 RETURNING *`,
      [question_en, question_ar, answer_en, answer_ar, sort_order, is_visible, id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM faq_items WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
