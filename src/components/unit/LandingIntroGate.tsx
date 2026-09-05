'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface LandingIntroGateProps {
  children: React.ReactNode;
}

const BRAND_NAME = 'HACKSMITHS';

// Staggered letters variant
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function LandingIntroGate({ children }: LandingIntroGateProps) {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [introPhase, setIntroPhase] = useState<'WARP' | 'BURST' | 'BRANDING'>('WARP');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true);
    const hasSeenIntro = sessionStorage.getItem('hs_intro_seen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hs_intro_seen', 'true');
    }
    setShowIntro(false);
  };

  // Cinematic Timeline Sequence
  useEffect(() => {
    if (!showIntro || !isMounted) return;

    // Phase 1: Warp Grid / Acceleration (0 - 2.2s)
    const burstTimer = setTimeout(() => {
      setIntroPhase('BURST');
    }, 2200);

    // Phase 2: Shockwave detonation -> Branding Reveal (2.8s)
    const brandTimer = setTimeout(() => {
      setIntroPhase('BRANDING');
    }, 2800);

    // Auto-redirect 4 seconds after branding displays (Total ~6.8s)
    const finishTimer = setTimeout(() => {
      handleIntroComplete();
    }, 6800);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(brandTimer);
      clearTimeout(finishTimer);
    };
  }, [showIntro, isMounted]);

  // Lightweight 60FPS Ambient Particle Canvas
  useEffect(() => {
    if (!showIntro || !isMounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle starry cyber network
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX * p.z;
        p.y += p.speedY * p.z;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${0.25 * p.z})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showIntro, isMounted]);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="h-full w-full bg-black" />
      </div>
    );
  }

  const isBranding = introPhase === 'BRANDING';

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="cinematic-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black text-white font-mono selection:bg-indigo-500/40"
          >
            {/* Background Canvas Particles */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

            {/* 1. CINEMATIC BACKGROUND: 3D Perspective Digital Cyber Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isBranding ? 0.2 : 0.6 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  perspective: '900px',
                }}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ['0px 0px', '0px 160px'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isBranding ? 6 : 2.5,
                    ease: 'linear',
                  }}
                  className="w-[200vw] h-[200vh] origin-center opacity-40"
                  style={{
                    transform: 'rotateX(72deg) translateY(-25%)',
                    backgroundImage: `
                      linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                  }}
                />
              </motion.div>

              {/* Vignette & Nebula Ambient Glows */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/60 to-black pointer-events-none" />
              <motion.div
                animate={{
                  scale: isBranding ? [1, 1.2, 1] : [0.8, 1.3, 0.8],
                  opacity: isBranding ? 0.35 : 0.65,
                }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-purple-600/30 blur-[130px] rounded-full pointer-events-none"
              />
            </div>

            {/* 2. CINEMATIC PHASE 1 & 2: Reactor Compression Core & Shockwave Ring */}
            <AnimatePresence>
              {introPhase !== 'BRANDING' && (
                <motion.div
                  key="reactor-core"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2.2, filter: 'blur(30px)', transition: { duration: 0.6 } }}
                  className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
                >
                  {/* Outer Concentric Tech Ring 1 */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute h-64 w-64 rounded-full border border-indigo-500/25 border-t-cyan-400/80 border-b-purple-500/80"
                  />

                  {/* Outer Concentric Tech Ring 2 */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                    className="absolute h-44 w-44 rounded-full border border-dashed border-cyan-400/30 border-r-indigo-400/80"
                  />

                  {/* Pulsing Core Energy Orb */}
                  <motion.div
                    animate={{
                      scale: [0.9, 1.25, 0.9],
                      boxShadow: [
                        '0 0 30px rgba(99,102,241,0.5)',
                        '0 0 70px rgba(34,211,238,0.8)',
                        '0 0 30px rgba(99,102,241,0.5)',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-purple-500 flex items-center justify-center shadow-2xl"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/90 blur-[2px]" />
                  </motion.div>

                  {/* Futuristic Status Readout */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mt-20 text-[11px] tracking-[0.35em] text-cyan-300 uppercase"
                  >
                    [ INITIALIZING ECOSYSTEM // PROTOCOL 01 ]
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dispersion Flash Trigger on Burst */}
            <AnimatePresence>
              {introPhase === 'BURST' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 0.9, 0], scale: 3.5, filter: 'blur(40px)' }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute h-80 w-80 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-300 to-white pointer-events-none z-20"
                />
              )}
            </AnimatePresence>

            {/* 3. CINEMATIC PHASE 3: HackSmiths Brand Reveal & Letter-by-Letter Hologram */}
            {isBranding && (
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
                {/* Rounded-Corner Emblem Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.65, y: -20, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 relative"
                >
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-600/30 blur-xl pointer-events-none" />
                  <div className="relative overflow-hidden rounded-2xl border border-white/20 p-2.5 bg-black/70 backdrop-blur-md shadow-[0_0_40px_rgba(99,102,241,0.35)]">
                    <Image
                      src="/assets/images/hacksmiths-logo.png"
                      alt="HackSmiths Logo"
                      width={96}
                      height={96}
                      className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-xl"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Staggered Letter Scan */}
                <motion.h1
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap justify-center text-5xl font-black tracking-widest text-zinc-100 md:text-8xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
                >
                  {BRAND_NAME.split('').map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="inline-block bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent px-[2px]"
                      style={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Motto Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
                  className="mt-4 text-xs sm:text-sm tracking-[0.35em] text-neutral-300 uppercase"
                >
                  Build<span className="text-indigo-400">.</span> Compete<span className="text-indigo-400">.</span> Create<span className="text-indigo-400">.</span>
                </motion.p>
              </div>
            )}

            {/* 4. DYNAMIC ACTION BUTTONS */}
            <div className="absolute bottom-10 z-30 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isBranding ? (
                  <motion.button
                    key="skip-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    onClick={handleIntroComplete}
                    className="flex items-center gap-2 backdrop-blur-md px-6 py-2.5 text-xs tracking-widest text-neutral-300 uppercase border border-white/10 rounded-full hover:border-indigo-400 hover:text-white hover:bg-black/80 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                  >
                    <span>[ Skip Intro ]</span>
                  </motion.button>
                ) : (
                  <motion.button
                    key="home-btn"
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleIntroComplete}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-3.5 text-sm font-semibold tracking-wider text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-pointer hover:border-indigo-400 hover:shadow-[0_0_45px_rgba(99,102,241,0.7)]"
                  >
                    <span className="relative z-10 uppercase tracking-widest">Go to Home Page</span>
                    <svg
                      className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Home Page Content - Completely hidden while intro runs */}
      <div className={showIntro ? 'hidden' : 'block'}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}