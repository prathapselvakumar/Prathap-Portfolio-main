'use client';

import React, { useState, useEffect } from 'react';
import { AppleHelloEnglishEffect } from '@/components/ui/apple-hello';
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
    const audio = new Audio('/Audio/Website%20booting.m4a');
    audio.play().catch(e => console.warn('Audio play error:', e));
    if (onEnter) {
      onEnter();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Apple Hello Animation */}
      <div className="absolute inset-0 flex items-center justify-center -mt-16 pointer-events-none">
        <AppleHelloEnglishEffect className="text-white h-16 sm:h-24 md:h-32" speed={1.2} />
      </div>

      {/* Liquid Glass Button */}
      <div
        className={`
          absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-10
          transition-all duration-1500 ease-out
          ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <LiquidButton
          onClick={handleEnter}
          className="text-xl md:text-2xl tracking-[0.15em] md:tracking-[0.2em] uppercase font-extralight px-8 py-4 md:px-12 md:py-6"
        >
          Enter
        </LiquidButton>
      </div>
    </div>
  );
}