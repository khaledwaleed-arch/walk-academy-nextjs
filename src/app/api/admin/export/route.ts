import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyAdmin } from "@/lib/adminAuth";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

function toCairo(date: Date): string {
  return date.toLocaleString("en-GB", { timeZone: "Africa/Cairo" });
}

function toCairoDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { timeZone: "Africa/Cairo" });
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "xlsx";
  const type = searchParams.get("type") || "registrations";

  // Validate format
  if (!['xlsx', 'pdf'].includes(format)) {
    return NextResponse.json({ error: `Unsupported format '${format}'. Use: xlsx, pdf` }, { status: 400 });
  }

  const pool = getPool();

  if (format === "xlsx") {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Walk Business Admin";
    wb.created = new Date();

    // Registrations sheet
    const regsSheet = wb.addWorksheet("Registrations");
    regsSheet.columns = [
      { header: "ID",         key: "id",               width: 8 },
      { header: "Name",       key: "full_name",        width: 25 },
      { header: "Email",      key: "email",            width: 30 },
      { header: "Phone",      key: "phone",            width: 18 },
      { header: "Phone (Normalized)", key: "phone_normalized", width: 18 },
      { header: "Course",     key: "course",           width: 30 },
      { header: "Country",    key: "country",          width: 15 },
      { header: "Payment",    key: "payment_method",   width: 18 },
      { header: "Amount",     key: "payment_amount",   width: 12 },
      { header: "Reference",  key: "payment_reference", width: 20 },
      { header: "Status",     key: "status",           width: 12 },
      { header: "Date (Cairo)", key: "created_at",     width: 22 },
    ];

    regsSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D3B5C" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { horizontal: "center" };
    });

    const { rows: regs } = await pool.query(
      `SELECT *, (created_at AT TIME ZONE 'Africa/Cairo') as created_at_cairo FROM registrations ORDER BY created_at DESC`
    );
    regs.forEach((r) => {
      regsSheet.addRow({
        ...r,
        created_at: toCairo(new Date(r.created_at_cairo || r.created_at)),
      });
    });

    // Contacts sheet
    const conSheet = wb.addWorksheet("Contacts");
    conSheet.columns = [
      { header: "ID",      key: "id",         width: 8 },
      { header: "Name",    key: "name",       width: 25 },
      { header: "Email",   key: "email",      width: 30 },
      { header: "Phone",   key: "phone",      width: 18 },
      { header: "Subject", key: "subject",    width: 30 },
      { header: "Message", key: "message",    width: 50 },
      { header: "Status",  key: "status",     width: 12 },
      { header: "Date (Cairo)", key: "created_at", width: 22 },
    ];
    conSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D3B5C" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { horizontal: "center" };
    });
    const { rows: contacts } = await pool.query(
      `SELECT *, (created_at AT TIME ZONE 'Africa/Cairo') as created_at_cairo FROM contacts ORDER BY created_at DESC`
    );
    contacts.forEach((r) => {
      conSheet.addRow({ ...r, created_at: toCairo(new Date(r.created_at_cairo || r.created_at)) });
    });

    // Consultations sheet
    const consultSheet = wb.addWorksheet("Consultations");
    consultSheet.columns = [
      { header: "ID",             key: "id",             width: 8 },
      { header: "Name",           key: "name",           width: 25 },
      { header: "Email",          key: "email",          width: 30 },
      { header: "Phone",          key: "phone",          width: 18 },
      { header: "Company",        key: "company",        width: 25 },
      { header: "Service",        key: "service",        width: 30 },
      { header: "Preferred Date", key: "preferred_date", width: 15 },
      { header: "Preferred Time", key: "preferred_time", width: 15 },
      { header: "Message",        key: "message",        width: 40 },
      { header: "Status",         key: "status",         width: 12 },
      { header: "Date (Cairo)",   key: "created_at",     width: 22 },
    ];
    consultSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D3B5C" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { horizontal: "center" };
    });
    const { rows: consultations } = await pool.query(
      `SELECT *, (created_at AT TIME ZONE 'Africa/Cairo') as created_at_cairo FROM consultations ORDER BY created_at DESC`
    );
    consultations.forEach((r) => {
      consultSheet.addRow({ ...r, created_at: toCairo(new Date(r.created_at_cairo || r.created_at)) });
    });

    // Subscribers sheet
    const subSheet = wb.addWorksheet("Newsletter");
    subSheet.columns = [
      { header: "ID",           key: "id",         width: 8 },
      { header: "Email",        key: "email",      width: 35 },
      { header: "Date (Cairo)", key: "created_at", width: 22 },
    ];
    subSheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0D3B5C" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { horizontal: "center" };
    });
    const { rows: subs } = await pool.query(
      `SELECT *, (created_at AT TIME ZONE 'Africa/Cairo') as created_at_cairo FROM newsletter_subscribers ORDER BY created_at DESC`
    );
    subs.forEach((r) => {
      subSheet.addRow({ ...r, created_at: toCairo(new Date(r.created_at_cairo || r.created_at)) });
    });

    const buffer = await wb.xlsx.writeBuffer();
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="walk-business-data-${date}.xlsx"`,
      },
    });
  }

  // PDF export
  const { rows } = await pool.query(
    type === "contacts"
      ? "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 200"
      : "SELECT * FROM registrations ORDER BY created_at DESC LIMIT 200"
  );

  const buffers: Buffer[] = [];
  const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  await new Promise<void>((resolve) => {
    doc.on("end", resolve);

    const primaryColor = "#0D3B5C";
    const accentColor = "#F58220";
    const date = toCairoDate(new Date());
    const title = type === "contacts" ? "Contact Messages" : "Course Registrations";

    // Header bar
    doc.rect(0, 0, doc.page.width, 70).fill(primaryColor);
    doc.fontSize(20).fillColor("white").text(`Walk Business — ${title}`, 40, 22);
    doc.fontSize(10).fillColor(accentColor).text(`Generated: ${date} (Cairo)  |  Total: ${rows.length}`, 40, 48);

    doc.moveDown(3);

    const cols = type === "contacts"
      ? ["ID", "Name", "Email", "Phone", "Subject", "Status", "Date"]
      : ["ID", "Name", "Email", "Phone", "Course", "Country", "Payment", "Status", "Date"];

    const colWidths = type === "contacts"
      ? [30, 100, 140, 90, 120, 60, 80]
      : [30, 90, 120, 80, 90, 60, 70, 55, 70];

    const startX = 40;
    let y = 90;

    // Table header
    doc.rect(startX, y, doc.page.width - 80, 22).fill("#092c46");
    let x = startX + 5;
    doc.fontSize(9).fillColor("white");
    cols.forEach((col, i) => {
      doc.text(col, x, y + 6, { width: colWidths[i], lineBreak: false });
      x += colWidths[i];
    });
    y += 22;

    // Table rows
    rows.forEach((row, rowIdx) => {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
      const bg = rowIdx % 2 === 0 ? "#ffffff" : "#f5f7fa";
      doc.rect(startX, y, doc.page.width - 80, 18).fill(bg);
      doc.fontSize(7.5).fillColor("#333");
      x = startX + 5;
      const values = type === "contacts"
        ? [row.id, row.name, row.email, row.phone || "—", (row.subject || "").substring(0, 20), row.status, toCairoDate(new Date(row.created_at))]
        : [row.id, row.full_name, row.email, row.phone || "—", row.course.substring(0, 15), row.country || "—", row.payment_method || "—", row.status, toCairoDate(new Date(row.created_at))];

      values.forEach((val, i) => {
        doc.text(String(val), x, y + 5, { width: colWidths[i] - 2, lineBreak: false, ellipsis: true });
        x += colWidths[i];
      });
      y += 18;
    });

    // Footer
    doc.fontSize(8).fillColor("#999")
      .text("walk-business.com | info@walk-business.com | +20 114 370 6993", 40, doc.page.height - 30, { align: "center" });

    doc.end();
  });

  const pdfBuffer = Buffer.concat(buffers);
  const filename = `walk-business-${type}-${new Date().toISOString().slice(0, 10)}.pdf`;
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
