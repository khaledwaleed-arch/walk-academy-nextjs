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

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query("SELECT * FROM pages ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, content, status, template } = body;
  const slug = (body.slug || '').trim().toLowerCase();

  if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: `Slug '${slug}' is reserved for system use` }, { status: 409 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 });
  }

  const published_at = status === "published" ? new Date().toISOString() : null;
  try {
    const { rows } = await pool.query(
      `INSERT INTO pages (title, slug, content, status, template, published_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, slug, content, status || "draft", template || "default", published_at]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 409 });
    console.error('Pages POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
