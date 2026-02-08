'use client';

import React, { useState, useEffect } from 'react';
import { SpiralAnimation } from '@/components/ui/spiral-animation';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface LoadingScreenProps {
  onEnter?: () => void;
}

export function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const [startVisible, setStartVisible] = useState(false);
  
  // Fade in the enter button after animation loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleEnter = () => {
    if (onEnter) {
      onEnter();
    }
  };
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Spiral Animation */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      {/* Liquid Glass Button */}
      <div 
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          transition-all duration-1500 ease-out
          ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <LiquidButton 
          onClick={handleEnter}
          className="text-2xl tracking-[0.2em] uppercase font-extralight px-12 py-6"
        >
          Enter
        </LiquidButton>
      </div>
    </div>
  );
}