import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    "SELECT * FROM courses WHERE status='published' ORDER BY sort_order, created_at"
  );
  return NextResponse.json(rows);
}
