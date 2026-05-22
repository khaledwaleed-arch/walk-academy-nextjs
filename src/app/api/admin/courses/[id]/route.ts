import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT * FROM courses WHERE id=$1", [id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const {
    slug, status, price, level_color, sort_order,
    title_en, title_ar, duration_en, duration_ar, tagline_en, tagline_ar,
    description_en, description_ar,
    outcomes_en, outcomes_ar, modules_en, modules_ar, audience_en, audience_ar,
  } = body;

  const { rows } = await pool.query(
    `UPDATE courses SET
      slug=$1, status=$2, price=$3, level_color=$4, sort_order=$5,
      title_en=$6, title_ar=$7, duration_en=$8, duration_ar=$9,
      tagline_en=$10, tagline_ar=$11, description_en=$12, description_ar=$13,
      outcomes_en=$14, outcomes_ar=$15, modules_en=$16, modules_ar=$17,
      audience_en=$18, audience_ar=$19, updated_at=NOW()
     WHERE id=$20 RETURNING *`,
    [slug, status, price, level_color, sort_order,
     title_en, title_ar, duration_en, duration_ar,
     tagline_en, tagline_ar, description_en, description_ar,
     JSON.stringify(outcomes_en), JSON.stringify(outcomes_ar),
     JSON.stringify(modules_en), JSON.stringify(modules_ar),
     JSON.stringify(audience_en), JSON.stringify(audience_ar),
     id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM courses WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
