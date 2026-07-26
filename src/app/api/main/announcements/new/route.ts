import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, published } = body;

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and category are required.' },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        category,
        published: typeof published === 'boolean' ? published : true,
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