import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, service, preferred_date, preferred_time, message } =
      await req.json();

    if (!name || !email || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO consultations (name, email, phone, company, service, preferred_date, preferred_time, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`,
      [name, email, phone || null, company || null, service, preferred_date || null, preferred_time || null, message || null]
    );
    const { id, created_at } = result.rows[0];

    await sendMail(
      `📅 Consultation Request #${id} — ${name}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f5f5f5;border-radius:12px">
        <div style="background:#0D3B5C;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">New Consultation Request</h1>
          <p style="color:#F58220;margin:5px 0 0">Walk Business — Consultation #${id}</p>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:140px">Name</td><td style="padding:8px;font-weight:bold;color:#0D3B5C">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px;color:#0D3B5C">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px;color:#0D3B5C">${phone || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Company</td><td style="padding:8px;color:#0D3B5C">${company || "—"}</td></tr>
            <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px;font-weight:bold;color:#F58220">${service}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Preferred Date</td><td style="padding:8px;color:#0D3B5C">${preferred_date || "—"}</td></tr>
            <tr><td style="padding:8px;color:#666">Preferred Time</td><td style="padding:8px;color:#0D3B5C">${preferred_time || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Message</td><td style="padding:8px;color:#0D3B5C">${message || "—"}</td></tr>
            <tr><td style="padding:8px;color:#666">Submitted</td><td style="padding:8px;color:#0D3B5C">${new Date(created_at).toLocaleString("en-GB")}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="https://walk-business.com/admin" style="background:#F58220;color:white;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold">View in Admin Panel</a>
          </div>
        </div>
      </div>`
    );

    await sendWhatsApp(
      `📅 Consultation Request #${id}\n` +
      `Name: ${name}\n` +
      `Service: ${service}\n` +
      `Phone: ${phone || "—"}\n` +
      `Company: ${company || "—"}\n` +
      `Date: ${preferred_date || "—"} ${preferred_time || ""}`
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("consultation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
