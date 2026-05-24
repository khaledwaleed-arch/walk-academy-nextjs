import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import { VALID_STATUSES } from "@/lib/validators";

const pool = getPool();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query("SELECT * FROM registrations WHERE id=$1", [id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();

  if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  if (!VALID_STATUSES.registrations.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Allowed: ${VALID_STATUSES.registrations.join(', ')}` }, { status: 400 });
  }

  const { rows } = await pool.query("UPDATE registrations SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
