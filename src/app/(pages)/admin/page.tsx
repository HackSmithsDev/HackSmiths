'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
  X,
  UserCheck,
  UserX,
  Loader2,
} from 'lucide-react';

import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  semester: number;
  primaryDomain: string;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  experience?: string | null;
  whyJoin?: string | null;
  hackathonExperience?: boolean;
  availability?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';
  notes?: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Active selected application for inspection/action modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch applications matching Prisma schema
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === 'ALL'
          ? '/api/members'
          : `/api/members?status=${filterStatus}`;

      const res = await fetch(url);
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setApplications(data.members || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  // Handle Application Decision (Approve / Reject)
  const handleDecision = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedApp) return;

    setProcessingId(selectedApp.id);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: actionNotes,
        }),
      });

      if (res.ok) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApp.id
              ? {
                  ...app,
                  status,
                  notes: actionNotes,
                }
              : app
          )
        );
        setSelectedApp(null);
        setActionNotes('');
      } else {
        alert('Failed to update status. Please check your backend endpoint.');
      }
    } catch (err) {
      console.error('Error submitting decision:', err);
      alert('An unexpected error occurred.');
    } finally {
      setProcessingId(null);
    }
  };

  // Local Search Filter
  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.fullName?.toLowerCase().includes(query) ||
      app.email?.toLowerCase().includes(query) ||
      app.primaryDomain?.toLowerCase().includes(query) ||
      app.id?.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans">

      {/* Main Control Center Area */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header Stats & Title */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">
              Application Registry Stack
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Inspect candidate submissions, review tech stacks, and issue approval decisions.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Stack
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search name, email, domain, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 font-mono text-xs">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-md px-3 py-1 transition cursor-pointer ${
                  filterStatus === status
                    ? 'bg-zinc-800 text-indigo-400 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
          {loading ? (
            <div className="flex h-64 items-center justify-center font-mono text-xs text-zinc-500 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              Syncing registry records...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 font-mono text-xs text-zinc-500">
              <AlertCircle className="h-6 w-6 text-zinc-600" />
              <span>No applications matching query criteria.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-800/80 bg-zinc-950/60 text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Applicant</th>
                    <th className="px-6 py-3.5 font-medium">Academic</th>
                    <th className="px-6 py-3.5 font-medium">Domain & Skills</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                    <th className="px-6 py-3.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="transition hover:bg-zinc-800/30"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-200">{app.fullName}</div>
                        <div className="text-[11px] text-zinc-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {app.branch} (Sem {app.semester})
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20 mb-1">
                          {app.primaryDomain}
                        </span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.skills?.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400 border border-zinc-700/40"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setActionNotes(app.notes || '');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <span className="font-mono text-xs text-indigo-400 font-bold">
                  APPLICANT RECORD
                </span>
                <h3 className="text-base font-bold text-zinc-100">
                  {selectedApp.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Application Payload Details */}
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 border-b border-zinc-800/60 pb-3">
                <div>
                  <span className="text-zinc-500 block">Email:</span>
                  <p className="text-zinc-200 font-semibold">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-zinc-500 block">Phone:</span>
                  <p className="text-zinc-200">{selectedApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-zinc-500 block">Branch & Sem:</span>
                  <p className="text-zinc-200">{selectedApp.branch} (Sem {selectedApp.semester})</p>
                </div>
                <div>
                  <span className="text-zinc-500 block">Availability:</span>
                  <p className="text-zinc-200">{selectedApp.availability || 'N/A'}</p>
                </div>
              </div>

              {/* Links & Hackathon Exp */}
              <div className="flex items-center gap-4 text-zinc-300 border-b border-zinc-800/60 pb-3">
                {selectedApp.githubUrl && (
                  <a
                    href={selectedApp.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-400"
                  >
                    <FaGithub className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
                {selectedApp.linkedinUrl && (
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-400"
                  >
                    <FaLinkedin className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
                <span className="text-zinc-500 ml-auto">
                  Hackathons: {selectedApp.hackathonExperience ? 'Yes' : 'No'}
                </span>
              </div>

              {/* Essay Answers */}
              {selectedApp.whyJoin && (
                <div className="space-y-1">
                  <span className="text-zinc-500 block">Why Join:</span>
                  <p className="rounded-lg bg-zinc-900 p-2.5 text-zinc-300 leading-relaxed text-[11px] border border-zinc-800">
                    {selectedApp.whyJoin}
                  </p>
                </div>
              )}

              {/* Admin Notes / Remarks */}
              <div className="space-y-1.5 pt-2">
                <label className="text-zinc-400 block font-medium">
                  Internal Remarks / Notes:
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add evaluation notes..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4 font-mono">
              <button
                onClick={() => handleDecision('REJECTED')}
                disabled={processingId === selectedApp.id}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                <UserX className="h-4 w-4" />
                Reject
              </button>

              <button
                onClick={() => handleDecision('APPROVED')}
                disabled={processingId === selectedApp.id}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                Approve Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}