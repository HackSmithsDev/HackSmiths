import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(Array.isArray(body.techStack) && { techStack: body.techStack }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.featured !== undefined && { featured: body.featured }),
      },
    });

    return NextResponse.json(
      { message: 'Project updated successfully', project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}