'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingIntroGateProps {
  children: React.ReactNode;
}

export default function LandingIntroGate({ children }: LandingIntroGateProps) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the intro has already played in this browser session
    const hasSeenIntro = sessionStorage.getItem('hs_intro_seen');

    if (hasSeenIntro) {
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('hs_intro_seen', 'true');
    setShowIntro(false);
  };

  // Prevent flash of content during hydration
  if (showIntro === null) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="splash-intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
          >
            {/* Cinematic Animated Logo / Video Clip Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 md:text-7xl">
                HACKSMITHS
              </h1>
              <p className="mt-3 text-sm tracking-widest text-neutral-400 uppercase">
                Build. Compete. Create.
              </p>
            </motion.div>

            {/* Skip / Auto-trigger Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              onClick={handleIntroComplete}
              className="absolute bottom-10 text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
            >
              [ Press anywhere or skip to continue ]
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Home Page Content */}
      <motion.div
        initial={{ opacity: showIntro ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: showIntro ? 0.4 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}