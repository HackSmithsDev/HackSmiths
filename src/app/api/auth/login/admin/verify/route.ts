import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { createJwtToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 2FA OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase();
    const redisKey = `admin_otp:${cleanEmail}`;

    // 1. Fetch OTP from Redis
    const cachedOtp = await redis.get(redisKey);

    if (!cachedOtp) {
      return NextResponse.json(
        { error: 'Verification code expired or not found. Please log in again.' },
        { status: 400 }
      );
    }

    // 2. Compare OTP
    if (cachedOtp !== otp.trim()) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // 3. OTP Valid -> Find admin record
    const adminUser = await prisma.organizationUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    // 4. Delete used OTP from Redis
    await redis.del(redisKey);

    // 5. Generate Admin JWT token
    const token = await createJwtToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully.',
    });

    // Set authenticated session cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Admin Verify OTP Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}