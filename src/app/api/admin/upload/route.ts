import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() || "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/${filename}`;
  const { rows } = await pool.query(
    "INSERT INTO media (filename, original_name, url, mime_type, size_bytes) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [filename, file.name, url, file.type, file.size]
  );
  return NextResponse.json(rows[0], { status: 201 });
}
