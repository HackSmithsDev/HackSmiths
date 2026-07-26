'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FolderGit2,
  Globe,
  Trash2,
  X,
  Plus,
  CheckCircle2,
  Loader2,
  Star,
  Image as ImageIcon,
  AlertCircle,
  Save,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export enum ProjectStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

interface ProjectData {
  slug: string;
  title: string;
  coverImage: string;
  shortDesc: string;
  problem: string;
  solution: string;
  category: string;
  status: ProjectStatus;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  technologies: string[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Initial fetched snapshot for dirty checking
  const [initialData, setInitialData] = useState<ProjectData | null>(null);

  // Form States
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
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
  const [technologies, setTechnologies] = useState<string[]>([]);

  // Page level indicators
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to populate form & initial snapshot
  const populateFormData = (proj: any) => {
    const formattedData: ProjectData = {
      slug: proj.slug || '',
      title: proj.title || '',
      coverImage: proj.coverImage || '',
      shortDesc: proj.shortDesc || '',
      problem: proj.problem || '',
      solution: proj.solution || '',
      category: proj.category || 'Web App',
      status: proj.status || ProjectStatus.IN_PROGRESS,
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      featured: proj.featured || false,
      technologies: proj.technologies || [],
    };

    setInitialData(formattedData);

    setSlug(formattedData.slug);
    setTitle(formattedData.title);
    setCoverImage(formattedData.coverImage);
    setShortDesc(formattedData.shortDesc);
    setProblem(formattedData.problem);
    setSolution(formattedData.solution);
    setCategory(formattedData.category);
    setStatus(formattedData.status);
    setGithubUrl(formattedData.githubUrl);
    setLiveUrl(formattedData.liveUrl);
    setFeatured(formattedData.featured);
    setTechnologies(formattedData.technologies);
  };

  // Fetch Project Details
  const fetchProject = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/main/projects/${id}`);
      if (!res.ok) throw new Error('Failed to load project record');
      const data = await res.json();
      const proj = data.project || data;

      populateFormData(proj);
    } catch (err: any) {
      console.error('Error loading project:', err);
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Determine if form has unsaved edits
  const isDirty = useMemo(() => {
    if (!initialData) return false;

    const hasBasicDiff =
      slug !== initialData.slug ||
      title !== initialData.title ||
      coverImage !== initialData.coverImage ||
      shortDesc !== initialData.shortDesc ||
      problem !== initialData.problem ||
      solution !== initialData.solution ||
      category !== initialData.category ||
      status !== initialData.status ||
      githubUrl !== initialData.githubUrl ||
      liveUrl !== initialData.liveUrl ||
      featured !== initialData.featured;

    const hasTechDiff =
      technologies.length !== initialData.technologies.length ||
      technologies.some((tech, idx) => tech !== initialData.technologies[idx]);

    return hasBasicDiff || hasTechDiff;
  }, [
    initialData,
    slug,
    title,
    coverImage,
    shortDesc,
    problem,
    solution,
    category,
    status,
    githubUrl,
    liveUrl,
    featured,
    technologies,
  ]);

  // Execute Manual Update Request
  const handleUpdate = async () => {
    if (!id || !isDirty) return;

    setSavingStatus('saving');
    setError(null);

    const payload = {
      slug,
      title,
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
      const res = await fetch(`/api/main/projects/${id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Update failed');
      }

      // Update initial baseline snapshot to current form state upon successful update
      setInitialData({
        slug,
        title,
        coverImage,
        shortDesc,
        problem,
        solution,
        category,
        status,
        githubUrl,
        liveUrl,
        featured,
        technologies,
      });

      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Update error:', err);
      setSavingStatus('error');
      setError(err.message || 'Could not update project changes.');
    }
  };

  // Tech stack actions
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently remove this project?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/main/projects/${id}/delete`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project');
      router.push('/admin/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Could not delete project. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 lg:p-8 flex items-center justify-center min-h-[400px] font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Fetching project record...
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-mono text-xs pb-16">
      {/* Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-indigo-400" />
            Edit Project Record <span className="text-zinc-500 text-xs">[{id}]</span>
          </h1>
        </div>

        {/* Dynamic Status & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs mr-2">
            {savingStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </span>
            )}
            {savingStatus === 'saved' && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Updated successfully
              </span>
            )}
            {savingStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="h-3.5 w-3.5" />
                Update failed
              </span>
            )}
            {savingStatus === 'idle' && isDirty && (
              <span className="text-amber-400/90 text-[11px]">Unsaved changes</span>
            )}
          </div>

          {/* Conditional Update Button */}
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!isDirty || savingStatus === 'saving'}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 font-semibold text-indigo-400 hover:bg-indigo-500/20 transition disabled:opacity-40 disabled:hover:bg-indigo-500/10 disabled:cursor-not-allowed cursor-pointer"
          >
            {savingStatus === 'saving' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Update Project
          </button>

          {/* Delete Action Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3 py-2 font-semibold text-rose-400 hover:bg-rose-900/40 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400">
          {error}
        </div>
      )}

      {/* Dynamic Form Container */}
      <div className="space-y-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6 space-y-5 backdrop-blur-sm">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category, Status & Featured Toggle */}
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

          {/* Row 3: Cover Image URL */}
          <div className="space-y-1">
            <label className="text-zinc-400 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" /> Cover Image URL *
            </label>
            <input
              type="text"
              required
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Row 4: Short Description */}
          <div className="space-y-1">
            <label className="text-zinc-400">Short Description *</label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Row 5: Problem & Solution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Problem Statement *</label>
              <textarea
                rows={4}
                required
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Solution Statement *</label>
              <textarea
                rows={4}
                required
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: GitHub & Live Endpoint URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 flex items-center gap-1">
                <FaGithub className="h-3.5 w-3.5" /> GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Live URL / Preview Endpoint
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 7: Tech Stack Builder */}
          <div className="space-y-2 pt-2">
            <label className="text-zinc-400">Technologies Stack</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTech())
                }
                placeholder="Add technology (e.g. Next.js, Prisma)..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
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
                    className="text-indigo-400 hover:text-indigo-200 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}