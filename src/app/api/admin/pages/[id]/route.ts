import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

const RESERVED_SLUGS = new Set([
  'admin', 'api', 'courses', 'blog', 'register', 'contact',
  'consultation', 'services', 'privacy', 'terms', 'sitemap', 'robots', 'about',
  'login', '_next', 'static', 'public', 'uploads', 'media', 'assets', 'favicon.ico'
]);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT * FROM pages WHERE id=$1", [id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { title, content, status, template } = body;
  const slug = (body.slug || '').trim().toLowerCase();

  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: `Slug '${slug}' is reserved for system use` }, { status: 409 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 });
  }

  const existing = await pool.query("SELECT status, published_at FROM pages WHERE id=$1", [id]);
  if (!existing.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const wasPublished = existing.rows[0]?.status === "published";
  let published_at = existing.rows[0]?.published_at;
  if (status === "published" && !wasPublished) published_at = new Date().toISOString();
  if (status === "draft") published_at = null;

  try {
    const { rows } = await pool.query(
      `UPDATE pages SET title=$1, slug=$2, content=$3, status=$4, template=$5, published_at=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, slug, content, status, template || "default", published_at, id]
    );
    return NextResponse.json(rows[0]);
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 409 });
    console.error('Pages PUT error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query("DELETE FROM pages WHERE id=$1", [id]);
  return NextResponse.json({ success: true });
}
