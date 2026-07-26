import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function DELETE({ params }: RouteParams) {
  try {
    const { id } = params;

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: `Project ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}