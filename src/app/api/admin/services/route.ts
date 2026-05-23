import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(
    "SELECT * FROM services ORDER BY sort_order, id"
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug, icon = "fa-star", title_en, title_ar, desc_en, desc_ar, sort_order = 0 } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const { rows } = await pool.query(
    `INSERT INTO services (slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [slug, icon, title_en || "", title_ar || "", desc_en || "", desc_ar || "", sort_order]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
