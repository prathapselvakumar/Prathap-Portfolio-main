"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShatterButton } from './ShatterButton';
import { AnimatedBlobImage } from './frame';
// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  mainText: string;
  cvUrl?: string;
  downloadCvText?: string;
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
  downloadCvText = "Download CV",
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // The app's theme toggler uses direct DOM manipulation rather than next-themes.
  // We must observe the document class to sync the shatter color.
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Sync initial theme
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    syncTheme();

    // Observe theme changes
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Determine the shatter color based on the actual DOM theme
  const shatterColor = isDark ? '#ffffff' : '#000000';

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
        
        {/* Left Column: Animated Blob Photo */}
        <motion.div
          className="flex justify-center md:justify-start w-full"
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AnimatedBlobImage
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl"
          />
        </motion.div>

        {/* Right Column: Text & Actions */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-7xl ipad-pro-hero-text lg:text-8xl font-extrabold text-foreground tracking-tighter leading-[0.9]">
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
                <ShatterButton
                  shatterColor={shatterColor}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = cvUrl;
                    link.download = '';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-sm hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {downloadCvText}
                </ShatterButton>
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
