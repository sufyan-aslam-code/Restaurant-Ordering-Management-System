import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", result.messageId);

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};