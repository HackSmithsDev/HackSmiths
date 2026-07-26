import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';
import { sendFormDecision } from '@/app/services/email/sender';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]/reject
 * Sets application status to REJECTED with optional admin notes and triggers rejection email
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Send decision email to the applicant
    let emailSent = false;
    try {
      await sendFormDecision(
        updatedApplication.email,
        updatedApplication.fullName,
        false, // approved = false
        rejectionNotes || undefined
      );
      emailSent = true;
    } catch (emailError) {
      console.error(`Failed to send rejection email to ${updatedApplication.email}:`, emailError);
    }

    return NextResponse.json(
      {
        message: 'Member application rejected successfully',
        application: updatedApplication,
        emailSent,
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