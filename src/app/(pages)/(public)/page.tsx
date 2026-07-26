import LandingIntroGate from '@/components/unit/LandingIntroGate';

export default function HomePage() {
  return (
    <LandingIntroGate>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20">
          <h1 className="text-6xl font-bold">Build. Compete. Create.</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Welcome to HackSmiths — where engineering meets innovation.
          </p>
        </section>

        {/* What We Do / Featured Projects / Team / FAQ */}
      </main>
    </LandingIntroGate>
  );
}