'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { PortfolioContent } from '@/components/PortfolioContent';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingPage key="landing" onComplete={() => setShowLanding(false)} />
        ) : (
          <PortfolioContent key="portfolio" />
        )}
      </AnimatePresence>
    </>
  );
}