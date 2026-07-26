import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Replace with your database/Redis client

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Fetch stored verification token
    const record = await db.verificationToken.findUnique({
      where: { identifier: cleanEmail },
    });

    if (!record) {
      return NextResponse.json(
        { message: "No active code found. Please request a new code." },
        { status: 400 }
      );
    }

    // 2. Check code validity
    if (record.token !== code.trim()) {
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // 3. Check expiration
    if (new Date() > new Date(record.expires)) {
      await db.verificationToken.delete({ where: { identifier: cleanEmail } });
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // 4. Clean up token upon successful verification
    await db.verificationToken.delete({ where: { identifier: cleanEmail } });

    return NextResponse.json(
      { success: true, message: "Email successfully verified." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Error] verify-otp:", error);
    return NextResponse.json(
      { message: "Internal server error during verification." },
      { status: 500 }
    );
  }
}