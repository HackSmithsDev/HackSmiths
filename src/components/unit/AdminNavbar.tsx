'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Megaphone, 
  Settings, 
  LogOut, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Roster & Applicants', href: '/admin/members', icon: Users },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/auth/login');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md antialiased font-mono text-zinc-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Admin Badge */}
        <div className="flex items-center gap-3">
          {/* Brand / Logo */}
          <Link href="/admin" className="inline-flex items-center gap-2.5 group">
            
            {/* Circular logo icon with hover zoom effect */}
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden border border-zinc-800 bg-zinc-900 transition-transform duration-300 group-hover:scale-105 shrink-0">
              <NextImage 
                src="/assets/images/hacksmiths-logo.png"
                alt="HackSmiths Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Clean Monospace Brand Name */}
            <span className="font-bold tracking-tight text-base font-mono">
              <span className="text-zinc-100">HACK</span>
              <span className="text-indigo-400">SMITHS</span>
            </span>

          </Link>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="h-3 w-3" />
            ADMIN SUITE
          </div>
        </div>

        {/* Center: Admin Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/50 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Public Portal Quick Link */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Link>

          {/* Logout Action */}
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Secondary Mobile Admin Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-zinc-800/80 bg-zinc-950 px-2 py-2 overflow-x-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition ${
                isActive ? 'text-indigo-400 font-bold bg-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}