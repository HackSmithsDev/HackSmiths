'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderPlus, Github, Globe, Plus, X } from 'lucide-react';

export default function AddProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js', 'React', 'TypeScript']);

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter((t) => t !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Dispatch save logic here...
    router.push('/admin/projects');
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl font-mono text-xs">
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
          <div className="space-y-1">
            <label className="text-zinc-400">Project Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SmartMechanic Core"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Overview / Summary *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the system handles..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 flex items-center gap-1">
                <Github className="h-3.5 w-3.5" /> GitHub Repository
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
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="Add technology (e.g. Prisma)..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-200 hover:bg-zinc-700"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {techStack.map((tech) => (
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

        <div className="flex justify-end gap-2">
          <Link
            href="/admin/projects"
            className="rounded-lg border border-zinc-800 px-4 py-2.5 text-zinc-400 hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
          >
            Publish Project
          </button>
        </div>
      </form>
    </main>
  );
}