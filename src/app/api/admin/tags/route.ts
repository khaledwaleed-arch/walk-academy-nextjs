import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { handleDbError } from "@/lib/error-handler";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(`
    SELECT t.*, COUNT(pt.post_id)::int as post_count
    FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id
    GROUP BY t.id ORDER BY t.name ASC`);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = (body.name || '').trim();
  const slug = (body.slug || '').trim().toLowerCase();

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  try {
    const { rows } = await pool.query(
      "INSERT INTO tags (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING RETURNING *",
      [name, slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ ...rows[0], post_count: 0 }, { status: 201 });
  } catch (err) {
    return handleDbError(err);
  }
}
