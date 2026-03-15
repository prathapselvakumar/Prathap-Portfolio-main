'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Component } from '@/components/ui/vapour-text-effect';

export function LandingPage({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Single text animation time:
    // vaporize (2s) + fadeIn (1s) + wait (0.5s) = 3.5s total
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds for complete animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex w-full h-screen justify-center items-center bg-white dark:bg-black text-black dark:text-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Component />
    </motion.div>
  );
}