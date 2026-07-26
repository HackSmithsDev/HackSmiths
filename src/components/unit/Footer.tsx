'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { 
  Mail, 
  Phone, 
  Heart
} from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';

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
    <footer className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-t border-border/60 bg-card/60 backdrop-blur-md text-foreground transition-colors">
      <div className="w-full px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        
        {/* Exact 4-column layout */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Cols 1 & 2: Brand Identity */}
          <div className="space-y-4 lg:col-span-2">
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

            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Build. Compete. Create. We are a collective of developers, designers, and innovators building high-impact tech, competing in hackathons, and delivering software solutions.
            </p>

            {/* Social Links Bar */}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md hover:text-primary transition-colors" asChild>
                <a href="https://instagram.com/hacksmiths.dev" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FaInstagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md hover:text-primary transition-colors" asChild>
                <a href="https://x.com/hacksmithsdev" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
                  <XIcon className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md hover:text-primary transition-colors" asChild>
                <a href="https://github.com/hacksmiths" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">Projects & Showcase</Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-primary transition-colors">Team</Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-primary transition-colors">Announcements</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get in Touch */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Get in Touch</h3>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              
              {/* Email */}
              <a 
                href="mailto:info@hacksmiths.dev" 
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate group-hover:underline">info@hacksmiths.dev</span>
              </a>

              {/* Phone 1 */}
              <a 
                href="tel:+917000435413" 
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 70004 35413</span>
              </a>

              {/* Phone 2 */}
              <a 
                href="tel:+917987009323" 
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <span className="h-4 w-4 text-primary shrink-0"></span>
                <span>+91 79870 09323</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} HackSmiths. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by HackSmiths Core Team
          </p>
        </div>

      </div>
    </footer>
  );
}