import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
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

    const archivedMember = await prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.REMOVED },
    });

    return NextResponse.json(
      { message: `Member ${id} soft-deleted successfully`, application: archivedMember },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error soft-deleting member record:', error);
    return NextResponse.json(
      { error: 'Failed to soft-delete member record' },
      { status: 500 }
    );
  }
}