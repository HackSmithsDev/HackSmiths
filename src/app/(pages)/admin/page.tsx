'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  details?: Record<string, any>;
  notes?: string;
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

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  // Handle Application Decision (Approve / Reject)
  const handleDecision = async (approved: boolean) => {
    if (!selectedApp) return;

    setProcessingId(selectedApp.id);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved,
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
                  status: approved ? 'APPROVED' : 'REJECTED',
                  notes: actionNotes,
                }
              : app
          )
        );
        setSelectedApp(null);
        setActionNotes('');
      } else {
        alert('Failed to update status. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting decision:', err);
      alert('An unexpected error occurred.');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'ALL' || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans">
      {/* Top Console Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold tracking-tight text-zinc-100">
                HACK<span className="text-indigo-500">SMITHS</span>
              </span>
              <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 border border-zinc-700">
                ADMIN CORE
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-mono text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </button>
        </div>
      </header>

      {/* Main Control Center Area */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header Stats & Title */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">
              Application Registry Stack
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Inspect incoming submissions, authorize approvals, or trigger automated dispatch decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Stack
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 font-mono text-xs">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-md px-3 py-1 transition ${
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
            <div className="flex h-64 items-center justify-center font-mono text-xs text-zinc-500">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
              Syncing registry records...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 font-mono text-xs text-zinc-500">
              <AlertCircle className="h-6 w-6 text-zinc-600" />
              <span>No applications matching query criteria.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800/80 bg-zinc-950/60 font-mono text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Record ID</th>
                    <th className="px-6 py-3.5 font-medium">Applicant</th>
                    <th className="px-6 py-3.5 font-medium">Submission Date</th>
                    <th className="px-6 py-3.5 font-medium">State</th>
                    <th className="px-6 py-3.5 font-medium text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="transition hover:bg-zinc-800/30 font-mono"
                    >
                      <td className="px-6 py-4 font-bold text-indigo-400">
                        #{app.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-sans">
                        <div className="font-semibold text-zinc-200">
                          {app.applicantName}
                        </div>
                        <div className="text-xs font-mono text-zinc-500">
                          {app.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setActionNotes(app.notes || '');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-400 transition"
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
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <span className="font-mono text-xs text-indigo-400 font-bold">
                  RECORD #{selectedApp.id}
                </span>
                <h3 className="text-base font-bold text-zinc-100">
                  {selectedApp.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Applicant Details */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-zinc-500">Email Vector:</span>
                <p className="text-zinc-200 font-semibold">{selectedApp.email}</p>
              </div>

              <div>
                <span className="text-zinc-500">Current Status:</span>
                <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Dynamic Form Payload (if present) */}
              {selectedApp.details && Object.keys(selectedApp.details).length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-zinc-500">Form Submission Payload:</span>
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-zinc-300 font-mono text-[11px] space-y-1">
                    {Object.entries(selectedApp.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-zinc-800/40 pb-1">
                        <span className="text-zinc-500 capitalize">{key}:</span>
                        <span className="text-zinc-200 font-mono">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Remarks/Notes */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-medium">
                  Admin Decision Remarks (Included in Email Notification):
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Optional remarks or feedback for the candidate..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 p-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4 font-mono">
              <button
                onClick={() => handleDecision(false)}
                disabled={processingId === selectedApp.id}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition disabled:opacity-50"
              >
                <UserX className="h-4 w-4" />
                Reject
              </button>

              <button
                onClick={() => handleDecision(true)}
                disabled={processingId === selectedApp.id}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
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