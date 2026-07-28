'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, ArrowRight, Terminal } from 'lucide-react';

export default function Step1Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: 'B.Tech',
    branch: '',
    semester: '',
  });

  useEffect(() => {
    if (!id) return;
    const saved = sessionStorage.getItem(`app_draft_${id}`);
    if (saved) {
      setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, [id]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Save partial draft
    const existing = JSON.parse(sessionStorage.getItem(`app_draft_${id}`) || '{}');
    sessionStorage.setItem(`app_draft_${id}`, JSON.stringify({ ...existing, ...formData }));

    router.push(`/application/${id}/step-2`);
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
            <User className="h-4 w-4 text-indigo-400" />
            01 // BASIC & CONTACT DETAILS
          </h2>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline-block font-mono">
            Step 1 of 3
          </span>
        </div>

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              FULL_NAME *
            </label>
            <input
              required
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              EMAIL_ADDRESS *
            </label>
            <input
              required
              type="email"
              placeholder="candidate@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Phone, Course, Branch, Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              PHONE_NUMBER *
            </label>
            <input
              required
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              DEGREE / COURSE *
            </label>
            <select
              required
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono cursor-pointer"
            >
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="BCA">BCA</option>
              <option value="B.Sc">B.Sc</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MCA">MCA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              ACADEMIC_BRANCH *
            </label>
            <input
              required
              type="text"
              placeholder="Computer Science & Engineering"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-zinc-300 tracking-wider">
              SEMESTER *
            </label>
            <input
              required
              type="number"
              min={1}
              max={10}
              placeholder="1-8"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Navigation & Status Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-sans">
          <Terminal className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span>Progress auto-saved locally to your session draft.</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25 cursor-pointer font-mono"
        >
          <span>PROCEED TO STEP 2</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}