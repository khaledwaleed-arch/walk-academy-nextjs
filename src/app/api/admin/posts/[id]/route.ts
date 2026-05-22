import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT p.*,
      COALESCE(array_agg(DISTINCT pc.category_id) FILTER (WHERE pc.category_id IS NOT NULL), '{}') as category_ids,
      COALESCE(array_agg(DISTINCT pt.tag_id) FILTER (WHERE pt.tag_id IS NOT NULL), '{}') as tag_ids
     FROM posts p
     LEFT JOIN post_categories pc ON p.id = pc.post_id
     LEFT JOIN post_tags pt ON p.id = pt.post_id
     WHERE p.id=$1 GROUP BY p.id`,
    [id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  // Restore from trash
  if (body.action === "restore") {
    const { rows } = await pool.query(
      "UPDATE posts SET deleted_at=NULL, updated_at=NOW() WHERE id=$1 RETURNING *", [id]
    );
    return NextResponse.json(rows[0]);
  }

  const { title, slug, content, excerpt, status, featured_image_url, meta_title, meta_description,
    author_name, category_ids, tag_ids, scheduled_at, visibility, password } = body;

  const existing = await pool.query("SELECT status, published_at FROM posts WHERE id=$1", [id]);
  if (!existing.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let published_at = existing.rows[0].published_at;
  if (status === "published" && existing.rows[0].status !== "published") published_at = new Date();
  if (status === "draft") published_at = null;

  const { rows } = await pool.query(
    `UPDATE posts SET title=$1, slug=$2, content=$3, excerpt=$4, status=$5, featured_image_url=$6,
     meta_title=$7, meta_description=$8, author_name=$9, published_at=$10, scheduled_at=$11,
     visibility=$12, password=$13, updated_at=NOW()
     WHERE id=$14 RETURNING *`,
    [title, slug, content, excerpt, status, featured_image_url || "",
     meta_title || "", meta_description || "", author_name || "Walk Academy",
     published_at, scheduled_at || null, visibility || "public", password || "", id]
  );

  await pool.query("DELETE FROM post_categories WHERE post_id=$1", [id]);
  if (category_ids?.length) {
    for (const cid of category_ids) {
      await pool.query("INSERT INTO post_categories (post_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [id, cid]);
    }
  }
  await pool.query("DELETE FROM post_tags WHERE post_id=$1", [id]);
  if (tag_ids?.length) {
    for (const tid of tag_ids) {
      await pool.query("INSERT INTO post_tags (post_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING", [id, tid]);
    }
  }
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  if (body.action === "trash") {
    await pool.query("UPDATE posts SET deleted_at=NOW(), updated_at=NOW() WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  }
  if (body.action === "restore") {
    await pool.query("UPDATE posts SET deleted_at=NULL, updated_at=NOW() WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  }
  if (body.status) {
    await pool.query("UPDATE posts SET status=$1, updated_at=NOW() WHERE id=$2", [body.status, id]);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  if (searchParams.get("force") === "true") {
    // Permanent delete
    await pool.query("DELETE FROM posts WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  }
  // Soft delete (move to trash)
  const existing = await pool.query("SELECT deleted_at FROM posts WHERE id=$1", [id]);
  if (existing.rows[0]?.deleted_at) {
    // Already in trash → permanent delete
    await pool.query("DELETE FROM posts WHERE id=$1", [id]);
  } else {
    await pool.query("UPDATE posts SET deleted_at=NOW(), updated_at=NOW() WHERE id=$1", [id]);
  }
  return NextResponse.json({ success: true });
}
