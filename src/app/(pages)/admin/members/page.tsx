'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Added useRouter
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  UserMinus,
  Loader2,
} from 'lucide-react';

import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface ApplicationMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: number;
  primaryDomain: string;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REMOVED';
  createdAt: string;
}

export default function MembersPage() {
  const router = useRouter(); // Next.js App Router navigation hook
  const [members, setMembers] = useState<ApplicationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const fetchMembers = useCallback(async (filterStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filterStatus === 'ALL'
          ? '/api/members'
          : `/api/members?status=${filterStatus}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load application records.');

      const data = await res.json();
      setMembers(data.members || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching application records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers(activeFilter);
  }, [activeFilter, fetchMembers]);

  const getStatusBadge = (status: ApplicationMember['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> APPROVED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" /> PENDING
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" /> REJECTED
          </span>
        );
      case 'REMOVED':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-zinc-500/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 border border-zinc-500/20">
            <UserMinus className="h-3 w-3" /> REMOVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Applicant & Member Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registered candidate applications queried directly from PostgreSQL.
          </p>
        </div>

        {/* Query Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-xs font-mono">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`rounded px-3 py-1 transition cursor-pointer ${
                activeFilter === status
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-zinc-400 text-xs font-mono gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            Querying `/api/members` database records...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs font-mono text-rose-400">{error}</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500">
            No applicants found with status: <span className="text-zinc-300">{activeFilter}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 uppercase">
                <tr>
                  <th className="px-6 py-3.5">Applicant</th>
                  <th className="px-6 py-3.5">Academic</th>
                  <th className="px-6 py-3.5">Domain & Skills</th>
                  <th className="px-6 py-3.5">Links</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => router.push(`/admin/members/${member.id}`)}
                    className="hover:bg-zinc-800/50 transition cursor-pointer group"
                  >
                    {/* Name & Contact */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                        {member.fullName}
                      </div>
                      <div className="text-[11px] text-zinc-500">{member.email}</div>
                      <div className="text-[10px] text-zinc-600">{member.phone}</div>
                    </td>

                    {/* Academic Course / Branch / Semester */}
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                      {member.course} - <strong className="text-zinc-200 font-mono">{member.branch}</strong>
                      <br />
                      <div className="text-[11px] text-zinc-500">Sem {member.semester}</div>
                    </td>

                    {/* Domain & Skills */}
                    <td className="px-6 py-4">
                      <span className="inline-block rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20 mb-1">
                        {member.primaryDomain}
                      </span>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {member.skills?.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] text-zinc-400 border border-zinc-700/40"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills?.length > 3 && (
                          <span className="text-[9px] text-zinc-500">
                            +{member.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* External Profiles */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-zinc-400">
                        {member.githubUrl && (
                          <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} // Prevents navigating to member detail page
                            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200"
                            title="GitHub Profile"
                          >
                            <FaGithub className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} // Prevents navigating to member detail page
                            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200"
                            title="LinkedIn Profile"
                          >
                            <FaLinkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {!member.githubUrl && !member.linkedinUrl && (
                          <span className="text-zinc-600 text-[10px]">N/A</span>
                        )}
                      </div>
                    </td>

                    {/* Application Status */}
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(member.status)}</td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}