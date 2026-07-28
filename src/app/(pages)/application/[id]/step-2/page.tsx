'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FileText, Plus, X, Terminal, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step2Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [skillInput, setSkillInput] = useState('');
  const [skillError, setSkillError] = useState('');
  const [formData, setFormData] = useState({
    primaryDomain: 'Frontend',
    skills: [] as string[],
    availability: '10-15 hrs/week',
    hackathonExperience: 'false',
    experience: '',
  });

  useEffect(() => {
    if (!id) return;
    const saved = sessionStorage.getItem(`app_draft_${id}`);
    if (saved) setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
  }, [id]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if (formData.skills.includes(trimmed)) {
      setSkillError('Skill already added.');
      return;
    }

    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
    setSkillError('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.skills.length === 0) {
      setSkillError('Please add at least one technical skill tag.');
      return;
    }

    const existing = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
    sessionStorage.setItem(`app_draft_${id}`, JSON.stringify({ ...existing, ...formData }));
    router.push(`/application/${id}/step-3`);
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 font-mono text-xs antialiased">
      {/* Step Container Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 space-y-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
        {/* Subtle background glow accent */}
        <div 
          className="absolute -top-24 -right-24 h-48 w-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Section Header */}
        <div className="border-b border-zinc-800/80 pb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            02 // TECHNICAL STACK & EXPERIENCE
          </h2>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline-block font-mono">
            Step 2 of 3
          </span>
        </div>

        {/* Primary Domain & Weekly Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              PRIMARY_DOMAIN *
            </label>
            <select
              required
              value={formData.primaryDomain}
              onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono cursor-pointer"
            >
              <option value="Frontend">Frontend Development</option>
              <option value="Backend">Backend Engineering</option>
              <option value="Fullstack">Fullstack Development</option>
              <option value="Mobile">Mobile App Development</option>
              <option value="DevOps">DevOps & Cloud Systems</option>
              <option value="UI/UX Design">UI/UX & Product Design</option>
              <option value="Data Science">Data Science & Analytics</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              WEEKLY_AVAILABILITY *
            </label>
            <select
              required
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono cursor-pointer"
            >
              <option value="10-15 hrs/week">10 - 15 hours / week</option>
              <option value="15-20 hrs/week">15 - 20 hours / week</option>
              <option value="20-25 hrs/week">20 - 25 hours / week</option>
              <option value="25+ hrs/week">25+ hours / week</option>
            </select>
          </div>
        </div>

        {/* Dynamic Skills */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <label className="block font-bold text-zinc-300 tracking-wider">
            TECHNICAL_SKILLS // TECH_STACK *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setSkillError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. Next.js, Docker, Python, PostgreSQL"
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5 font-semibold shrink-0 cursor-pointer font-mono"
            >
              <Plus className="h-4 w-4 text-indigo-400" />
              <span>Add</span>
            </button>
          </div>

          {/* Skill Tag Badges */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs text-indigo-300 font-mono"
                >
                  <Terminal className="h-3 w-3 text-indigo-400" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400/70 hover:text-indigo-200 transition-colors ml-1 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Inline Validation Error */}
          {skillError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2 font-sans">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{skillError}</span>
            </div>
          )}
        </div>

        {/* Hackathon Experience */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <label className="block font-bold text-zinc-300 tracking-wider">
            HACKATHON_EXPERIENCE *
          </label>
          <select
            required
            value={formData.hackathonExperience}
            onChange={(e) => setFormData({ ...formData, hackathonExperience: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono cursor-pointer"
          >
            <option value="true">Yes, I have competed in hackathons</option>
            <option value="false">No prior hackathon participation</option>
          </select>
        </div>

        {/* Prior Projects & Experience */}
        <div className="space-y-2">
          <label className="block font-bold text-zinc-300 tracking-wider">
            PRIOR_EXPERIENCE // BUILDS
          </label>
          <textarea
            rows={4}
            placeholder="Briefly detail what software, applications, or technical projects you have worked on previously..."
            value={formData.experience || ''}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans leading-relaxed"
          />
        </div>
      </div>

      {/* Navigation CTA Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push(`/application/${id}/step-1`)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors cursor-pointer font-mono"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>PREVIOUS STEP</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25 cursor-pointer font-mono"
        >
          <span>PROCEED TO STEP 3</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}