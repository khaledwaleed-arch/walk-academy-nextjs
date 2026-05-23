import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    "SELECT key, is_visible, sort_order FROM sections ORDER BY sort_order"
  );
  return NextResponse.json(rows);
}
