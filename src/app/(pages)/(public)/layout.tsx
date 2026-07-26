import PublicNavbar from '@/components/unit/PublicNavbar';
import Footer from '@/components/unit/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* ---------------------------------------------------- */}
      {/* NAVBAR                                               */}
      {/* ---------------------------------------------------- */}
      <PublicNavbar />

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT ZONE                                    */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1">{children}</main>

      {/* ---------------------------------------------------- */}
      {/* FOOTER                                               */}
      {/* ---------------------------------------------------- */}
      <Footer />
    </div>
  );
}