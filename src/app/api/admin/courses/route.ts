import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";

  let q = "SELECT * FROM courses";
  const params: unknown[] = [];
  const where: string[] = [];

  if (status && status !== "all") { params.push(status); where.push(`status=$${params.length}`); }
  if (search) { params.push(`%${search}%`); where.push(`(title_en ILIKE $${params.length} OR title_ar ILIKE $${params.length})`); }

  if (where.length) q += " WHERE " + where.join(" AND ");
  q += " ORDER BY sort_order, created_at DESC";

  const { rows } = await pool.query(q, params);

  const counts = await pool.query(`
    SELECT
      COUNT(*) as all,
      COUNT(*) FILTER (WHERE status='published') as published,
      COUNT(*) FILTER (WHERE status='draft') as draft
    FROM courses`);

  return NextResponse.json({ courses: rows, counts: counts.rows[0] });
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const {
    slug, status = "draft", price, level_color = "bg-blue-500", sort_order = 0,
    title_en, title_ar, duration_en, duration_ar, tagline_en, tagline_ar,
    description_en, description_ar,
    outcomes_en = [], outcomes_ar = [], modules_en = [], modules_ar = [],
    audience_en = [], audience_ar = [],
  } = body;

  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const { rows } = await pool.query(
    `INSERT INTO courses
      (slug, status, price, level_color, sort_order, title_en, title_ar, duration_en, duration_ar,
       tagline_en, tagline_ar, description_en, description_ar,
       outcomes_en, outcomes_ar, modules_en, modules_ar, audience_en, audience_ar)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
     RETURNING *`,
    [slug, status, price, level_color, sort_order, title_en, title_ar, duration_en, duration_ar,
     tagline_en, tagline_ar, description_en, description_ar,
     JSON.stringify(outcomes_en), JSON.stringify(outcomes_ar),
     JSON.stringify(modules_en), JSON.stringify(modules_ar),
     JSON.stringify(audience_en), JSON.stringify(audience_ar)]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
