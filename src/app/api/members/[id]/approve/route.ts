import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';
import { sendFormDecision } from '@/app/services/email/sender';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]/approve
 * Sets application status to APPROVED and triggers approval email
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { notes } = body;

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Member application not found' },
        { status: 404 }
      );
    }

    const updatedNotes = notes || existing.notes;

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.APPROVED,
        ...(notes && { notes }),
      },
    });

    // Send decision email to the applicant
    let emailSent = false;
    try {
      await sendFormDecision(
        updatedApplication.email,
        updatedApplication.fullName,
        true, // approved = true
        updatedNotes || undefined
      );
      emailSent = true;
    } catch (emailError) {
      console.error(`Failed to send approval email to ${updatedApplication.email}:`, emailError);
    }

    return NextResponse.json(
      {
        message: 'Member application approved successfully',
        application: updatedApplication,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { error: 'Failed to approve member application' },
      { status: 500 }
    );
  }
}