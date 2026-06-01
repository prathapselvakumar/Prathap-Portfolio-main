'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/Landingpage/LandingPage';
import { SimpleLoading } from '@/components/SimpleLoading';
import { PortfolioContent } from '@/components/PortfolioContent';

/**
 * Home Component
 * 
 * The main entry point for the portfolio application.
 * Manages the initial loading sequence, transitioning from a full-page "Welcome" 
 * loading screen (on first load) to a "Simple" loading screen (on fast inner-navigation),
 * and finally rendering the actual `PortfolioContent`.
 */
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [loadingType, setLoadingType] = useState<'welcome' | 'simple' | 'none'>('none');

  useEffect(() => {
    setIsClient(true);
    
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

  // Hydration guard to ensure consistent render
  if (!isClient) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loadingType === 'welcome' ? (
          <LandingPage 
            key="welcome" 
            onComplete={() => {
              setLoadingType('none');
              sessionStorage.setItem('hasVisited', 'true');
            }} 
          />
        ) : loadingType === 'simple' ? (
          <SimpleLoading key="simple" />
        ) : (
          <PortfolioContent key="portfolio" />
        )}
      </AnimatePresence>
    </>
  );
}