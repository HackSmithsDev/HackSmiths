import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: `Announcement ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}