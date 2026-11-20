import nodemailer from "nodemailer";

type EnquiryMail = {
  name: string;
  email: string;
  organisation: string;
  phone: string;
  message: string;
  productInterest: string;
};

export async function notifyEnquiry(enquiry: EnquiryMail) {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim() || from;
  if (!host || !from || !to) return { sent: false as const };

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.organisation ? `Organisation: ${enquiry.organisation}` : "",
    enquiry.phone ? `Phone: ${enquiry.phone}` : "",
    enquiry.productInterest ? `Product: ${enquiry.productInterest}` : "",
    "",
    enquiry.message,
  ].filter((line) => line !== "");

  await transporter.sendMail({
    from,
    to,
    replyTo: enquiry.email,
    subject: `Enquiry from ${enquiry.name}`,
    text: lines.join("\n"),
  });
  return { sent: true as const };
}
