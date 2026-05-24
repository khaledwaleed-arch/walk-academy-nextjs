import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { sendWhatsApp } from "@/lib/whatsapp";
import { validateEmail, sanitizeString } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = sanitizeString(body.name)?.trim();
    const email = sanitizeString(body.email)?.trim().toLowerCase();
    const phone = sanitizeString(body.phone)?.trim() || null;
    const subject = sanitizeString(body.subject)?.trim();
    const message = sanitizeString(body.message)?.trim();

    if (!name || !email || !message || !subject) {
      return NextResponse.json({ error: "Missing required fields: name, email, subject, message" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [name, email, phone, subject, message]
    );
    const { id, created_at } = result.rows[0];

    // Email notification
    await sendMail(
      `New Contact Message #${id} — ${subject}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f5f5f5;border-radius:12px">
        <div style="background:#0D3B5C;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">New Contact Message</h1>
          <p style="color:#F58220;margin:5px 0 0">Walk Business — Message #${id}</p>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:140px">Name</td><td style="padding:8px;font-weight:bold;color:#0D3B5C">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px;color:#0D3B5C">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px;color:#0D3B5C">${phone || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Subject</td><td style="padding:8px;font-weight:bold;color:#0D3B5C">${subject}</td></tr>
            <tr><td style="padding:8px;color:#666">Date</td><td style="padding:8px;color:#0D3B5C">${new Date(created_at).toLocaleString("en-GB")}</td></tr>
          </table>
          <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin-top:16px;border-left:4px solid #F58220">
            <p style="margin:0;color:#333;line-height:1.6">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <div style="margin-top:20px;text-align:center">
            <a href="https://walk-business.com/admin" style="background:#F58220;color:white;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold">View in Admin Panel</a>
          </div>
        </div>
      </div>`
    );

    // WhatsApp notification
    await sendWhatsApp(
      `New Contact #${id}\n` +
      `From: ${name}\n` +
      `Subject: ${subject}\n` +
      `Phone: ${phone || "—"}\n` +
      `Email: ${email}\n` +
      `Message: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
