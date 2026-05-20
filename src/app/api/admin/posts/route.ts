import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function auth(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  return h.replace("Bearer ", "") === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";

  let q = `SELECT p.*, COALESCE(json_agg(c.name) FILTER (WHERE c.id IS NOT NULL), '[]') as category_names
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id`;
  const params: unknown[] = [];
  const where: string[] = [];
  if (status && status !== "all") { params.push(status); where.push(`p.status = $${params.length}`); }
  if (search) { params.push(`%${search}%`); where.push(`p.title ILIKE $${params.length}`); }
  if (where.length) q += " WHERE " + where.join(" AND ");
  q += " GROUP BY p.id ORDER BY p.updated_at DESC";

  const { rows } = await pool.query(q, params);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description, author_name, category_ids, scheduled_at } = body;

  const published_at = status === "published" ? new Date() : null;
  const { rows } = await pool.query(
    `INSERT INTO posts (title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description, author_name, published_at, scheduled_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()) RETURNING *`,
    [title, slug, content, excerpt, status || "draft", featured_image_url || "", meta_title || "", meta_description || "", author_name || "Walk Academy", published_at, scheduled_at || null]
  );
  const post = rows[0];

  if (category_ids?.length) {
    for (const cid of category_ids) {
      await pool.query("INSERT INTO post_categories (post_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [post.id, cid]);
    }
  }
  return NextResponse.json(post, { status: 201 });
}
