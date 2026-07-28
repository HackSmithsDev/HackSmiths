import Link from 'next/link';
import { headers } from 'next/headers';
import LandingIntroGate from '@/components/unit/LandingIntroGate';
import {
  ArrowRight,
  Code2,
  Terminal,
  Trophy,
  Rocket,
  FolderGit2,
  Megaphone,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export const revalidate = 60;

interface Project {
  id: string;
  title: string;
  slug?: string;
  shortDesc: string;
  category: string;
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
}

interface Member {
  id: string;
  status: string;
}

async function getHomeData() {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Parallel fetch from internal API routes
    const [projectsRes, announcementsRes, membersRes] = await Promise.all([
      fetch(`${baseUrl}/api/main/projects`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/main/announcements?published=true`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/members`, { next: { revalidate: 60 } }),
    ]);

    const projectsData = projectsRes.ok ? await projectsRes.json() : {};
    const announcementsData = announcementsRes.ok ? await announcementsRes.json() : {};
    const membersData = membersRes.ok ? await membersRes.json() : {};

    const rawProjects: Project[] = projectsData.projects || projectsData || [];
    const projects: Project[] = rawProjects.slice(0, 3);

    const rawAnnouncements: Announcement[] = announcementsData.announcements || announcementsData || [];
    const announcements: Announcement[] = rawAnnouncements.slice(0, 2);

    // Dynamic extraction of approved members count
    const allMembers: Member[] = membersData.members || membersData.applications || [];
    const approvedMemberCount = Array.isArray(allMembers)
      ? allMembers.filter((m) => m.status === 'APPROVED').length
      : 0;

    return {
      projects,
      announcements,
      memberCount: approvedMemberCount,
      totalProjectsCount: rawProjects.length,
    };
  } catch (error) {
    console.error('Error fetching home data via API:', error);
    return { projects: [], announcements: [], memberCount: 0, totalProjectsCount: 0 };
  }
}

export default async function HomePage() {
  const {
    projects: featuredProjects,
    announcements: latestAnnouncements,
    memberCount,
    totalProjectsCount,
  } = await getHomeData();

  return (
    <LandingIntroGate>
      <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:py-28 border-b border-zinc-800/60">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10 font-mono">
            {/* Terminal Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300">
              <Terminal className="h-3.5 w-3.5" />
              <span>hacksmiths --init // student software guild</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 font-mono leading-tight">
              Build<span className="text-indigo-400">.</span> Compete<span className="text-indigo-400">.</span> Create<span className="text-indigo-400">.</span>
            </h1>

            <p className="font-sans text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Welcome to HackSmiths — where engineering meets innovation. We build production tools, ship real-world apps, and compete in premier national hackathons.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-mono text-xs">
              <Link
                href="/application"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25"
              >
                Apply for Membership <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-6 py-3 text-zinc-300 hover:bg-zinc-800 transition"
              >
                Explore Projects
              </Link>
            </div>

            {/* Real Dynamic Community Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 text-left border-t border-zinc-800/80 max-w-2xl mx-auto">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Approved Members</div>
                <div className="text-xl font-bold text-indigo-400">{memberCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Builds</div>
                <div className="text-xl font-bold text-indigo-400">{totalProjectsCount}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Motto</div>
                <div className="text-xl font-bold text-zinc-200">Ship or Die</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHAT WE DO / PILLARS */}
        <section className="py-16 sm:py-20 border-b border-zinc-800/60 bg-zinc-950/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 font-mono">
              <h2 className="text-2xl font-bold text-zinc-100">What We Do</h2>
              <p className="text-xs text-zinc-400 font-sans">
                Three core tracks that define the HackSmiths ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-100">Build Production Tools</h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  We write real software—from campus utility portals to scalable web applications and containerized backend architectures.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-100">Compete & Win</h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  We form multi-disciplinary teams to enter regional and national hackathons, pitching functional prototypes built under pressure.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Rocket className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-100">Create & Experiment</h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  From custom LLM pipelines to mobile applications and IoT systems, we experiment with modern tech stacks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED PROJECTS PREVIEW */}
        <section className="py-16 sm:py-20 border-b border-zinc-800/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                  <FolderGit2 className="h-6 w-6 text-indigo-400" />
                  Featured Builds
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Recent open-source software and club projects.
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View all builds →
              </Link>
            </div>

            {featuredProjects.length === 0 ? (
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-8 text-center font-mono text-xs text-zinc-500">
                No public projects uploaded yet. Check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                {featuredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 hover:border-zinc-700 transition"
                  >
                    <div className="space-y-3">
                      <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-indigo-300 border border-zinc-700">
                        {proj.category}
                      </span>
                      <h3 className="font-bold text-zinc-100 text-sm">{proj.title}</h3>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                        {proj.shortDesc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      {/* Navigates directly via project ID */}
                      <Link
                        href={`/projects/${proj.id}`}
                        className="text-indigo-400 hover:underline text-[11px]"
                      >
                        Details →
                      </Link>
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-zinc-200"
                          >
                            <FaGithub className="h-4 w-4" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-indigo-400"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. RECENT BULLETINS / ANNOUNCEMENTS */}
        {latestAnnouncements.length > 0 && (
          <section className="py-16 sm:py-20 border-b border-zinc-800/60 bg-zinc-950/50 font-mono">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-indigo-400" />
                  Latest Bulletins
                </h2>
                <Link href="/announcements" className="text-xs text-indigo-400 hover:underline">
                  All Announcements →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestAnnouncements.map((ann) => (
                  <Link
                    key={ann.id}
                    href={`/announcements/${ann.id}`}
                    className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3 hover:border-indigo-500/50 transition group"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-semibold text-indigo-300 border border-indigo-500/20">
                        {ann.category}
                      </span>
                      <span className="text-zinc-500">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-100 text-sm group-hover:text-indigo-400 transition">
                      {ann.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                      {ann.content}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. FAQ SECTION */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2 font-mono">
              <h2 className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                <HelpCircle className="h-6 w-6 text-indigo-400" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Everything you need to know about applying and contributing.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  Who can apply for HackSmiths membership?
                </h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  Applications are open to all students across branches who are passionate about software development, AI/ML, design, or DevOps.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  What is the selection process?
                </h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  After submitting the recruitment form under `/application`, your profile, skills, and project experience will be evaluated by club admins. You will receive an update via email.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  What is the expected weekly time commitment?
                </h3>
                <p className="text-zinc-400 font-sans leading-relaxed">
                  Most members commit 15–20 hours per week depending on active project builds and hackathon schedules.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </LandingIntroGate>
  );
}