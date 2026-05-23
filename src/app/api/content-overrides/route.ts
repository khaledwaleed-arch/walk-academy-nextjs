import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const pool = getPool();

// Public: returns all overrides as { en: { "hero.badge": "...", ... }, ar: { ... } }
export async function GET() {
  const { rows } = await pool.query("SELECT lang, key, value FROM content_overrides");
  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!result[row.lang]) result[row.lang] = {};
    result[row.lang][row.key] = row.value;
  }
  return NextResponse.json(result);
}
