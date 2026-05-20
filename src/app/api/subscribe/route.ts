import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
