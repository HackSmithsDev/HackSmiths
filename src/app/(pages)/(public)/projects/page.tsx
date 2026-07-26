import Link from 'next/link';
import { ExternalLink, ArrowRight, Code2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // SSR cache revalidation every 60s

async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Project Showcase
        </h1>
        <p className="text-muted-foreground">
          Explore production-ready software, open-source tools, and hackathon prototypes built by HackSmiths.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl border-border">
          <Code2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground">No projects featured yet</p>
          <p className="text-sm text-muted-foreground">Check back soon for active deployments!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                  {project.shortDesc}
                </p>

                {/* Tech Stack Pills */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <FaGithub className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
                  <Link href={`/projects/${project.id}`}>
                    Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}