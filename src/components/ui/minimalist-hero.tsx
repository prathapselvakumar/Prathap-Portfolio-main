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

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
    <Icon className="h-5 w-5" />
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
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-8 font-sans md:p-12',
        className
      )}
    >
      {/* Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold tracking-wider"
        >
       
        </motion.div>
        <div className="hidden items-center space-x-8 md:flex">
          {/* navLinks removed */}
        </div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-5 bg-foreground"></span>
        </motion.button>
      </header>
 
      {/* Separate Description Div */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute left-4 top-[30%] z-40 max-w-sm text-left md:left-6 lg:left-12"
      >
        <p className="text-xl font-normal leading-relaxed text-foreground/90">{mainText}</p>
        
        <div className="mt-8 flex items-center gap-6">
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
 
      {/* Separate Title Div */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute right-4 top-[30%] z-40 text-right md:right-6 lg:right-12"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground md:text-8xl lg:text-9xl tracking-tighter leading-none">
          {overlayText.part1}
          <br />
          {overlayText.part2}
        </h1>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3 gap-8 md:gap-0">
        {/* Left Column (Empty to maintain grid balance) */}
        <div className="order-2 md:order-1" />

        {/* Center Image with Circle */}
        <div className="relative order-1 md:order-2 flex justify-center items-end h-full min-h-[400px]">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="absolute z-0 h-[400px] w-[400px] rounded-full bg-yellow-400/90 md:h-[550px] md:w-[550px] lg:h-[700px] lg:w-[700px] mb-0 -translate-x-5"
            ></motion.div>
            
            <motion.img
                src={imageSrc}
                alt={imageAlt}
                className="relative z-10 h-auto w-56 md:w-64 lg:w-72 rounded-lg overflow-hidden object-cover"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                style={{ 
                  scaleX: 2, 
                  scaleY: 2,
                  transformPerspective: 500,
                  opacity: 1,
                  fontVariant: 'jis78'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                }}
            />
        </div>

        {/* Right Column (Empty to maintain grid balance) */}
        <div className="order-3" />
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl items-end justify-between mt-8 md:mt-0">
        <div /> {/* Left spacer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-sm font-medium text-foreground/80"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};
