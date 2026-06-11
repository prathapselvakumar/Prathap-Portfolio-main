'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Component } from '@/components/ui/vapour-text-effect';

export function LandingPage({ onComplete }: { onComplete: () => void }) {
  const [isLowEnd, setIsLowEnd] = React.useState(false);

  useEffect(() => {
    // Detect low-end devices
    const isLowPower = (navigator.hardwareConcurrency ?? 4) <= 2;
    setIsLowEnd(isLowPower);

    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // reduced to 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex w-full h-screen justify-center items-center bg-white dark:bg-black text-black dark:text-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {isLowEnd ? (
        <div className="text-4xl font-bold tracking-widest animate-pulse">PRATHAP SELVAKUMAR</div>
      ) : (
        <Component />
      )}
    </motion.div>
  );
}