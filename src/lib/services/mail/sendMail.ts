import type {Transporter, SentMessageInfo } from "nodemailer";
import nodemailer from "nodemailer";

const createTransporter = (): Transporter => {
  const service: string = process.env.EMAIL_SERVICE || "gmail";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn(
      "EMAIL_USER or EMAIL_PASS not set. Email sending will fail in production."
    );
  }

  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<SentMessageInfo> => {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

export default sendEmail;