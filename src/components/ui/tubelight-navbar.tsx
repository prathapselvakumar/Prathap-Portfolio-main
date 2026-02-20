"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  onItemClick?: (url: string) => void;
}

export function NavBar({ items, className, onItemClick }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const isClickingRef = useRef(false);

  // Scroll-based section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is near top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Ignore scroll observer updates when manually clicking to scroll
      if (isClickingRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Find the matching nav item for this section
          const sectionId = entry.target.id;
          const matchingItem = items.find(item => item.url === `#${sectionId}`);

          if (matchingItem) {
            setActiveTab(matchingItem.name);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    items.forEach(item => {
      const sectionId = item.url.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (item: NavItem) => {
    setActiveTab(item.name);
    isClickingRef.current = true;

    if (onItemClick) {
      onItemClick(item.url);
    }

    // Unblock the observer after 1.5 seconds (adjust this timeout to match actual scroll speed)
    setTimeout(() => {
      isClickingRef.current = false;
    }, 1500);
  };

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-max max-w-[95vw] h-[49px]">
        <div className="relative flex items-center gap-4 py-1 px-1 rounded-full">
          {/* Liquid Glass Background */}
          <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            transition-all 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />

          <div
            className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
            style={{ backdropFilter: 'url("#navbar-glass")' }} />

          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleClick(item)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-7 py-2 rounded-full transition-all duration-300 z-10",
                  "text-foreground hover:text-primary hover:scale-105",
                  isActive && "text-primary"
                )}>
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isActive &&
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }} />
                }
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Filter for Glass Effect */}
      <svg className="hidden">
        <defs>
          <filter
            id="navbar-glass"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.05"
              numOctaves="1"
              seed="1"
              result="turbulence" />
            <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurredNoise"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>
    </>
  );
}