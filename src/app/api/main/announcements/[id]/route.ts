import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function GET({ params }: RouteParams) {
  try {
    const { id } = params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ announcement }, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}