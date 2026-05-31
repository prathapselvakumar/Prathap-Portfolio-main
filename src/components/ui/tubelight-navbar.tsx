"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  forceDark?: boolean;
}

export function NavBar({ items, className, onItemClick, forceDark }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isOpen, setIsOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      {/* ─── DESKTOP VIEW (tubelight pill, hidden on mobile/tablet) ─── */}
      <div className={cn("fixed top-6 left-1/2 -translate-x-[60%] sm:left-8 sm:-translate-x-0 ipad-pro-nav-adjust lg:left-1/2 lg:-translate-x-1/2 z-50 w-max max-w-[95vw] hidden md:block", forceDark && "dark", className)}>
        <div className="relative flex items-center gap-0.5 sm:gap-1 lg:gap-2 py-1 px-1 rounded-full overflow-x-auto sm:overflow-x-visible no-scrollbar">
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
                  "relative cursor-pointer text-[11px] md:text-xs lg:text-sm font-semibold px-2 sm:px-3 md:px-2.5 lg:px-4 py-1.5 md:py-2 rounded-full transition-all duration-300 z-10 flex-shrink-0 flex items-center justify-center gap-1.5",
                  "text-foreground hover:text-primary hover:scale-105",
                  isActive && "text-primary"
                )}>
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden pt-[1px]">
                  <Icon className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" strokeWidth={2.5} />
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

      {/* ─── MOBILE VIEW (floating hamburger button, visible on mobile/tablet) ─── */}
      <div className={cn("fixed top-6 left-6 z-50 md:hidden", forceDark && "dark", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 group active:scale-95
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {/* Glass background */}
          <div
            className="absolute inset-0 -z-10 rounded-full bg-background/5"
            style={{ backdropFilter: 'blur(8px) saturate(120%)' }} />

          {/* Morphing Hamburger lines */}
          <motion.div
            animate={isOpen ? "open" : "closed"}
            className="relative flex flex-col justify-center items-center gap-[5px] w-6 h-6"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 7 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-5 h-[2px] bg-foreground rounded-full origin-center"
            />
            <motion.span
              variants={{
                closed: { opacity: 1, scale: 1 },
                open: { opacity: 0, scale: 0 },
              }}
              transition={{ duration: 0.15 }}
              className="w-5 h-[2px] bg-foreground rounded-full"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -7 },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-5 h-[2px] bg-foreground rounded-full origin-center"
            />
          </motion.div>
        </button>
      </div>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn("fixed inset-0 z-40 bg-background/70 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center px-6", forceDark && "dark")}
          >
            {/* Soft Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

            {/* Vertical Menu Links */}
            <motion.nav
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  }
                }
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col gap-3 w-full max-w-xs z-10"
            >
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <motion.button
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
                    }}
                    onClick={() => {
                      handleClick(item);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "relative w-full py-3.5 pl-10 pr-6 rounded-2xl flex items-center gap-4 transition-all duration-300 border border-transparent cursor-pointer group active:scale-98",
                      isActive 
                        ? "bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/5" 
                        : "hover:bg-accent/40 text-foreground hover:text-primary hover:border-border/40"
                    )}
                  >
                    {/* Active Tubelight Left Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-lamp"
                        className="absolute left-3 w-1.5 h-6 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    )}
                    
                    <div className={cn(
                      "p-2 rounded-xl flex items-center justify-center transition-all",
                      isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:text-primary"
                    )}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-base font-semibold tracking-wide">{item.name}</span>
                  </motion.button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

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