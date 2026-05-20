import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function auth(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  return h.replace("Bearer ", "") === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT p.*, COALESCE(array_agg(pc.category_id) FILTER (WHERE pc.category_id IS NOT NULL), '{}') as category_ids
     FROM posts p LEFT JOIN post_categories pc ON p.id = pc.post_id WHERE p.id=$1 GROUP BY p.id`,
    [id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description, author_name, category_ids, scheduled_at } = body;

  const existing = await pool.query("SELECT status, published_at FROM posts WHERE id=$1", [id]);
  if (!existing.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let published_at = existing.rows[0].published_at;
  if (status === "published" && existing.rows[0].status !== "published") published_at = new Date();
  if (status === "draft") published_at = null;

  const { rows } = await pool.query(
    `UPDATE posts SET title=$1, slug=$2, content=$3, excerpt=$4, status=$5, featured_image_url=$6,
     meta_title=$7, meta_description=$8, author_name=$9, published_at=$10, scheduled_at=$11, updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [title, slug, content, excerpt, status, featured_image_url || "", meta_title || "", meta_description || "", author_name || "Walk Academy", published_at, scheduled_at || null, id]
  );

  await pool.query("DELETE FROM post_categories WHERE post_id=$1", [id]);
  if (category_ids?.length) {
    for (const cid of category_ids) {
      await pool.query("INSERT INTO post_categories (post_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [id, cid]);
    }
  }
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM posts WHERE id=$1", [id]);
  return NextResponse.json({ success: true });
}
