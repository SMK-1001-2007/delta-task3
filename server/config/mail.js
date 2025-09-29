import nodemailer from "nodemailer";

let transporter = null;

/**
 * Initializes Nodemailer and verifies SMTP connection.
 */
export const connectNodemailer = async () => {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail", // or 'smtp.ethereal.email', 'hotmail', etc.
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("Nodemailer connected successfully to SMTP server");
  } catch (error) {
    console.error("❌ Failed to connect Nodemailer:", error.message);
    throw error;
  }
};

/**
 * Returns the configured transporter.
 */
export const getTransporter = () => {
  if (!transporter) {
    throw new Error("Nodemailer transporter not initialized. Call connectNodemailer() first.");
  }
  return transporter;
};
