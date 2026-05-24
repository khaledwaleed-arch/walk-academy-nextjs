import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, course, country, payment_method } = await req.json();
    if (!full_name || !email || !course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO registrations (full_name, email, phone, course, country, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [full_name, email, phone || null, course, country || null, payment_method || null]
    );
    const { id, created_at } = result.rows[0];

    // Email notification
    await sendMail(
      `📋 New Registration #${id} — ${full_name}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f5f5f5;border-radius:12px">
        <div style="background:#0D3B5C;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">New Course Registration</h1>
          <p style="color:#F58220;margin:5px 0 0">Walk Business — Registration #${id}</p>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:140px">Name</td><td style="padding:8px;font-weight:bold;color:#0D3B5C">${full_name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px;color:#0D3B5C">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px;color:#0D3B5C">${phone || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Course</td><td style="padding:8px;font-weight:bold;color:#F58220">${course}</td></tr>
            <tr><td style="padding:8px;color:#666">Country</td><td style="padding:8px;color:#0D3B5C">${country || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Payment</td><td style="padding:8px;font-weight:bold;color:#F58220">${payment_method || "—"}</td></tr>
            <tr><td style="padding:8px;color:#666">Date</td><td style="padding:8px;color:#0D3B5C">${new Date(created_at).toLocaleString("en-GB")}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="https://walk-business.com/admin" style="background:#F58220;color:white;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold">View in Admin Panel</a>
          </div>
        </div>
      </div>`
    );

    // WhatsApp notification
    await sendWhatsApp(
      `🎓 New Registration #${id}\n` +
      `Name: ${full_name}\n` +
      `Course: ${course}\n` +
      `Phone: ${phone || "—"}\n` +
      `Email: ${email}\n` +
      `Country: ${country || "—"}\n` +
      `Payment: ${payment_method || "—"}`
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
