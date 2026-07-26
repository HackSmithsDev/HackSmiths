import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/generated/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      fullName,
      branch,
      semester,
      phone,
      primaryDomain,
      skills,
      githubUrl,
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
      !branch ||
      !semester ||
      !phone ||
      !primaryDomain ||
      !availability ||
      !whyJoin
    ) {
      return NextResponse.json(
        { error: 'Missing mandatory fields in application form.' },
        { status: 400 }
      );
    }

    // 2. FORCE INT CONVERSION HERE
    const parsedSemester = parseInt(String(semester), 10);

    if (isNaN(parsedSemester)) {
      return NextResponse.json(
        { error: 'Semester must be a valid integer number.' },
        { status: 400 }
      );
    }

    // 3. Check if an application already exists under this email
    const existingApplication = await prisma.application.findFirst({
      where: { email },
    });

    let application;

    if (existingApplication) {
      application = await prisma.application.update({
        where: { id: existingApplication.id },
        data: {
          fullName,
          branch,
          semester: parsedSemester, // 👈 USE parsedSemester
          phone,
          primaryDomain,
          skills: Array.isArray(skills) ? skills : [],
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null,
          experience: experience || null,
          hackathonExperience: Boolean(hackathonExperience),
          availability,
          whyJoin,
          status: ApplicationStatus.PENDING,
        },
      });
    } else {
      application = await prisma.application.create({
        data: {
          email,
          fullName,
          branch,
          semester: parsedSemester, // 👈 USE parsedSemester
          phone,
          primaryDomain,
          skills: Array.isArray(skills) ? skills : [],
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null,
          experience: experience || null,
          hackathonExperience: Boolean(hackathonExperience),
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