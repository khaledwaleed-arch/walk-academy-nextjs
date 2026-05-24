import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";

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
  const body = await req.json();
  const { icon = "fa-star", title_en, title_ar, desc_en, desc_ar, sort_order = 0 } = body;
  const visible = body.visible !== undefined ? body.visible : true;
  const slug = (body.slug || '').trim().toLowerCase();

  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  try {
    const { rows } = await pool.query(
      `INSERT INTO services (slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order, visible)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [slug, icon, title_en || "", title_ar || "", desc_en || "", desc_ar || "", sort_order, visible]
    );
    revalidatePath("/");
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}
