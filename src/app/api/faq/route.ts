import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, question_en, question_ar, answer_en, answer_ar, sort_order FROM faq_items WHERE is_visible=true ORDER BY sort_order, id"
  );
  return NextResponse.json(rows, { headers: { "Cache-Control": "public, s-maxage=60" } });
}
