import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, course, country } = await req.json();

    if (!full_name || !email || !course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO registrations (full_name, email, phone, course, country)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [full_name, email, phone || null, course, country || null]
    );

    const id = result.rows[0].id;

    await sendMail(
      `New Registration #${id} — ${full_name}`,
      `<h2>New Course Registration</h2>
       <table>
         <tr><td><b>Name:</b></td><td>${full_name}</td></tr>
         <tr><td><b>Email:</b></td><td>${email}</td></tr>
         <tr><td><b>Phone:</b></td><td>${phone || "-"}</td></tr>
         <tr><td><b>Course:</b></td><td>${course}</td></tr>
         <tr><td><b>Country:</b></td><td>${country || "-"}</td></tr>
       </table>`
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
