'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/Landingpage/LandingPage';
import { SimpleLoading } from '@/components/SimpleLoading';
import { PortfolioContent } from '@/components/PortfolioContent';

export default function Home() {
  const [loadingType, setLoadingType] = useState<'welcome' | 'simple' | 'none'>('welcome'); // Default to welcome for SSR so it covers the screen if JS is slow

  useEffect(() => {
    // Check if this is the first time the app is loading in this browser tab
    if (typeof window !== 'undefined' && !(window as any).appInitialized) {
      // First load or hard refresh: play the full welcome animation
      setLoadingType('welcome');
      (window as any).appInitialized = true;
    } else {
      // Internal navigation: no loader needed
      setLoadingType('none');
    }
  }, []);

  return (
    <>
      <PortfolioContent />
      <AnimatePresence mode="wait">
        {loadingType === 'welcome' && (
          <LandingPage 
            key="welcome" 
            onComplete={() => {
              setLoadingType('none');
              sessionStorage.setItem('hasVisited', 'true');
            }} 
          />
        )}
        {loadingType === 'simple' && (
          <SimpleLoading key="simple" />
        )}
      </AnimatePresence>
    </>
  );
}