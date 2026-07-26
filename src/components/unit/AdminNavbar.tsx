'use client';

import Link from 'next/link';
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
import { Button } from '@/components/ui/button';

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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Admin Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-wider text-lg">
            <span className="font-black tracking-tight text-foreground">
              HACK<span className="text-primary">SMITHS</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Suite
          </div>
        </div>

        {/* Center: Admin Main Sections */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Links & Logout */}
        <div className="flex items-center gap-2">
          {/* Public Portal Quick Link */}
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex text-xs gap-1.5 h-8">
            <Link href="/" target="_blank">
              Live Site
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          </Button>

          {/* Logout Action */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Secondary Mobile Admin Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-border/40 bg-muted/30 px-2 py-1.5 overflow-x-auto">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-md text-[10px] font-medium whitespace-nowrap ${
                isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
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