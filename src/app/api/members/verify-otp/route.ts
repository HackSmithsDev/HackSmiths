import { NextResponse } from "next/server";
import { getOtp, deleteOtp } from "@/lib/redis"; // Replace with your Redis client

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
    const token = await getOtp(cleanEmail);

    if (!token) {
      return NextResponse.json(
        { message: "No active code found. Please request a new code." },
        { status: 400 }
      );
    }

    // 2. Check code validity
    if (token !== code.trim()) {
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // 3. Clean up token upon successful verification
    await deleteOtp(cleanEmail);

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