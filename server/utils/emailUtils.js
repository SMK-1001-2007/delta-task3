import { getTransporter } from "../config/mail.js";

export const sendResetPasswordEmail = async (to, resetLink) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Support" <${process.env.MAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: resetLink,
  });
};

export const getPasswordResetEmailHTML = (resetLink) => `
  <div>
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 10 minutes.</p>
  </div>
`;

