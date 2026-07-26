import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    const announcements = await prisma.announcement.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ announcements }, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        category: category || null,
        published: published ?? true,
      },
    });

    return NextResponse.json(
      { message: 'Announcement created successfully', announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}