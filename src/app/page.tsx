'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/Landingpage/LandingPage';
import { SimpleLoading } from '@/components/SimpleLoading';
import { PortfolioContent } from '@/components/PortfolioContent';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [loadingType, setLoadingType] = useState<'welcome' | 'simple' | 'none'>('none');

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined' && !(window as any).appInitialized) {
      // This is a fresh browser load or a manual refresh
      setLoadingType('welcome');
      (window as any).appInitialized = true;
    } else {
      // This is an internal navigation back to Home (e.g., via breadcrumbs)
      setLoadingType('simple');
      const timer = setTimeout(() => {
        setLoadingType('none');
      }, 800);
      return () => clearTimeout(timer);
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