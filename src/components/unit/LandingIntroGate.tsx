'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface LandingIntroGateProps {
  children: React.ReactNode;
}

const BRAND_NAME = 'HACKSMITHS';

// Properly typed Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Safe SSR-compatible layout effect hook
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function LandingIntroGate({ children }: LandingIntroGateProps) {
  // 1. Initialize state synchronously on client mount to prevent DOM flashing
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hasSeenIntro = sessionStorage.getItem('hs_intro_seen');
      return !hasSeenIntro; // Show intro immediately if user hasn't seen it
    }
    return true; // Default to true on SSR to avoid leaking home content
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVideoFinished, setIsVideoFinished] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Synchronously evaluate session storage before browser paints
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

  // Called when video naturally finishes
  const handleVideoEnded = () => {
    setIsVideoFinished(true);
  };

  // Auto-redirect 4 seconds after branding appears if user doesn't click
  useEffect(() => {
    if (!isVideoFinished) return;

    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVideoFinished]);

  // Prevent flash during initial hydration render
  if (!isMounted) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="h-full w-full bg-black" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="splash-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black text-white"
          >
            {/* 1. Fullscreen Background Video with Camera Zoom-Out & Dispersion Transition */}
            <motion.div
              className="absolute inset-0 h-full w-full"
              animate={
                isVideoFinished
                  ? {
                      scale: [1, 1.15, 0.95],
                      filter: ['blur(0px) brightness(1)', 'blur(20px) brightness(1.8)', 'blur(8px) brightness(0.4)'],
                      opacity: 0.25,
                    }
                  : { scale: 1, filter: 'blur(0px) brightness(1)', opacity: 1 }
              }
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="h-full w-full object-cover object-center pointer-events-none"
              >
                <source src="/assets/videos/intro_vid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Dark Gradient Vignette for high contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 pointer-events-none" />

            {/* Light Dispersion / Flare Ring on Video End */}
            <AnimatePresence>
              {isVideoFinished && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, filter: 'blur(20px)' }}
                  animate={{ opacity: [0, 0.8, 0], scale: 2.2, filter: 'blur(40px)' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-purple-600/40 pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

            {/* 2. Branding Overlay - Emerges out of the dispersion flare */}
            {isVideoFinished && (
              <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
                {/* Logo with rounded vertices */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 20, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 overflow-hidden rounded-2xl border border-white/20 p-2 bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(99,102,241,0.25)]"
                >
                  <Image
                    src="/assets/images/hacksmiths-logo.png"
                    alt="HackSmiths Logo"
                    width={96}
                    height={96}
                    className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-xl"
                    priority
                  />
                </motion.div>

                {/* Animated Title: Left-to-Right Letter Reveal */}
                <motion.h1
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-600 md:text-8xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] font-mono"
                >
                  {BRAND_NAME.split('').map((letter, index) => (
                    <motion.span key={index} variants={letterVariants}>
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="mt-4 text-xs sm:text-sm tracking-[0.3em] text-neutral-300 uppercase font-mono"
                >
                  Build<span className="text-indigo-400">.</span> Compete<span className="text-indigo-400">.</span> Create<span className="text-indigo-400">.</span>
                </motion.p>
              </div>
            )}

            {/* 3. Dynamic Action Button */}
            <div className="absolute bottom-10 z-30 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isVideoFinished ? (
                  /* While video plays: Skip / Continue chip */
                  <motion.button
                    key="skip-btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    onClick={handleIntroComplete}
                    className="flex items-center gap-2 backdrop-blur-md px-6 py-2.5 text-xs font-mono tracking-widest text-neutral-300 uppercase hover:border-indigo-400 hover:text-white hover:bg-black/80 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                  >
                    <span>[ Continue ]</span>
                  </motion.button>
                ) : (
                  /* When video completes: Primary "Go to Home Page" CTA Button */
                  <motion.button
                    key="home-btn"
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleIntroComplete}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-3.5 text-sm font-semibold tracking-wider text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all cursor-pointer hover:border-indigo-400 hover:shadow-[0_0_45px_rgba(99,102,241,0.7)]"
                  >
                    <span className="relative z-10 font-mono uppercase tracking-widest">Go to Home Page</span>
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

      {/* Main Home Page Content - Hidden completely when intro is active to prevent glitching */}
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