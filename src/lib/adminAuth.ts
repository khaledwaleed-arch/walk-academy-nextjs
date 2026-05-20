import crypto from "crypto";
import { NextRequest } from "next/server";

export function getAdminToken(): string {
  return crypto.createHash("sha256").update(process.env.ADMIN_SECRET || "").digest("hex");
}

export function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "").trim();
  return token.length > 0 && token === getAdminToken();
}
