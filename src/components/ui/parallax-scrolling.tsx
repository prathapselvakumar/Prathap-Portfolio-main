'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent({ children }: { children?: React.ReactNode }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        const elements = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (elements.length > 0) {
          tl.to(
            elements,
            {
              yPercent: layerObj.yPercent,
              ease: "none"
            },
            idx === 0 ? undefined : "<"
          );
        }
      });
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowPower = (navigator.hardwareConcurrency ?? 4) <= 2;
    const isLowEnd = prefersReduced || isLowPower;

    let lenis: Lenis | null = null;
    if (!isLowEnd) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis?.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div ref={parallaxRef} className="parallax-wrapper w-full h-full relative">
      {children}
    </div>
  );
}