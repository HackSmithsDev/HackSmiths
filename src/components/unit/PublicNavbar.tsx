'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Team', href: '/members' },
  { name: 'Announcements', href: '/announcements' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          
          {/* Circular logo icon with hover zoom effect */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110 shrink-0">
            <NextImage 
              src="/favicon.ico"
              alt="HackSmiths Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Clean Text Brand Name */}
          <span className="font-extrabold tracking-tight text-xl">
            <span className="text-foreground">HACK</span>
            <span className="text-muted-foreground transition-colors group-hover:text-foreground">SMITHS</span>
          </span>

        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'text-primary font-semibold bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex gap-1.5 shadow-sm">
            <Link href="/application">
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-primary font-semibold bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border/40">
            <Button asChild className="w-full justify-center gap-1.5" onClick={() => setMobileMenuOpen(false)}>
              <Link href="/application">
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}