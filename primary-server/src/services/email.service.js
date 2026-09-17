import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

if (env.SMTP_HOST && env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  if (!transporter) {
    console.warn(`[Email Service] SMTP not configured. Would have sent reset link to ${toEmail}: ${resetUrl}`);
    return;
  }

  const mailOptions = {
    from: env.SMTP_FROM,
    to: toEmail,
    subject: "BIS-SATHI Password Reset Request",
    text: `You requested a password reset for your BIS-SATHI account.\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email. This link will expire in 15 minutes.`,
    html: `<p>You requested a password reset for your BIS-SATHI account.</p>
           <p>Please click the link below to reset your password:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>
           <p>If you did not request this, please ignore this email. This link will expire in 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export default {
  sendPasswordResetEmail,
};
