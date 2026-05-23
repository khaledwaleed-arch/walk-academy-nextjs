import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM sections ORDER BY sort_order");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { label, content } = await req.json();
  if (!label) return NextResponse.json({ error: "label required" }, { status: 400 });

  const key = "custom_" + Date.now();
  const { rows: maxRows } = await pool.query("SELECT COALESCE(MAX(sort_order),0)+1 AS next FROM sections");
  const sort_order = maxRows[0].next;

  const { rows } = await pool.query(
    `INSERT INTO sections (key, label, type, is_visible, sort_order, content)
     VALUES ($1,$2,'custom',true,$3,$4) RETURNING *`,
    [key, label, sort_order, JSON.stringify(content || {})]
  );
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sections: { key: string; is_visible: boolean; sort_order: number }[] = await req.json();
  for (const s of sections) {
    await pool.query(
      "UPDATE sections SET is_visible=$1, sort_order=$2, updated_at=NOW() WHERE key=$3",
      [s.is_visible, s.sort_order, s.key]
    );
  }
  return NextResponse.json({ ok: true });
}
