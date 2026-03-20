'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function SimpleLoading() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex w-full h-screen justify-center items-center bg-white dark:bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Blank loading screen as requested */}
    </motion.div>
  );
}
