'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FolderPlus,
  Globe,
  Plus,
  X,
  Loader2,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export enum ProjectStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export default function AddProjectPage() {
  const router = useRouter();

  // Form States mapped to Prisma Schema
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState('Web App');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.IN_PROGRESS);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  // Tech stack builder state
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([
    'Next.js',
    'React',
    'TypeScript',
  ]);

  // Submission / error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechnologies(technologies.filter((t) => t !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title,
      slug,
      coverImage,
      shortDesc,
      problem,
      solution,
      technologies,
      category,
      status,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      featured,
    };

    try {
      const res = await fetch('/api/main/projects/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Could not register project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-mono text-xs pb-20 sm:pb-8">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-indigo-400" />
            Register New Project
          </h1>
        </div>

        {/* Top Actions (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/admin/projects"
            className="rounded-lg border border-zinc-800 px-3.5 py-2 text-zinc-400 hover:bg-zinc-900 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="add-project-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Publish Project
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form id="add-project-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 space-y-4 backdrop-blur-sm">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. SmartMechanic Core"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="smartmechanic-core"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category, Status & Featured Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Category *</label>
              <input
                type="text"
                required
                value={category}
                placeholder='e.g. "Web App", "AI/ML"'
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value={ProjectStatus.IN_PROGRESS}>IN_PROGRESS</option>
                <option value={ProjectStatus.COMPLETED}>COMPLETED</option>
                <option value={ProjectStatus.ARCHIVED}>ARCHIVED</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2 md:col-span-1 flex flex-col justify-end">
              <label className="flex items-center justify-between sm:justify-start gap-2 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-300 hover:bg-zinc-800 transition">
                <span className="flex items-center gap-2">
                  <Star
                    className={`h-4 w-4 ${
                      featured ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'
                    }`}
                  />
                  <span>Featured Showcase</span>
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1">
            <label className="text-zinc-400 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" /> Cover Image URL *
            </label>
            <input
              type="text"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-zinc-400">Short Description *</label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief high-level overview..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Problem Statement *</label>
              <textarea
                rows={3}
                required
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What core issue does this build solve?"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Solution Statement *</label>
              <textarea
                rows={3}
                required
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="How does your architecture address the problem?"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GitHub & Live URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 flex items-center gap-1">
                <FaGithub className="h-3.5 w-3.5" /> GitHub Repository
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Live URL / Endpoint
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://app.domain.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tech Stack Chip Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-zinc-400">Tech Stack Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTech())
                }
                placeholder="Add technology (e.g. Prisma)..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700 transition"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300 border border-indigo-500/20"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}