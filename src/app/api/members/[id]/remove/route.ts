import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';
import { sendFormDecision } from '@/app/services/email/sender';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]/remove
 * Soft-deletes a member application by setting status to REMOVED and triggers notification email
 */
export async function PATCH(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    // Send status update email to the applicant
    let emailSent = false;
    try {
      await sendFormDecision(
        archivedMember.email,
        archivedMember.fullName,
        false, // approved = false
        archivedMember.notes || 'Your membership status has been set to removed.'
      );
      emailSent = true;
    } catch (emailError) {
      console.error(`Failed to send removal email to ${archivedMember.email}:`, emailError);
    }

    return NextResponse.json(
      {
        message: `Member ${id} soft-deleted successfully`,
        application: archivedMember,
        emailSent,
      },
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