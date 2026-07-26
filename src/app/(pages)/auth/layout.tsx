import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Background Decorator */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Minimal Header */}
      <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Terminal className="h-4 w-4" />
            </div>
            <span>
              Hack<span className="text-primary">Smiths</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Main Site
          </Link>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/20">
        <p className="font-mono">
          © {new Date().getFullYear()} HackSmiths. Secure System Access.
        </p>
      </footer>
    </div>
  );
}