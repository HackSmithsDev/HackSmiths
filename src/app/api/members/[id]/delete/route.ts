import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Member application not found' },
        { status: 404 }
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: `Member ${id} hard-deleted permanently from database` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error hard-deleting member record:', error);
    return NextResponse.json(
      { error: 'Failed to permanently delete member record' },
      { status: 500 }
    );
  }
}