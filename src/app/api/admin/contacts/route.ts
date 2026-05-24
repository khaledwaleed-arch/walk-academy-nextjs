import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import { VALID_STATUSES } from "@/lib/validators";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 500"
  );
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  if (!VALID_STATUSES.contacts.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Allowed: ${VALID_STATUSES.contacts.join(', ')}` }, { status: 400 });
  }

  const pool = getPool();
  const { rows } = await pool.query("UPDATE contacts SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, contact: rows[0] });
}
