import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const pool = getPool();
function auth(req: NextRequest) { return verifyAdmin(req); }

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];
const ALLOWED_MIME_TYPES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
  'image/gif': [[0x47, 0x49, 0x46, 0x38]], // GIF8
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

function checkMagicBytes(buf: Uint8Array, signatures: number[][]): boolean {
  return signatures.some(sig => sig.every((byte, i) => buf[i] === byte));
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Extension check
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: `File type .${ext} not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` }, { status: 400 });
  }

  // MIME type check
  if (!ALLOWED_MIME_TYPES[file.type]) {
    return NextResponse.json({ error: `MIME type ${file.type} not allowed` }, { status: 400 });
  }

  // Magic bytes check
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer).slice(0, 8);
  if (!checkMagicBytes(bytes, ALLOWED_MIME_TYPES[file.type])) {
    return NextResponse.json({ error: "File content does not match declared type" }, { status: 400 });
  }

  const buffer = Buffer.from(arrayBuffer);
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
