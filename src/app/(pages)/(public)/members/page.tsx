import { Users, Shield } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function MembersPage() {
  const members = await prisma.application.findMany({
    where: { status: 'APPROVED' },
    orderBy: { fullName: 'asc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Roster & Directory
        </h1>
        <p className="text-muted-foreground">
          Meet the engineers, core team leaders, and active contributors powering HackSmiths.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-xl border-border">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground">Directory updating</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-border/60 bg-card p-5 text-center shadow-sm hover:border-primary/40 transition-all"
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl mb-3">
                {member.fullName.charAt(0).toUpperCase()}
              </div>

              <h2 className="font-bold text-foreground text-lg">{member.fullName}</h2>
              <p className="text-xs text-primary font-medium flex items-center justify-center gap-1 mt-0.5">
                <Shield className="h-3 w-3" />
                {member.primaryDomain || 'Collective Builder'}
              </p>

              {member.branchAndYear && (
                <p className="text-[11px] text-muted-foreground mt-1">{member.branchAndYear}</p>
              )}

              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border/40">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaGithub className="h-4 w-4" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FaLinkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}