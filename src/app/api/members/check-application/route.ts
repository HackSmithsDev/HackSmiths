import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ exists: false, error: 'Email query parameter required' }, { status: 400 });
  }

  try {
    const existingMember = await prisma.member.findUnique({
      where: { email },
      select: { id: true, status: true },
    });

    if (existingMember) {
      return NextResponse.json({
        exists: true,
        applicationId: existingMember.id,
        status: existingMember.status,
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Check application error:', error);
    return NextResponse.json({ exists: false, error: 'Server error' }, { status: 500 });
  }
}