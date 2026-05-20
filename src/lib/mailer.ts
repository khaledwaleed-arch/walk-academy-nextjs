import nodemailer from "nodemailer";

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendMail(subject: string, html: string) {
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === "REPLACE_WITH_TITAN_PASSWORD") return;
  const t = getTransporter();
  await t.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO,
    subject,
    html,
  });
}
