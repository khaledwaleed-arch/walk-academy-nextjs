import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const secret = process.env.DEPLOY_SECRET;
  const sig = req.headers.get("x-hub-signature-256") || "";
  const body = await req.text();

  if (secret) {
    const expected = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (sig !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const payload = JSON.parse(body);
  if (payload.ref !== "refs/heads/main") {
    return NextResponse.json({ ok: true, msg: "Not main branch, skipped" });
  }

  execAsync("cd /root/walk-academy-nextjs && git pull origin main && npm run build && pm2 restart walk-academy")
    .then(() => console.log("Deploy completed"))
    .catch((e) => console.error("Deploy failed:", e));

  return NextResponse.json({ ok: true, msg: "Deploy triggered" });
}
