import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";
import { buildUpdateQuery, AllowedFields } from "@/lib/db-helpers";

const pool = getPool();

const COURSE_FIELDS: AllowedFields = {
  title_en: 'text', title_ar: 'text', slug: 'text', tagline_en: 'text', tagline_ar: 'text',
  description_en: 'text', description_ar: 'text', level: 'text', level_color: 'text',
  duration_en: 'text', duration_ar: 'text', price: 'text', status: 'text',
  featured_image: 'text',
  instructor_name: 'text', instructor_title_en: 'text', instructor_title_ar: 'text',
  instructor_bio_en: 'text', instructor_bio_ar: 'text',
  schedule_en: 'text', schedule_ar: 'text', start_date_en: 'text', start_date_ar: 'text',
  location_en: 'text', location_ar: 'text',
  sort_order: 'int',
  modules_en: 'jsonb', modules_ar: 'jsonb',
  outcomes_en: 'jsonb', outcomes_ar: 'jsonb',
  audience_en: 'jsonb', audience_ar: 'jsonb',
};

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

  const query = buildUpdateQuery('courses', parseInt(id), body, COURSE_FIELDS);
  if (!query) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });

  try {
    const { rows } = await pool.query(query.text, query.values);
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath(`/courses/${rows[0].slug}`);
    revalidatePath("/courses");
    revalidatePath("/");
    return NextResponse.json(rows[0]);
  } catch (err) {
    return handleDbError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}
