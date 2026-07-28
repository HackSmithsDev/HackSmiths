import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { ExternalLink, ArrowRight, Code2, Sparkles, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export const revalidate = 60;

interface Project {
  id: string;
  slug: string;
  title: string;
  coverImage?: string;
  shortDesc: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  category: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt?: string;
}

async function getProjects(): Promise<Project[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/main/projects`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch projects from API: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.projects || data || [];
  } catch (error) {
    console.error('Error fetching projects via API:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3 border-b border-zinc-800/80 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            HackSmiths Forge
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Project Showcase
          </h1>
          <p className="text-zinc-400 font-sans text-xs sm:text-sm max-w-2xl leading-relaxed">
            Explore production-ready software, AI models, and hackathon prototypes engineered by the collective.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-xl border-zinc-800/80 bg-zinc-900/20">
            <Code2 className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-base font-bold text-zinc-300">No projects featured yet</p>
            <p className="text-xs text-zinc-500 font-sans mt-1">Check back soon for active deployments and releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-lg transition-all hover:border-indigo-500/50 hover:bg-zinc-900/70"
              >
                <div>
                  {/* Cover Image Preview (if present) */}
                  {project.coverImage ? (
                    <div className="relative h-44 w-full bg-zinc-900 border-b border-zinc-800/80 overflow-hidden">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-800/80 flex items-center justify-center text-zinc-700">
                      <FolderGit2 className="h-8 w-8 opacity-40" />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Header Badges & Title */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                          {project.category || 'Software'}
                        </span>
                        {project.featured && (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h2>
                    </div>

                    {/* Short Description */}
                    <p className="text-zinc-400 font-sans text-xs line-clamp-3 leading-relaxed">
                      {project.shortDesc}
                    </p>

                    {/* Tech Stack Badges */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="rounded-md bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 text-[11px] text-zinc-300 font-mono"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/40">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition"
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
                        className="p-1.5 rounded-md text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800/60 transition"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition group/link"
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}