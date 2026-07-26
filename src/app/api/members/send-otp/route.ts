import { NextResponse } from "next/server";
import { sendApplicantOtp } from "@/app/services/email/sender"; // Adjust to your actual path
import { prisma } from "@/lib/prisma"; // Replace with your Prisma/Database client or Redis instance
import { setOtp } from "@/lib/redis"; // Replace with your Redis client

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if an application already exists in your DB
    const existingApp = await prisma.application.findFirst({
      where: { email: cleanEmail },
    });

    // 2. Generate a secure 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // 3. Store OTP in database or Redis (Upsert by email)
    await setOtp(cleanEmail, otpCode, expiresAt);

    // 4. Send email dispatch
    const isExisting = Boolean(existingApp);
    await sendApplicantOtp(cleanEmail, otpCode, isExisting);

    return NextResponse.json(
      {
        success: true,
        exists: isExisting,
        applicationId: existingApp?.id || null,
        status: existingApp?.status || null,
        applicationData: existingApp ? JSON.parse(JSON.stringify(existingApp)) : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error] send-otp:", error);
    return NextResponse.json(
      { message: "Internal server error sending verification code." },
      { status: 500 }
    );
  }
}