'use client';

import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { cn } from '@/lib/utils';

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (spline: any) => void;
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Suspense fallback={<div className="w-full h-full bg-black/50 animate-pulse" />}>
        <Spline scene={scene} className="!w-full !h-full" onLoad={onLoad} />
      </Suspense>
    </div>);

}