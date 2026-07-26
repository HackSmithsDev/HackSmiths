'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step2Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    availability: '10-15 hrs/week',
    projectsDescription: '',
    experience: '',
    hackathonExperience: '',
    whyJoin: '',
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(`app_draft_${params.id}`);
    if (saved) setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
  }, [params.id]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(sessionStorage.getItem(`app_draft_${params.id}`) || '{}');
    sessionStorage.setItem(`app_draft_${params.id}`, JSON.stringify({ ...existing, ...formData }));
    router.push(`/application/${params.id}/step-3`);
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2.5 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-400" />
          2. Experience & Availability
        </h2>

        <div className="space-y-1">
          <label className="text-zinc-400">Weekly Availability *</label>
          <select
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          >
            <option value="5-10 hrs/week">5 - 10 hours / week</option>
            <option value="10-15 hrs/week">10 - 15 hours / week</option>
            <option value="15-20 hrs/week">15 - 20 hours / week</option>
            <option value="20+ hrs/week">20+ hours / week</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400">Projects Description *</label>
          <textarea
            required
            rows={3}
            value={formData.projectsDescription}
            onChange={(e) => setFormData({ ...formData, projectsDescription: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400">Why do you want to join? *</label>
          <textarea
            required
            rows={3}
            value={formData.whyJoin}
            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(`/application/${params.id}/step-1`)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" /> Previous Step
        </button>
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500">
          Next Step <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}