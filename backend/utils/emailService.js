// server/utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure dotenv is loaded for process.env variables

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'Gmail', 'SendGrid', 'Mailgun'
    host: process.env.EMAIL_HOST, // For custom SMTP, e.g., 'smtp.mailtrap.io'
    port: process.env.EMAIL_PORT, // For custom SMTP, e.g., 2525 or 587 or 465 (SSL)
    secure: process.env.EMAIL_PORT === "465" ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Optional: for self-signed certificates or development environments
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Your App Name <${process.env.EMAIL_FROM_ADDRESS}>`, // Sender address
    to: options.email, // Recipient address
    subject: options.subject, // Subject line
    html: options.message, // HTML body
    // text: options.message, // Plain text body (optional, but good for fallback)
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
