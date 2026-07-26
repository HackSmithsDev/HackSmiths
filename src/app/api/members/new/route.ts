import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

/**
 * POST /api/members/new
 * Public endpoint to submit a new application or update an existing application.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
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

    // 1. Mandatory Field Validation
    if (
      !email ||
      !fullName ||
      !branchAndYear ||
      !phone ||
      !primaryDomain ||
      !projectsDescription ||
      !availability ||
      !whyJoin
    ) {
      return NextResponse.json(
        { error: 'Missing mandatory fields in application form.' },
        { status: 400 }
      );
    }

    // 2. Check if an application already exists under this email
    const existingApplication = await prisma.application.findFirst({
      where: { email },
    });

    let application;

    if (existingApplication) {
      // Refresh application details and reset status to PENDING for review
      application = await prisma.application.update({
        where: { id: existingApplication.id },
        data: {
          fullName,
          branchAndYear,
          phone,
          primaryDomain,
          skills: Array.isArray(skills) ? skills : [],
          projectsDescription,
          githubUrl: githubUrl || null,
          portfolioUrl: portfolioUrl || null,
          linkedinUrl: linkedinUrl || null,
          experience: experience || null,
          hackathonExperience: hackathonExperience || null,
          availability,
          whyJoin,
          status: ApplicationStatus.PENDING,
        },
      });
    } else {
      // Create a new application record
      application = await prisma.application.create({
        data: {
          email,
          fullName,
          branchAndYear,
          phone,
          primaryDomain,
          skills: Array.isArray(skills) ? skills : [],
          projectsDescription,
          githubUrl: githubUrl || null,
          portfolioUrl: portfolioUrl || null,
          linkedinUrl: linkedinUrl || null,
          experience: experience || null,
          hackathonExperience: hackathonExperience || null,
          availability,
          whyJoin,
          status: ApplicationStatus.PENDING,
        },
      });
    }

    return NextResponse.json(
      {
        message: existingApplication
          ? 'Application details updated successfully'
          : 'Application submitted successfully',
        application,
      },
      { status: existingApplication ? 200 : 201 }
    );
  } catch (error) {
    console.error('Error handling application submission:', error);
    return NextResponse.json(
      { error: 'Failed to process application submission.' },
      { status: 500 }
    );
  }
}