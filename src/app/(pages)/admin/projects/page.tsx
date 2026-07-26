'use client';

import Link from 'next/link';
import { FolderGit2, Plus, ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      id: 'proj-1',
      title: 'SmartMechanic Next.js Suite',
      description: 'Automated engineering matrix deployment stack.',
      techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com',
    },
  ];

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-indigo-400" />
            Project Showcase Repository
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated developer projects and platform software builds.
          </p>
        </div>

        <Link
          href="/admin/projects/add"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">{proj.title}</h3>
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-zinc-400 font-sans text-xs">{proj.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {proj.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-indigo-300 border border-zinc-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}