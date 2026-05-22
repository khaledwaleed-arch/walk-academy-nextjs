import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category");

  // Counts
  const { rows: countRows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE deleted_at IS NULL) as all,
      COUNT(*) FILTER (WHERE deleted_at IS NULL AND status='published') as published,
      COUNT(*) FILTER (WHERE deleted_at IS NULL AND status='draft') as draft,
      COUNT(*) FILTER (WHERE deleted_at IS NULL AND status='scheduled') as scheduled,
      COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as trash
    FROM posts`);
  const counts = countRows[0];

  const isTrash = status === "trash";
  let q = `SELECT p.*,
    COALESCE(json_agg(DISTINCT jsonb_build_object('name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') as category_names,
    COALESCE(json_agg(DISTINCT jsonb_build_object('name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') as tag_names
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id`;

  const params: unknown[] = [];
  const where: string[] = [];

  if (isTrash) {
    where.push("p.deleted_at IS NOT NULL");
  } else {
    where.push("p.deleted_at IS NULL");
    if (status && status !== "all") { params.push(status); where.push(`p.status=$${params.length}`); }
  }
  if (search) { params.push(`%${search}%`); where.push(`p.title ILIKE $${params.length}`); }
  if (categoryId) { params.push(categoryId); where.push(`pc.category_id=$${params.length}`); }

  if (where.length) q += " WHERE " + where.join(" AND ");
  q += " GROUP BY p.id ORDER BY p.updated_at DESC";

  const { rows } = await pool.query(q, params);
  const posts = rows.map(r => ({
    ...r,
    category_names: (r.category_names || []).map((x: any) => x.name).filter(Boolean),
    tag_names: (r.tag_names || []).map((x: any) => x.name).filter(Boolean),
  }));
  return NextResponse.json({ posts, counts });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description,
    author_name, category_ids, tag_ids, scheduled_at, visibility, password } = body;

  const published_at = status === "published" ? new Date() : null;
  const { rows } = await pool.query(
    `INSERT INTO posts (title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description,
     author_name, published_at, scheduled_at, visibility, password, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()) RETURNING *`,
    [title, slug, content, excerpt, status || "draft", featured_image_url || "",
     meta_title || "", meta_description || "", author_name || "Walk Academy",
     published_at, scheduled_at || null, visibility || "public", password || ""]
  );
  const post = rows[0];

  if (category_ids?.length) {
    for (const cid of category_ids) {
      await pool.query("INSERT INTO post_categories (post_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [post.id, cid]);
    }
  }
  if (tag_ids?.length) {
    for (const tid of tag_ids) {
      await pool.query("INSERT INTO post_tags (post_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [post.id, tid]);
    }
  }
  return NextResponse.json(post, { status: 201 });
}
