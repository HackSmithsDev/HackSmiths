'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FolderGit2,
  Plus,
  Loader2,
  RefreshCw,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export enum ProjectStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

interface Project {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  shortDesc: string;
  problem: string;
  solution: string;
  technologies: string[];
  category: string;
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/main/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle project deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/main/projects/${id}/delete`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Could not delete project. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case ProjectStatus.ARCHIVED:
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-7xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-indigo-400" />
            Project Showcase Repository
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated developer projects and platform software builds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/projects/add"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Loading project builds...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-500">
          No projects found. Click "Add Project" to register a new build.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm hover:border-zinc-700 transition"
            >
              {/* Top Bar / Metadata */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition">
                      {proj.title}
                    </span>
                    {proj.featured && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400 border border-amber-500/20 font-semibold">
                        <Star className="h-3 w-3 fill-amber-400" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-zinc-400 hover:text-zinc-200 transition"
                        title="GitHub Repository"
                      >
                        <FaGithub className="h-4 w-4" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-zinc-400 hover:text-indigo-400 transition"
                        title="Live Preview"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${proj.id}`}
                      className="p-1 text-zinc-400 hover:text-amber-400 transition"
                      title="Edit Project"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      disabled={deletingId === proj.id}
                      className="p-1 text-zinc-400 hover:text-rose-400 transition disabled:opacity-50"
                      title="Delete Project"
                    >
                      {deletingId === proj.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Category & Status Badges */}
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700 uppercase">
                    {proj.category}
                  </span>
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadge(
                      proj.status
                    )}`}
                  >
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Cover Image Preview */}
                {proj.coverImage && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950">
                    <Image
                      src={proj.coverImage}
                      alt={proj.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                {/* Short Description */}
                <p className="text-zinc-400 font-sans text-xs leading-relaxed line-clamp-2">
                  {proj.shortDesc}
                </p>
              </div>

              {/* Bottom Tech Stack Badges */}
              <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                {proj.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-zinc-800/60 px-2 py-0.5 text-[10px] text-indigo-300 border border-zinc-700/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}