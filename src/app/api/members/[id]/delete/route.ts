import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendFormDecision } from '@/app/services/email/sender';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Member application record not found' },
        { status: 404 }
      );
    }

    // Attempt to send email, but swallow email-specific errors so deletion proceeds
    let emailSent = false;
    try {
      await sendFormDecision(
        existing.email,
        existing.fullName,
        false,
        'Your member record and application data have been permanently deleted.'
      );
      emailSent = true;
    } catch (emailError) {
      console.error(`Email delivery failed for ${existing.email}:`, emailError);
    }

    // Execute permanent database deletion
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { 
        message: `Member application ${id} deleted successfully`,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error hard-deleting member record:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete member record from database' },
      { status: 500 }
    );
  }
}