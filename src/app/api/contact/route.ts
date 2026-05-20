import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone || null, subject || null, message]
    );

    const id = result.rows[0].id;

    await sendMail(
      `New Contact Message #${id} — ${subject || name}`,
      `<h2>New Contact Form Submission</h2>
       <table>
         <tr><td><b>Name:</b></td><td>${name}</td></tr>
         <tr><td><b>Email:</b></td><td>${email}</td></tr>
         <tr><td><b>Phone:</b></td><td>${phone || "-"}</td></tr>
         <tr><td><b>Subject:</b></td><td>${subject || "-"}</td></tr>
         <tr><td><b>Message:</b></td><td><pre>${message}</pre></td></tr>
       </table>`
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
