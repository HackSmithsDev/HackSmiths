'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Shield,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  UserMinus,
  Loader2,
  Trophy,
  Trash2,
  AlertTriangle,
  FileText,
  ExternalLink,
} from 'lucide-react';

import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface Application {
  id: string;
  email: string;
  fullName: string;
  course: string;
  branch: string;
  semester: number;
  phone: string;
  primaryDomain: string;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  experience?: string | null;
  hackathonExperience: boolean;
  availability: string;
  whyJoin: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchMemberDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/members/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Member application not found.');
        throw new Error('Failed to fetch applicant data.');
      }
      const data: Application = await res.json();
      setApplication(data);
      setNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message || 'Error loading profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemberDetail();
  }, [fetchMemberDetail]);

  // Action Helpers for Status Badges & Buttons
  const triggerStatusAction = async (endpoint: string, actionName: string, bodyPayload?: object) => {
    setActionLoading(actionName);
    try {
      const res = await fetch(`/api/members/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload || { notes }),
      });

      if (!res.ok) throw new Error(`Failed to execute ${actionName}`);

      const result = await res.json();
      const updatedApp = result.application;
      setApplication(updatedApp);
      if (updatedApp.notes) setNotes(updatedApp.notes);
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || `Error during ${actionName}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Real-time autosave on Admin Notes blur
  const handleNotesBlur = async () => {
    if (!id || !application || notes === (application.notes || '')) return;

    setSavingNotes(true);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: application.status,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update notes.');

      const result = await res.json();
      setApplication(result.application);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving internal notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleHardDelete = async () => {
    setActionLoading('delete');
    try {
      const res = await fetch(`/api/members/${id}/delete`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete member record');

      router.push('/admin/members');
    } catch (err: any) {
      alert(err.message || 'Error deleting member record.');
      setActionLoading(null);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (currentStatus: Application['status']) => {
    switch (currentStatus) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> APPROVED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <Clock className="h-3.5 w-3.5" /> PENDING
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" /> REJECTED
          </span>
        );
      case 'REMOVED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded bg-zinc-500/10 px-2.5 py-1 text-xs font-semibold text-zinc-400 border border-zinc-500/20">
            <UserMinus className="h-3.5 w-3.5" /> REMOVED
          </span>
        );
    }
  };

  if (loading) {
    return (
      <main className="p-6 lg:p-8 space-y-6 max-w-7xl font-mono text-xs">
        <div className="flex h-64 items-center justify-center gap-2 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
          Fetching member application details...
        </div>
      </main>
    );
  }

  if (error || !application) {
    return (
      <main className="p-6 lg:p-8 space-y-6 max-w-7xl font-mono text-xs">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6 text-center text-rose-400">
          {error || 'Application record not found.'}
        </div>
      </main>
    );
  }

  const initials = application.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <main className="p-6 lg:p-8 space-y-6 max-w-7xl font-mono text-xs">
      {/* Top Header Navigation & Action Bar */}
      <div className="space-y-1">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Member Application Record <span className="text-zinc-500 text-xs">[{application.id}]</span>
          </h1>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-lg bg-rose-950/40 border border-rose-900/50 p-1.5 text-rose-400 hover:bg-rose-900/40 hover:text-rose-200 transition cursor-pointer"
              title="Permanently Delete Record"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side for core content, Right side for sticky actions & remarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Details & Statements) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-base">
                {initials}
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-zinc-100">{application.fullName}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-zinc-500" />
                    {application.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-zinc-500" />
                    {application.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/60 text-[11px]">
              <div>
                <span className="text-zinc-500 block">Academic Track</span>
                <span className="text-zinc-300 font-semibold flex items-center gap-1 mt-0.5">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                  {application.course} - {application.branch}
                  <br />
                  (Sem {application.semester})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Primary Domain</span>
                <span className="text-indigo-300 font-semibold mt-0.5 block">
                  {application.primaryDomain}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Weekly Availability</span>
                <span className="text-zinc-300 font-semibold mt-0.5 block">
                  {application.availability}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Application Date</span>
                <span className="text-zinc-300 font-semibold mt-0.5 block">
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Skills & External Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" /> Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {application.skills && application.skills.length > 0 ? (
                  application.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-zinc-800/80 px-2 py-1 text-[11px] text-zinc-300 border border-zinc-700/50"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-500">No specific skills listed.</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-indigo-400" /> Profiles & Hackathons
              </h3>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Hackathon Experience:</span>
                  <span className="font-semibold text-zinc-200">
                    {application.hackathonExperience ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">GitHub Profile:</span>
                  {application.githubUrl ? (
                    <a
                      href={application.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:underline"
                    >
                      <FaGithub className="h-3 w-3" /> View GitHub <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    <span className="text-zinc-600">Not provided</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">LinkedIn Profile:</span>
                  {application.linkedinUrl ? (
                    <a
                      href={application.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:underline"
                    >
                      <FaLinkedin className="h-3 w-3" /> View LinkedIn <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    <span className="text-zinc-600">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Statements */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" /> Application Statements
            </h3>
            
            <div className="space-y-1.5">
              <span className="text-zinc-500 font-medium">Why do you want to join?</span>
              <p className="rounded-lg bg-zinc-950 p-3.5 text-zinc-300 leading-relaxed border border-zinc-800/80 whitespace-pre-wrap text-[11px]">
                {application.whyJoin}
              </p>
            </div>

            {application.experience && (
              <div className="space-y-1.5">
                <span className="text-zinc-500 font-medium font-mono">Prior Experience:</span>
                <p className="rounded-lg bg-zinc-950 p-3.5 text-zinc-300 leading-relaxed border border-zinc-800/80 whitespace-pre-wrap text-[11px]">
                  {application.experience}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (Controls & Live Remarks) */}
        <div className="lg:sticky lg:top-8 space-y-6">
          {/* Status Quick Actions Bar */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Change Status
              </h3>
              {savedSuccess && (
                <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => triggerStatusAction('approve', 'approve')}
                disabled={actionLoading !== null || application.status === 'APPROVED'}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 disabled:opacity-40 transition font-semibold cursor-pointer"
              >
                {actionLoading === 'approve' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Approve Application
              </button>

              <button
                onClick={() => triggerStatusAction('reject', 'reject')}
                disabled={actionLoading !== null || application.status === 'REJECTED'}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 disabled:opacity-40 transition font-semibold cursor-pointer"
              >
                {actionLoading === 'reject' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                Reject Application
              </button>

              <button
                onClick={() => triggerStatusAction('remove', 'remove')}
                disabled={actionLoading !== null || application.status === 'REMOVED'}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-40 transition font-semibold cursor-pointer"
              >
                {actionLoading === 'remove' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserMinus className="h-3.5 w-3.5" />}
                Soft Remove
              </button>
            </div>
          </div>

          {/* Dynamic Internal Admin Remarks */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                Admin Remarks
              </h3>
              {savingNotes && (
                <span className="flex items-center gap-1 text-indigo-400 text-[10px]">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                </span>
              )}
            </div>

            <div className="space-y-1">
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add evaluation remarks, interview scores, or rejection feedback (autosaves on click away)..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none leading-relaxed text-[11px]"
              />
              <p className="text-[10px] text-zinc-500">
                Notes automatically save when you click outside the box.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-rose-900/50 bg-zinc-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-zinc-100">Permanently Delete Application?</h3>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              This will execute a hard deletion on application ID <span className="text-zinc-200 font-semibold">{id}</span>. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-zinc-700 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHardDelete}
                disabled={actionLoading === 'delete'}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-500 transition disabled:opacity-50 cursor-pointer"
              >
                {actionLoading === 'delete' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}