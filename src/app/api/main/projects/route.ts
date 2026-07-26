import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const projects = await prisma.project.findMany({
      where: featured ? { featured: true } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      imageUrl,
      featured,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required fields.' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : [],
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(
      { message: 'Project created successfully', project },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}