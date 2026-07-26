import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

/**
 * GET /api/members
 * Query Params: ?status=PENDING | APPROVED | REJECTED
 * Filters member applications by status, or returns all if omitted.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status')?.toUpperCase();

    let statusFilter: ApplicationStatus | undefined = undefined;
    if (
      statusParam &&
      Object.values(ApplicationStatus).includes(statusParam as ApplicationStatus)
    ) {
      statusFilter = statusParam as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      {
        filter: statusFilter || 'ALL',
        count: applications.length,
        members: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching member applications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve member records' },
      { status: 500 }
    );
  }
}