import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{project.title}</h1>
          <p className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Calendar className="h-3.5 w-3.5" />
            Published on {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Technologies Array */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string, i: number) => (
              <span key={i} className="rounded-md bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-mono">
                {tech.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Detailed Breakdown */}
        <div className="prose prose-neutral dark:prose-invert max-w-none border-t border-border/40 pt-6 space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed font-medium">
            {project.shortDesc}
          </p>

          {project.problem && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Problem Statement</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </div>
          )}

          {project.solution && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Solution</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </div>
          )}
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-border/40">
          {project.githubUrl && (
            <Button asChild variant="outline" className="gap-2">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <FaGithub className="h-4 w-4" />
                View Source Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild className="gap-2">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Visit Live Application
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}