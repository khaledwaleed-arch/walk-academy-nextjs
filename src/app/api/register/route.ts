import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { sendWhatsApp } from "@/lib/whatsapp";
import {
  validatePhone,
  validateEmail,
  VALID_PAYMENT_METHODS,
  validateLength,
  sanitizeString,
} from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const full_name = sanitizeString(body.full_name)?.trim();
    const email = sanitizeString(body.email)?.trim().toLowerCase();
    const phone = sanitizeString(body.phone)?.trim();
    const course = sanitizeString(body.course)?.trim();
    const country = sanitizeString(body.country)?.trim();
    const payment_method = sanitizeString(body.payment_method)?.trim() || null;
    const payment_amount = body.payment_amount != null ? Number(body.payment_amount) : null;
    const payment_reference = sanitizeString(body.payment_reference)?.trim() || null;

    // Required fields
    if (!full_name || !email || !phone || !course || !country) {
      return NextResponse.json({ error: "Missing required fields: full_name, email, phone, course, country" }, { status: 400 });
    }

    // Email validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Phone validation
    const phoneResult = validatePhone(phone);
    if (!phoneResult.valid) {
      return NextResponse.json({ error: phoneResult.error }, { status: 400 });
    }

    // Payment method validation
    if (payment_method && !VALID_PAYMENT_METHODS.includes(payment_method)) {
      return NextResponse.json({ error: `Invalid payment method. Allowed: ${VALID_PAYMENT_METHODS.join(', ')}` }, { status: 400 });
    }

    // Length validation
    const lenError = validateLength('full_name', full_name);
    if (lenError) return NextResponse.json({ error: lenError }, { status: 400 });
    const emailLenError = validateLength('email', email);
    if (emailLenError) return NextResponse.json({ error: emailLenError }, { status: 400 });
    const courseLenError = validateLength('course', course);
    if (courseLenError) return NextResponse.json({ error: courseLenError }, { status: 400 });
    const countryLenError = validateLength('country', country);
    if (countryLenError) return NextResponse.json({ error: countryLenError }, { status: 400 });

    const normalizedPhone = phoneResult.normalized;

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO registrations (full_name, email, phone, phone_normalized, course, country, payment_method, payment_amount, payment_reference)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at`,
      [full_name, email, phone, normalizedPhone, course, country, payment_method, payment_amount, payment_reference]
    );
    const { id, created_at } = result.rows[0];

    // Email notification
    await sendMail(
      `New Registration #${id} — ${full_name}`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f5f5f5;border-radius:12px">
        <div style="background:#0D3B5C;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">New Course Registration</h1>
          <p style="color:#F58220;margin:5px 0 0">Walk Business — Registration #${id}</p>
        </div>
        <div style="background:white;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:140px">Name</td><td style="padding:8px;font-weight:bold;color:#0D3B5C">${full_name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Email</td><td style="padding:8px;color:#0D3B5C">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px;color:#0D3B5C">${normalizedPhone || phone}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Course</td><td style="padding:8px;font-weight:bold;color:#F58220">${course}</td></tr>
            <tr><td style="padding:8px;color:#666">Country</td><td style="padding:8px;color:#0D3B5C">${country}</td></tr>
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
      `New Registration #${id}\n` +
      `Name: ${full_name}\n` +
      `Course: ${course}\n` +
      `Phone: ${normalizedPhone || phone}\n` +
      `Email: ${email}\n` +
      `Country: ${country}\n` +
      `Payment: ${payment_method || "—"}`
    );

    return NextResponse.json({ ok: true, id });
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === '23505') {
      return NextResponse.json({ error: 'You have already registered for this course' }, { status: 409 });
    }
    console.error("register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
