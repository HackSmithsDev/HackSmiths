import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@/generated/prisma';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      slug,
      title,
      coverImage,
      shortDesc,
      problem,
      solution,
      technologies,
      category,
      status,
      githubUrl,
      liveUrl,
      featured,
    } = body;

    // Validation
    if (!title || !coverImage || !shortDesc || !problem || !solution || !category) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: title, coverImage, shortDesc, problem, solution, and category are required.',
        },
        { status: 400 }
      );
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    // Check slug collision
    const existingSlug = await prisma.project.findUnique({
      where: { slug: finalSlug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `A project with the slug "${finalSlug}" already exists.` },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        slug: finalSlug,
        title,
        coverImage,
        shortDesc,
        problem,
        solution,
        technologies: Array.isArray(technologies) ? technologies : [],
        category,
        status: status && Object.values(ProjectStatus).includes(status) ? status : ProjectStatus.IN_PROGRESS,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured: typeof featured === 'boolean' ? featured : false,
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