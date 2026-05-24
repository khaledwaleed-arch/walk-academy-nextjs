import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(pc.post_id) as post_count FROM categories c
     LEFT JOIN post_categories pc ON c.id = pc.category_id GROUP BY c.id ORDER BY c.name`
  );
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = (body.name || '').trim();
  const slug = (body.slug || '').trim().toLowerCase();
  const description = (body.description || '').trim();

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  try {
    const { rows } = await pool.query(
      "INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *",
      [name, slug, description]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}
