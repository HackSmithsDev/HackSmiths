import { Users, Shield, ArrowLeft } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import Link from 'next/link';
import { headers } from 'next/headers';

export const revalidate = 60;

interface Member {
  id: string;
  fullName: string;
  primaryDomain?: string;
  course?: string;
  branch?: string;
  semester?: string | number;
  githubUrl?: string;
  linkedinUrl?: string;
  status: string;
}

async function getMembers(): Promise<Member[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/members`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('Failed to fetch members from API:', res.status);
      return [];
    }

    const data = await res.json();
    const rawList: Member[] = data.members || data.applications || [];

    // Filter only approved members if endpoint returns all applications
    return Array.isArray(rawList)
      ? rawList.filter((m) => m.status === 'APPROVED' || !m.status)
      : [];
  } catch (error) {
    console.error('Error fetching members via API:', error);
    return [];
  }
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header / Breadcrumb */}
        <div className="space-y-4 border-b border-zinc-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-indigo-400 text-xs transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                Roster & Directory
              </h1>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm mt-1">
                Meet the engineers, core team leaders, and active contributors powering HackSmiths.
              </p>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {members.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-xl border-zinc-800 bg-zinc-900/20 text-zinc-500 space-y-3">
            <Users className="h-8 w-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">Directory Updating</p>
            <p className="text-xs text-zinc-500 font-sans">
              No approved members listed in the system yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-center backdrop-blur-sm hover:border-indigo-500/40 hover:bg-zinc-900/70 transition space-y-4"
              >
                <div className="space-y-3">
                  {/* Avatar Letter Badge */}
                  <div className="h-14 w-14 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-lg shadow-inner">
                    {member.fullName ? member.fullName.charAt(0).toUpperCase() : '?'}
                  </div>

                  {/* Name & Primary Domain */}
                  <div>
                    <h2 className="font-bold text-zinc-100 text-sm tracking-wide">
                      {member.fullName}
                    </h2>
                    <p className="text-[11px] text-indigo-400 font-medium flex items-center justify-center gap-1 mt-1">
                      <Shield className="h-3 w-3 text-indigo-400" />
                      {member.primaryDomain || 'Collective Builder'}
                    </p>
                  </div>

                  {/* Academic Context */}
                  {(member.branch || member.semester || member.course) && (
                    <div className="text-[11px] text-zinc-500 font-mono space-y-0.5 pt-1">
                      {member.course && member.branch && (
                        <p>{member.course} - {member.branch}</p>
                      )}
                      {member.semester && <p>Semester {member.semester}</p>}
                    </div>
                  )}
                </div>

                {/* External Social Links */}
                <div className="flex items-center justify-center gap-3 pt-3 border-t border-zinc-800/60">
                  {member.githubUrl ? (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      aria-label={`${member.fullName}'s GitHub profile`}
                    >
                      <FaGithub className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-zinc-700 cursor-not-allowed">
                      <FaGithub className="h-4 w-4" />
                    </span>
                  )}

                  {member.linkedinUrl ? (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-indigo-400 transition-colors"
                      aria-label={`${member.fullName}'s LinkedIn profile`}
                    >
                      <FaLinkedin className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-zinc-700 cursor-not-allowed">
                      <FaLinkedin className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}