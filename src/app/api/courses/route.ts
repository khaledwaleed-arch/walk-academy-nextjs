import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const { rows } = await pool.query(
    "SELECT * FROM courses WHERE status='published' ORDER BY sort_order, created_at"
  );
  return NextResponse.json(rows);
}
