/**
 * 🛠️ System Terminal Email Layout Wrapper
 */
function globalEmailLayout(title: string, preheader: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="background-color: #09090b; color: #a1a1aa; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 20px; margin: 0; -webkit-font-smoothing: antialiased;">
        <span style="display: none; max-height: 0px; overflow: hidden;">${preheader}</span>
        <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #18181b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <div style="background-color: #09090b; padding: 28px 24px 16px 24px; border-bottom: 1px solid #18181b; text-align: center;">
            <h1 style="color: #f4f4f5; font-size: 16px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin: 0;">HACK<span style="color: #6366f1;">SMITHS</span></h1>
            <p style="color: #52525b; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; margin: 4px 0 0 0;">Application & Management Portal</p>
          </div>

          <div style="padding: 32px 24px;">
            ${contentHtml}
          </div>

          <div style="background-color: #09090b; padding: 20px 24px; border-top: 1px solid #18181b; text-align: center;">
            <p style="color: #3f3f46; font-size: 10px; line-height: 1.5; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
              Automated dispatch node.<br>
              © ${new Date().getFullYear()} HackSmiths. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}

// ---------------------------------------------------------------------
// 1. APPLICANT: FORM SUBMISSION CONFIRMATION
// ---------------------------------------------------------------------
export const getFormSubmittedHtml = (applicantName: string, applicationId: string): string => globalEmailLayout(
  "Application Received",
  "Your application form has hit our submission registry.",
  `
    <h3 style="color: #f4f4f5; font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 0;">// APPLICATION LOGGED SUCCESSFULLY</h3>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">Hello <strong>${applicantName}</strong>,</p>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">We have successfully received your submission. Your details are recorded in our evaluation stack under ID <strong>#${applicationId}</strong>.</p>
    <div style="background-color: #18181b; border: 1px solid #27272a; padding: 16px; border-radius: 6px; margin-top: 20px; font-size: 12px;">
      <span style="color: #e4e4e7; font-weight: 700;">Status:</span> 
      <span style="color: #f59e0b; font-weight: 900; margin-left: 6px; text-transform: uppercase;">UNDER_REVIEW</span>
    </div>
  `
);

// ---------------------------------------------------------------------
// 2. APPLICANT: FORM DECISION (APPROVED / REJECTED)
// ---------------------------------------------------------------------
export const getFormDecisionHtml = (applicantName: string, approved: boolean, notes?: string): string => globalEmailLayout(
  approved ? "Application Approved" : "Application Status Update",
  approved ? "Your submission was accepted." : "Your application status has been updated.",
  `
    <h3 style="color: ${approved ? '#10b981' : '#ef4444'}; font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 0;">
      ${approved ? "// APPLICATION ACCEPTED" : "// APPLICATION NOT SELECTED"}
    </h3>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">Hello <strong>${applicantName}</strong>,</p>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">
      ${approved 
        ? "Congratulations! Your application has been reviewed and selected by our core team. We will be reaching out shortly with next steps." 
        : "Thank you for taking the time to apply. After reviewing your submission against our criteria, we are unable to move forward with your application at this time."}
    </p>
    ${notes ? `<div style="background-color: #18181b; border: 1px solid #27272a; padding: 14px; border-radius: 6px; font-size: 11px; margin-top: 16px; line-height: 1.5; color: #d4d4d8;"><strong style="color: #f4f4f5;">Admin Remarks:</strong> ${notes}</div>` : ""}
  `
);

// ---------------------------------------------------------------------
// 3. ADMIN: COMBINED OTP & SECURITY ALERT EMAIL
// ---------------------------------------------------------------------
export const getAdminOtpHtml = (adminEmail: string, otpCode: string, timeStr: string, ipAddress?: string): string => globalEmailLayout(
  "Admin Verification & Security Alert",
  `Your verification code is ${otpCode}`,
  `
    <h3 style="color: #6366f1; font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 0;">// ADMIN ACCESS REQUESTED</h3>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">A login attempt was initiated for <strong>${adminEmail}</strong>.</p>
    
    <div style="background-color: #18181b; border: 1px solid #27272a; color: #6366f1; font-size: 32px; font-weight: 900; letter-spacing: 0.25em; text-align: center; padding: 18px; margin: 20px 0; border-radius: 8px; font-family: monospace;">
      ${otpCode}
    </div>

    <!-- Security Metadata Box -->
    <div style="background-color: #121215; border: 1px solid #1c1c21; border-radius: 6px; padding: 12px 16px; font-size: 11px; color: #71717a; line-height: 1.6;">
      <div><strong style="color: #a1a1aa;">Requested At:</strong> ${timeStr}</div>
      ${ipAddress ? `<div><strong style="color: #a1a1aa;">IP Address:</strong> <code style="color: #e4e4e7;">${ipAddress}</code></div>` : ''}
    </div>

    <p style="font-size: 10px; color: #52525b; text-align: center; margin-top: 16px;">
      If you did not request this login, ignore this code and secure your credentials immediately.
    </p>
  `
);

// ---------------------------------------------------------------------
// 4. APPLICANT: WELCOME + VERIFICATION OTP
// ---------------------------------------------------------------------
export const getApplicantOtpHtml = (email: string, otpCode: string, isExisting: boolean): string => globalEmailLayout(
  isExisting ? "Resume Your Application" : "Welcome to HackSmiths",
  `Your verification code is ${otpCode}`,
  `
    <h3 style="color: #6366f1; font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 0;">
      ${isExisting ? "// RESUME YOUR APPLICATION" : "// WELCOME TO HACKSMITHS"}
    </h3>
    <p style="font-size: 12px; line-height: 1.7; color: #a1a1aa;">
      ${isExisting 
        ? `We found an active record associated with <strong>${email}</strong>. Enter the verification code below to edit or view your application.` 
        : `Thanks for starting your application to the Core Builder Collective! Enter the code below to verify your email address (<strong>${email}</strong>) and proceed.`}
    </p>

    <div style="background-color: #18181b; border: 1px solid #27272a; color: #6366f1; font-size: 32px; font-weight: 900; letter-spacing: 0.25em; text-align: center; padding: 18px; margin: 20px 0; border-radius: 8px; font-family: monospace;">
      ${otpCode}
    </div>

    <p style="font-size: 11px; color: #71717a; text-align: center; margin-top: 12px;">
      This code expires in 10 minutes. If you did not request this verification, please ignore this email.
    </p>
  `
);