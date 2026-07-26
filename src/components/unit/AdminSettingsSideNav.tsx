'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Lock, Mail, Globe } from 'lucide-react';

const navItems = [
  {
    href: '/admin/settings/recruitment',
    label: 'Recruitment',
    icon: Users,
    description: 'Portal status & cohort rules',
  },
  {
    href: '/admin/settings/security',
    label: 'Security & 2FA',
    icon: Lock,
    description: 'OTP timeouts & session rules',
  },
  {
    href: '/admin/settings/smtp',
    label: 'SMTP Gateway',
    icon: Mail,
    description: 'Sender info & email triggers',
  },
  {
    href: '/admin/settings/links',
    label: 'Social & Links',
    icon: Globe,
    description: 'GitHub, Discord & web handles',
  },
];

export default function AdminSettingsSideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-1 font-mono text-xs">
      <div className="px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        Configuration Matrix
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                isActive
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-medium'
                  : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <div className="space-y-0.5">
                <p className="font-semibold">{item.label}</p>
                <p className="text-[10px] text-zinc-500 leading-tight">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}