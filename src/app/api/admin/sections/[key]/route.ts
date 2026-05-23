import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();

// GET: returns overrides for a section (all langs)
export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await params;

  // Get section info (for custom sections get content too)
  const { rows: sectionRows } = await pool.query("SELECT * FROM sections WHERE key=$1", [key]);
  const section = sectionRows[0] || null;

  // Get i18n overrides for this section prefix
  const { rows } = await pool.query(
    "SELECT lang, key, value FROM content_overrides WHERE key LIKE $1",
    [`${key}.%`]
  );
  const overrides: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!overrides[row.lang]) overrides[row.lang] = {};
    overrides[row.lang][row.key] = row.value;
  }

  return NextResponse.json({ section, overrides });
}

// PUT: save overrides for a section
export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await params;
  const body = await req.json();

  // body.overrides = { en: { "hero.badge": "...", ... }, ar: { ... } }
  // body.content = JSONB for custom sections
  // body.label = new label for custom sections

  if (body.overrides) {
    for (const [lang, pairs] of Object.entries(body.overrides as Record<string, Record<string, string>>)) {
      for (const [k, v] of Object.entries(pairs)) {
        if (v === "" || v === null) {
          await pool.query("DELETE FROM content_overrides WHERE lang=$1 AND key=$2", [lang, k]);
        } else {
          await pool.query(
            `INSERT INTO content_overrides (lang, key, value) VALUES ($1,$2,$3)
             ON CONFLICT (lang, key) DO UPDATE SET value=$3`,
            [lang, k, v]
          );
        }
      }
    }
  }

  if (body.content !== undefined || body.label !== undefined) {
    const updates: string[] = [];
    const vals: unknown[] = [];
    let i = 1;
    if (body.label !== undefined) { updates.push(`label=$${i++}`); vals.push(body.label); }
    if (body.content !== undefined) { updates.push(`content=$${i++}`); vals.push(JSON.stringify(body.content)); }
    updates.push(`updated_at=NOW()`);
    vals.push(key);
    await pool.query(`UPDATE sections SET ${updates.join(",")} WHERE key=$${i}`, vals);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key } = await params;
  if (!key.startsWith("custom_")) return NextResponse.json({ error: "Cannot delete built-in sections" }, { status: 400 });
  await pool.query("DELETE FROM sections WHERE key=$1", [key]);
  return NextResponse.json({ ok: true });
}
