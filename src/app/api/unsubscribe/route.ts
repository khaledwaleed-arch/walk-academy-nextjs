import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { validateEmail, sanitizeString } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = sanitizeString(body.email)?.trim().toLowerCase();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    const pool = getPool();
    const { rowCount } = await pool.query(
      "DELETE FROM newsletter_subscribers WHERE email=$1",
      [email]
    );

    if (!rowCount || rowCount === 0) {
      return NextResponse.json({ message: "Email not found in subscribers list" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Successfully unsubscribed" });
  } catch (err) {
    console.error("unsubscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response('<html><body><h2>Unsubscribe</h2><p>No email provided.</p></body></html>', {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  const pool = getPool();
  await pool.query("DELETE FROM newsletter_subscribers WHERE email=$1", [email]);

  return new Response(
    `<html><body style="font-family:Arial;text-align:center;padding:60px">
      <h2>Unsubscribed Successfully</h2>
      <p>You have been removed from our newsletter list.</p>
      <a href="/">Return to Walk Business</a>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
