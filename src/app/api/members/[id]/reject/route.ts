import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/members/[id]/reject
 * Sets application status to REJECTED with optional admin notes
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { reason, notes } = body;

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Member application not found' },
        { status: 404 }
      );
    }

    const rejectionNotes = reason || notes || existing.notes;

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.REJECTED,
        ...(rejectionNotes && { notes: rejectionNotes }),
      },
    });

    return NextResponse.json(
      {
        message: 'Member application rejected successfully',
        application: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error rejecting application:', error);
    return NextResponse.json(
      { error: 'Failed to reject member application' },
      { status: 500 }
    );
  }
}