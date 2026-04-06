"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  mainText: string;
  cvUrl?: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
}

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="p-3 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md rounded-full text-foreground transition-all hover:scale-110 shadow-sm border border-foreground/10">
    <Icon className="h-6 w-6" />
  </a>
);

// The main reusable Hero Section component
export const MinimalistHero = ({
  mainText,
  cvUrl,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background font-sans p-6 md:p-12 lg:p-20',
        className
      )}
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-20 grid w-full max-w-7xl grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Image in Box */}
        <motion.div 
          className="flex justify-center md:justify-start w-full"
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* THE BOX */}
          <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] md:aspect-[4/5] rounded-[2rem] bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden group flex items-center justify-center">
            
            {/* Box dynamic background glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 w-full h-full object-cover object-top pointer-events-none drop-shadow-2xl"
              initial={{ y: 50 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/400x500/eab308/ffffff?text=Image+Not+Found`;
              }}
            />
          </div>
        </motion.div>

        {/* Right Column: Text & Actions */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-foreground tracking-tighter leading-[0.9]">
              {overlayText.part1} {overlayText.part2}
            </h1>
          </motion.div>

          {/* Description & Actions (Unboxed) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/80">
              {mainText}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-foreground text-background text-sm font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Download CV
                </a>
              )}

              <div className="flex items-center space-x-4">
                {socialLinks.map((link, index) => (
                  <SocialIcon key={index} href={link.href} icon={link.icon} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
