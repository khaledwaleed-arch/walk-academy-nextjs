import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";
import { buildUpdateQuery, AllowedFields } from "@/lib/db-helpers";

const pool = getPool();

const SERVICE_FIELDS: AllowedFields = {
  slug: 'text', icon: 'text', title_en: 'text', title_ar: 'text',
  desc_en: 'text', desc_ar: 'text', sort_order: 'int', visible: 'boolean',
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT * FROM services WHERE id=$1", [id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const query = buildUpdateQuery('services', parseInt(id), body, SERVICE_FIELDS);
  if (!query) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });

  try {
    const { rows } = await pool.query(query.text, query.values);
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    await pool.query("DELETE FROM services WHERE id=$1", [id]);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleDbError(err);
  }
}
