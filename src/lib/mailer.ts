import nodemailer from "nodemailer";

// 🛰️ Construct SMTP Transport connection pool using exact .env variables
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || "smtpout.secureserver.net",
  port: parseInt(process.env.MAIL_PORT || "465", 10),
  secure: (process.env.MAIL_PORT || "465") === "465", // true for port 465 (Implicit SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  // 🔒 Enforce SSL/TLS certificate requirements
  tls: {
    rejectUnauthorized: true, // Reject invalid or self-signed certificates
    servername: process.env.MAIL_SERVER || "smtpout.secureserver.net", // SNI server name verification
  },
  pool: true, // Maintain persistent connection pool
  maxConnections: 5,
  maxMessages: 100,
});

// 🏷️ Format standard sender signature format: "HackSmiths Official" <contact@hacksmiths.dev>
export const defaultSender = `"${process.env.MAIL_FROM_NAME || "HackSmiths Official"}" <${process.env.MAIL_FROM || "contact@hacksmiths.dev"}>`;

// Diagnostic connection checkpoint for development runtime
if (process.env.NODE_ENV === "development") {
  transporter.verify((error: Error | null) => {
    if (error) {
      console.error("❌ Email SMTP Subsystem Connection Fault:", error.message);
    } else {
      console.log("🚀 Email SMTP Subsystem Connected & Operational (Titan Mail)");
    }
  });
}