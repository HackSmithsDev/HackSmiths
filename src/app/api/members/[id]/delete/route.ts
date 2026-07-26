import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendFormDecision } from '@/app/services/email/sender';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/members/[id]/delete
 * Permanently removes a member application record from the database and sends a notification email.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
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

    // Attempt to notify applicant before deleting the record
    let emailSent = false;
    try {
      await sendFormDecision(
        existing.email,
        existing.fullName,
        false, // approved = false
        'Your member record and application data have been deleted.'
      );
      emailSent = true;
    } catch (emailError) {
      console.error(`Failed to send deletion notice email to ${existing.email}:`, emailError);
    }

    // Execute permanent deletion from database
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { 
        message: `Member ${id} hard-deleted permanently from database`,
        emailSent,
      },
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