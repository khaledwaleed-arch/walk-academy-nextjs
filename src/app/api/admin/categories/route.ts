import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
function auth(req: NextRequest) { return (req.headers.get("authorization") || "").replace("Bearer ", "") === process.env.ADMIN_TOKEN; }

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
  const { name, slug, description } = await req.json();
  const { rows } = await pool.query(
    "INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *",
    [name, slug, description || ""]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
