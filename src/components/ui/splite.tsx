'use client';

import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { cn } from '@/lib/utils';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Suspense fallback={<div className="w-full h-full bg-black/50 animate-pulse" />}>
        <Spline scene={scene} className="!w-full !h-full" />
      </Suspense>
    </div>);

}