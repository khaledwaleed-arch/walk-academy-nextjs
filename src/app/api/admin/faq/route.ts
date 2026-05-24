import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(
    "SELECT * FROM faq_items ORDER BY sort_order, id"
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { question_en, question_ar, answer_en, answer_ar, sort_order, is_visible } = await req.json();
  try {
    const { rows } = await pool.query(
      "INSERT INTO faq_items (question_en, question_ar, answer_en, answer_ar, sort_order, is_visible) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [question_en || "", question_ar || "", answer_en || "", answer_ar || "", sort_order || 0, is_visible !== false]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}
