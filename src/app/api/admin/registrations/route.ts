import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import { VALID_STATUSES } from "@/lib/validators";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const payment_method = searchParams.get('payment_method');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50')));
  const sortParam = searchParams.get('sort') || 'created_at';
  const sort = ['created_at', 'full_name', 'course', 'status'].includes(sortParam) ? sortParam : 'created_at';
  const order = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  if (status) { params.push(status); where += ` AND status = $${params.length}`; }
  if (payment_method) { params.push(payment_method); where += ` AND payment_method = $${params.length}`; }

  const pool = getPool();
  const countParams = [...params];
  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT * FROM registrations ${where} ORDER BY ${sort} ${order} LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM registrations ${where}`, countParams);

  return NextResponse.json({ registrations: rows, total: parseInt(countRows[0].count), page, limit });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });
  if (!VALID_STATUSES.registrations.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Allowed: ${VALID_STATUSES.registrations.join(', ')}` }, { status: 400 });
  }

  const pool = getPool();
  const { rows } = await pool.query("UPDATE registrations SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, registration: rows[0] });
}
