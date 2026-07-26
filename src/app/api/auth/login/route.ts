import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // or your database client
import { redis } from '@/lib/redis';
import { comparePasswords, createJwtToken } from '@/lib/auth';
import { sendAdminOtp } from '@/app/services/email/sender'; // Your email provider service (Resend/Nodemailer)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 1. Find user in Database
    const user = await prisma.organizationUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 2. Validate Password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 3. Admin Detection & Redis OTP Trigger
    if (user.role === 'ADMIN') {
      // Generate secure 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store in Redis with 5 minutes (300 seconds) expiration
      const redisKey = `admin_otp:${user.email.toLowerCase()}`;
      await redis.set(redisKey, otpCode, 'EX', 300);

      // Send OTP to Admin's email
      await sendAdminOtp(user.email, otpCode);

      return NextResponse.json({
        success: true,
        requires2FA: true,
        message: 'Admin credentials verified. 2FA OTP code dispatched.',
      });
    }

    // 4. Standard Applicant / User Login
    const token = await createJwtToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      requires2FA: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login Route Error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}