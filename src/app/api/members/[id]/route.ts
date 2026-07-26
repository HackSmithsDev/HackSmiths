import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/members/[id]
 * Fetch single member / application by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Member application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Error fetching member details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve member details' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/members/[id]
 * Update specific member details or admin fields (status, notes, etc.)
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    const {
      status,
      notes,
      fullName,
      branchAndYear,
      phone,
      primaryDomain,
      skills,
      projectsDescription,
      githubUrl,
      portfolioUrl,
      linkedinUrl,
      experience,
      hackathonExperience,
      availability,
      whyJoin,
    } = body;

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Member application not found' },
        { status: 404 }
      );
    }

    if (
      status &&
      !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
    ) {
      return NextResponse.json(
        { error: 'Invalid application status provided' },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status: status as ApplicationStatus }),
        ...(notes !== undefined && { notes }),
        ...(fullName && { fullName }),
        ...(branchAndYear && { branchAndYear }),
        ...(phone && { phone }),
        ...(primaryDomain && { primaryDomain }),
        ...(skills && { skills: Array.isArray(skills) ? skills : existing.skills }),
        ...(projectsDescription && { projectsDescription }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(experience !== undefined && { experience }),
        ...(hackathonExperience !== undefined && { hackathonExperience }),
        ...(availability && { availability }),
        ...(whyJoin && { whyJoin }),
      },
    });

    return NextResponse.json(
      {
        message: 'Member record updated successfully',
        application: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating member details:', error);
    return NextResponse.json(
      { error: 'Failed to update member record' },
      { status: 500 }
    );
  }
}