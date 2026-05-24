import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { validateEmail, sanitizeString } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = sanitizeString(body.email)?.trim().toLowerCase();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const pool = getPool();
    try {
      await pool.query(
        "INSERT INTO newsletter_subscribers (email) VALUES ($1)",
        [email]
      );
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "23505") {
        return NextResponse.json({ ok: true, already: true });
      }
      throw e;
    }

    await sendMail(
      `New Newsletter Subscriber — ${email}`,
      `<p>New subscriber: <b>${email}</b></p>`
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
