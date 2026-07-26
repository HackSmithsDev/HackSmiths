import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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
        ...(body.slug !== undefined && { slug: body.slug }),
        
        // Map frontend 'coverImage' or 'imageUrl'
        ...((body.coverImage !== undefined || body.imageUrl !== undefined) && { 
          coverImage: body.coverImage ?? body.imageUrl 
        }),
        
        ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc }),
        ...(body.problem !== undefined && { problem: body.problem }),
        ...(body.solution !== undefined && { solution: body.solution }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.status !== undefined && { status: body.status }),
        
        // Map frontend 'technologies' or 'techStack'
        ...((Array.isArray(body.technologies) || Array.isArray(body.techStack)) && { 
          technologies: body.technologies ?? body.techStack 
        }),
        
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl }),
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