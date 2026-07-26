'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, Plus, X, ArrowRight } from 'lucide-react';

export default function Step1Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    branch: '',
    semester: '',
    phone: '',
    primaryDomain: 'Frontend',
    skills: [] as string[],
  });

  useEffect(() => {
    if (!id) return;
    const saved = sessionStorage.getItem(`app_draft_${id}`);
    if (saved) setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
  }, [id]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      alert('Please add at least one technical skill tag.');
      return;
    }

    // Save partial draft
    const existing = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
    sessionStorage.setItem(`app_draft_${id}`, JSON.stringify({ ...existing, ...formData }));

    router.push(`/application/${id}/step-2`);
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-200 border-b border-zinc-800 pb-2.5 flex items-center gap-2">
          <User className="h-4 w-4 text-indigo-400" />
          1. Basic & Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">Full Name *</label>
            <input
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400">Email Address *</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400">Branch  *</label>
            <input
              required
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400">Semester *</label>
            <input
              required
              type="number"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none" min={1}
              max={8}
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400">Phone Number *</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400">Primary Domain *</label>
            <select
              required
              value={formData.primaryDomain}
              onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>
        </div>

        {/* Dynamic Skills */}
        <div className="space-y-1 pt-1">
          <label className="text-zinc-400">Skills & Tech Stack *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Next.js, Python, Docker"
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
                  setFormData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
                  setSkillInput('');
                }
              }}
              className="px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-indigo-600/10 border border-indigo-500/30 px-2.5 py-1 text-indigo-400">
                {skill}
                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500">
          Next Step <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}