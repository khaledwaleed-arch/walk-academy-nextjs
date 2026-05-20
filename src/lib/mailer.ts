import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendMail(subject: string, html: string) {
  if (!process.env.SMTP_PASS) return;
  const t = getTransporter();
  await t.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Walk Business"}" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO,
    subject,
    html,
  });
}
