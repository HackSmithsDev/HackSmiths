'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FolderGit2, Github, Globe, Save, Trash2, X, Plus, CheckCircle2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [title, setTitle] = useState('SmartMechanic Next.js Suite');
  const [description, setDescription] = useState('Automated engineering matrix deployment stack.');
  const [githubUrl, setGithubUrl] = useState('https://github.com/org/repo');
  const [liveUrl, setLiveUrl] = useState('https://smartmechanic.io');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['Next.js', 'Prisma', 'PostgreSQL', 'Docker']);
  const [saved, setSaved] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter((t) => t !== item));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this project?')) {
      router.push('/admin/projects');
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl font-mono text-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3 py-2 font-mono text-xs font-semibold text-rose-400 hover:bg-rose-900/40 transition"
        >
          <Trash2 className="h-4 w-4" />
          Delete Project
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
          <div className="space-y-1">
            <label className="text-zinc-400">Project Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Overview / Summary</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-zinc-400">Tech Stack Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="Add technology..."
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

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Save className="h-4 w-4" />
            Update Record
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Project updated!
            </span>
          )}
        </div>
      </form>
    </main>
  );
}