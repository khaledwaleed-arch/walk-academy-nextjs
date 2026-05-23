import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    "SELECT id, slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order FROM services WHERE visible=TRUE ORDER BY sort_order, id"
  );
  return NextResponse.json(rows);
}
