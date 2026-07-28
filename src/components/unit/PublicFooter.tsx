'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { Mail, Phone, Heart, Terminal } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa6';

// Custom X (Twitter) Icon Component for brand accuracy
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-t border-zinc-800/80 bg-zinc-950 font-mono text-zinc-400 text-xs antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Cols 1 & 2: Brand Identity */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-indigo-500/50 transition-all duration-300 group-hover:scale-105 shrink-0">
                <NextImage 
                  src="/assets/images/hacksmiths-logo.png"
                  alt="HackSmiths Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="font-extrabold tracking-tight text-lg sm:text-xl">
                <span className="text-zinc-100">HACK</span>
                <span className="text-indigo-400">SMITHS</span>
              </span>
            </Link>

            <p className="max-w-md text-xs text-zinc-400 leading-relaxed font-sans">
              Build. Compete. Create. We are a collective of developers, designers, and innovators building high-impact tech, competing in hackathons, and delivering software solutions.
            </p>

            {/* Social Links Bar */}
            <div className="flex items-center gap-2 pt-1">
              <a 
                href="https://www.instagram.com/hacksmithsdev" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://x.com/hacksmithsdev" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer"
              >
                <XIcon className="h-3 w-3" />
              </a>
              <a 
                href="https://github.com/HackSmithsDev" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer"
              >
                <FaGithub className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-indigo-400 transition-colors">
                  Projects & Showcase
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-indigo-400 transition-colors">
                  Team & Guild Roster
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-indigo-400 transition-colors">
                  Announcements
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get in Touch */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Get in Touch
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <a 
                href="mailto:info@hacksmiths.dev" 
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors group"
              >
                <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate group-hover:underline">contact@hacksmiths.dev</span>
              </a>

              <a 
                href="tel:+917000435413" 
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>+91 70004 35413</span>
              </a>

              <a 
                href="tel:+917987009323" 
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors pl-5.5"
              >
                <span>+91 79870 09323</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-8 border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© {currentYear} HackSmiths. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-indigo-400" />
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by HackSmiths Core Team
          </p>
        </div>

      </div>
    </footer>
  );
}