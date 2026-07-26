import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Calendar } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Querying the Application model where approved members are stored
  const member = await prisma.application.findFirst({
    where: { 
      id,
      status: 'APPROVED'
    }
  });

  if (!member) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
        <Link href="/members">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="rounded-xl border border-border/60 bg-card p-6 text-center h-fit">
          <div className="h-24 w-24 mx-auto rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-3xl mb-4">
            {member.fullName.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-xl font-bold text-foreground">{member.fullName}</h1>
          <p className="text-xs text-primary font-semibold flex items-center justify-center gap-1 mt-1">
            <Shield className="h-3.5 w-3.5" />
            {member.primaryDomain || 'Collective Member'}
          </p>

          {member.branchAndYear && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              {member.branchAndYear}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border/40">
            {member.githubUrl && (
              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href={member.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub className="h-4 w-4" />
                </a>
              </Button>
            )}
            {member.linkedinUrl && (
              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href={member.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-3">About Builder</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {member.whyJoin || member.projectsDescription || 'Core developer contributing to open-source software and club deployments at HackSmiths.'}
            </p>

            {member.skills && member.skills.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/40">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Tech Stack & Expertise</h3>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill: string, i: number) => (
                    <span key={i} className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}