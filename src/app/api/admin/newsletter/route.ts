import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

const pool = getPool();

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await pool.query(
    "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC"
  );
  return NextResponse.json({ subscribers: rows, total: rows.length });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  if (!id && !email) return NextResponse.json({ error: 'id or email required' }, { status: 400 });

  if (id) {
    await pool.query("DELETE FROM newsletter_subscribers WHERE id=$1", [id]);
  } else {
    await pool.query("DELETE FROM newsletter_subscribers WHERE email=$1", [email]);
  }
  return NextResponse.json({ ok: true });
}
