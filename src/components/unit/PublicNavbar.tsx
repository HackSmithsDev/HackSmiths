'use client';

import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/95 bg-zinc-950/95 backdrop-blur-md transition-all font-mono">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link href="/" className="inline-flex items-center gap-3 group">
          {/* Circular logo icon with glowing hover ring */}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-indigo-500/50 transition-all duration-300 group-hover:scale-105 shrink-0">
            <NextImage 
              src="/assets/images/hacksmiths-logo.png"
              alt="HackSmiths Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Clean Text Brand Name */}
          <span className="font-extrabold tracking-tight text-lg sm:text-xl">
            <span className="text-zinc-100">HACK</span>
            <span className="text-indigo-400">SMITHS</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/application"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <span>APPLY NOW</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 font-mono text-xs">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg transition-colors font-semibold ${
                    isActive
                      ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-zinc-800">
            <Link
              href="/application"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <span>APPLY NOW</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}