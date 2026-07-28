import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { ArrowLeft, Shield, Calendar, Code2, Clock, Trophy, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';

export const revalidate = 60;

interface Member {
  id: string;
  fullName: string;
  email: string;
  course: string;
  branch: string;
  semester: number;
  primaryDomain: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  experience?: string;
  hackathonExperience?: boolean;
  availability?: string;
  whyJoin?: string;
  status: string;
}

async function getMemberById(id: string): Promise<Member | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/members/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch member ${id} from API:`, res.status);
      return null;
    }

    const data = await res.json();
    const member: Member = data.member || data.application || data;

    // Guard to ensure only approved members are displayed publicly
    if (!member || (member.status && member.status !== 'APPROVED')) {
      return null;
    }

    return member;
  } catch (error) {
    console.error(`Error fetching member ${id} via API:`, error);
    return null;
  }
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15 async params unwrapping
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-mono text-xs selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Navigation Back Link */}
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-400 text-xs transition group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Directory
        </Link>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Avatar & Overview Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center backdrop-blur-sm space-y-5 h-fit">
            
            {/* Avatar Circle */}
            <div className="h-24 w-24 mx-auto rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-3xl shadow-inner">
              {member.fullName ? member.fullName.charAt(0).toUpperCase() : '?'}
            </div>

            {/* Name & Domain */}
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-zinc-100 tracking-wide">
                {member.fullName}
              </h1>
              <p className="text-xs text-indigo-400 font-semibold flex items-center justify-center gap-1.5 pt-0.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                {member.primaryDomain || 'Collective Builder'}
              </p>
            </div>

            {/* Academic Info */}
            <div className="pt-3 border-t border-zinc-800/80 text-zinc-400 font-sans text-xs space-y-1.5">
              {member.branch && member.course && (
                <div className="flex items-center justify-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{member.course} - <strong className="text-zinc-200 font-mono">{member.branch}</strong></span>
                </div>
              )}

              {member.semester && (
                <div className="flex items-center justify-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Semester: <strong className="text-zinc-200 font-mono">{member.semester}</strong></span>
                </div>
              )}

              {member.availability && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-[11px] text-zinc-400">{member.availability}</span>
                </div>
              )}
            </div>

            {/* Hackathon Badge */}
            {member.hackathonExperience && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-semibold">
                <Trophy className="h-3 w-3 text-amber-400" />
                Hackathon Veteran
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-zinc-800/80">
              {member.githubUrl ? (
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-indigo-500/50 transition"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="h-4 w-4" />
                </a>
              ) : (
                <span className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-700 cursor-not-allowed">
                  <FaGithub className="h-4 w-4" />
                </span>
              )}

              {member.linkedinUrl ? (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 hover:text-indigo-400 hover:border-indigo-500/50 transition"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="h-4 w-4" />
                </a>
              ) : (
                <span className="p-2 rounded-lg bg-zinc-900/40 border border-zinc-800 text-zinc-700 cursor-not-allowed">
                  <FaLinkedin className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Experience & Bio */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Bio & Motivation */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                About Builder
              </h2>
              <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {member.whyJoin || 'No bio or statement provided.'}
              </p>
            </div>

            {/* Experience */}
            {member.experience && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Past Experience & Projects
                </h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed whitespace-pre-line">
                  {member.experience}
                </p>
              </div>
            )}

            {/* Tech Stack & Skills */}
            {member.skills && member.skills.length > 0 && (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-indigo-400" />
                  Tech Stack & Expertise
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {member.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-md bg-zinc-800/80 border border-zinc-700/60 px-3 py-1 text-xs font-mono text-indigo-300"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}