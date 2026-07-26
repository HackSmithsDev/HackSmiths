import { transporter, defaultSender } from "@/lib/mailer";
import * as templates from "./templates";

/**
 * Pure transport layer: Inject variables into templates and trigger SMTP delivery.
 */
async function dispatch(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: defaultSender,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`[Email Dispatch Error] Failed sending to ${to}:`, error);
    throw error;
  }
}

// 1. Applicant: Form Submission Confirmation
export const sendFormSubmitted = (email: string, applicantName: string, applicationId: string) => 
  dispatch(
    email,
    `Application Received #${applicationId}`,
    templates.getFormSubmittedHtml(applicantName, applicationId)
  );

// 2. Applicant: Decision Result (Approved / Rejected)
export const sendFormDecision = (email: string, applicantName: string, approved: boolean, notes?: string) => 
  dispatch(
    email,
    approved ? "Application Status: Approved" : "Application Status Update",
    templates.getFormDecisionHtml(applicantName, approved, notes)
  );

// 3. Admin: Combined OTP + Security Details
export const sendAdminOtp = (adminEmail: string, otpCode: string, ipAddress?: string) => 
  dispatch(
    adminEmail,
    `Security Code: ${otpCode} - Admin Dashboard Login`,
    templates.getAdminOtpHtml(adminEmail, otpCode, new Date().toLocaleString(), ipAddress)
  );

// 4. Applicant: Welcome + Verification OTP
export const sendApplicantOtp = (email: string, otpCode: string, isExisting: boolean) =>
  dispatch(
    email,
    `${otpCode} is your verification code - HackSmiths`,
    templates.getApplicantOtpHtml(email, otpCode, isExisting)
  );