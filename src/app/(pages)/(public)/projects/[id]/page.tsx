import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { ArrowLeft, ExternalLink, Calendar, Code2, AlertCircle, Lightbulb, Sparkles, Tag } from 'lucide-react';
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
  createdAt: string;
}

async function getProjectById(id: string): Promise<Project | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Fetch directly using [id] route
    const res = await fetch(`${baseUrl}/api/main/projects/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch project by ID ${id}:`, res.status);
      return null;
    }

    const data = await res.json();
    return data.project || data;
  } catch (error) {
    console.error(`Error fetching project by ID ${id}:`, error);
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Navigation Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 text-xs transition group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </Link>

        {/* Cover Image Banner */}
        {project.coverImage && (
          <div className="relative h-64 sm:h-80 w-full rounded-xl border border-zinc-800/80 bg-zinc-900 overflow-hidden shadow-2xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Header Metadata Block */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          
          <div className="space-y-3">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                <Tag className="h-3 w-3" />
                {project.category || 'Software'}
              </span>

              <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                project.status === 'COMPLETED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : project.status === 'IN_PROGRESS'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {project.status.replace('_', ' ')}
              </span>

              {project.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
              {project.title}
            </h1>

            {/* Publication Date */}
            {formattedDate && (
              <p className="flex items-center gap-1.5 text-zinc-500 font-sans text-xs">
                <Calendar className="h-3.5 w-3.5" />
                Published {formattedDate}
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed border-t border-zinc-800/80 pt-4">
            {project.shortDesc}
          </p>

          {/* Tech Stack Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                Technologies & Tools
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-md bg-zinc-800/80 text-indigo-300 border border-zinc-700/60 px-2.5 py-1 text-xs font-mono"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800/80">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-4 py-2 font-semibold transition"
              >
                <FaGithub className="h-4 w-4" />
                Source Code
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 transition shadow-lg shadow-indigo-500/20"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo / Deployment
              </a>
            )}
          </div>

        </div>

        {/* Problem & Solution Sections */}
        {(project.problem || project.solution) && (
          <div className="space-y-6">
            {project.problem && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  The Problem
                </h2>
                <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {project.problem}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                  <Lightbulb className="h-4 w-4 text-emerald-400" />
                  The Solution & Architecture
                </h2>
                <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}