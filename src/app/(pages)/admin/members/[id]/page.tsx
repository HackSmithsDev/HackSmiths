'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Shield, Mail, Calendar, Activity, KeyRound, CheckCircle2 } from 'lucide-react';

export default function MemberDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('ADMIN');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-4xl font-mono text-xs">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-400" />
          Member Profile Inspection <span className="text-zinc-500 text-xs">[{id}]</span>
        </h1>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-base">
            SA
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100">System Admin</h2>
            <div className="flex items-center gap-2 text-zinc-400 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              <span>admin@hacksmiths.io</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800/60 text-[11px]">
          <div>
            <span className="text-zinc-500 block">Joined Date</span>
            <span className="text-zinc-300 font-semibold">2026-01-01</span>
          </div>
          <div>
            <span className="text-zinc-500 block">Last Active</span>
            <span className="text-zinc-300 font-semibold">Just now</span>
          </div>
          <div>
            <span className="text-zinc-500 block">Auth Level</span>
            <span className="text-indigo-400 font-semibold">Level 3 (Root)</span>
          </div>
        </div>
      </div>

      {/* Roles & Permissions Adjustment */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-400" /> System Clearance & Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMINISTRATOR</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Account State</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 transition"
          >
            Save Access Permissions
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Permissions updated!
            </span>
          )}
        </div>
      </form>
    </main>
  );
}