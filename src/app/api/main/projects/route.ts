import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';

    const projects = await prisma.project.findMany({
      where: featured ? { featured: true } : {},
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { projects },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);

    return NextResponse.json(
      { error: 'Failed to fetch projects.' },
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
      problem,
      solution,
      category,
      techStack,
      githubUrl,
      liveUrl,
      imageUrl,
      featured,
    } = body;

    if (
      !title ||
      !description ||
      !problem ||
      !solution ||
      !category ||
      !imageUrl
    ) {
      return NextResponse.json(
        {
          error:
            'Title, description, problem, solution, category and image URL are required.',
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);

    const existing = await prisma.project.findUnique({
      where: {
        slug: baseSlug,
      },
    });

    const slug = existing
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;

    const project = await prisma.project.create({
      data: {
        slug,
        title: title.trim(),
        coverImage: imageUrl.trim(),
        shortDesc: description.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        category: category.trim(),

        technologies: Array.isArray(techStack)
          ? techStack
              .map((tech: string) => tech.trim())
              .filter(Boolean)
          : [],

        githubUrl: githubUrl?.trim() || null,
        liveUrl: liveUrl?.trim() || null,

        featured: featured ?? false,
      },
    });

    return NextResponse.json(
      {
        message: 'Project created successfully.',
        project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error creating project:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create project.',
      },
      {
        status: 500,
      }
    );
  }
}