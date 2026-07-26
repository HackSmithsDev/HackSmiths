'use client';

import { Users, ShieldCheck } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export default function MembersPage() {
  const members: Member[] = [
    {
      id: 'usr-1',
      name: 'System Admin',
      email: 'admin@hacksmiths.io',
      role: 'ADMIN',
      joinedAt: '2026-01-01',
    },
  ];

  return (
    <main className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-400" />
          Member Directory
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Registered user identities and administrative clearance roles.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 uppercase">
            <tr>
              <th className="px-6 py-3.5">Member</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-zinc-800/30">
                <td className="px-6 py-4 font-bold text-zinc-200">{member.name}</td>
                <td className="px-6 py-4 text-zinc-400">{member.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="h-3 w-3" /> {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500">{member.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}