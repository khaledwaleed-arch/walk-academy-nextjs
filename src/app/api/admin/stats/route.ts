import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pool = getPool();
  const [regs, contacts, subs, consultations, todayRegs, todayContacts] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM registrations"),
    pool.query("SELECT COUNT(*) FROM contacts"),
    pool.query("SELECT COUNT(*) FROM newsletter_subscribers"),
    pool.query("SELECT COUNT(*) FROM consultations"),
    pool.query("SELECT COUNT(*) FROM registrations WHERE created_at >= NOW() - INTERVAL '24 hours'"),
    pool.query("SELECT COUNT(*) FROM contacts WHERE created_at >= NOW() - INTERVAL '24 hours'"),
  ]);
  return NextResponse.json({
    total_registrations: Number(regs.rows[0].count),
    total_contacts: Number(contacts.rows[0].count),
    total_subscribers: Number(subs.rows[0].count),
    total_consultations: Number(consultations.rows[0].count),
    today_registrations: Number(todayRegs.rows[0].count),
    today_contacts: Number(todayContacts.rows[0].count),
  });
}
