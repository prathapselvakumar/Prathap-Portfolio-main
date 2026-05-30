"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import type { ReactNode } from "react";

const languages: { code: Language; label: string; shortLabel: string; flag: ReactNode }[] = [
  {
    code: "en",
    label: "English",
    shortLabel: "ENG",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-full h-full">
        <clipPath id="s-en"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" clipPath="url(#s-en)" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s-en)" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" clipPath="url(#s-en)" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" clipPath="url(#s-en)" />
      </svg>
    ),
  },
  {
    code: "ja",
    label: "Japanese",
    shortLabel: "日本語",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-full h-full">
        <rect width="900" height="600" fill="#fff" />
        <circle cx="450" cy="300" r="180" fill="#bc002d" />
      </svg>
    ),
  },
  {
    code: "de",
    label: "German",
    shortLabel: "Deutsch",
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className="w-full h-full">
        <rect width="5" height="3" y="0" fill="#000" />
        <rect width="5" height="2" y="1" fill="#D00" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    ),
  },
];

type LanguageSwitcherProps = {
  className?: string;
};

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { language: currentLang, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find((l) => l.code === currentLang)!;

  // Prevent hydration mismatch by rendering a placeholder or the default until mounted
  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 rounded-full border border-border bg-card min-w-[110px] h-11 opacity-50 md:max-xl:hidden",
        className
      )}>
        <div className="w-5 h-4 bg-muted rounded-[2px]" />
        <div className="w-8 h-3 bg-muted rounded" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch language from ${currentLanguage.label}`}
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer overflow-hidden min-w-[110px] md:max-xl:hidden",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentLang}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 w-full justify-center"
        >
          <div className="w-5 h-4 flex-shrink-0 rounded-[2px] overflow-hidden border border-border/50 shadow-sm">
            {currentLanguage.flag}
          </div>
          <span className="text-[10px] font-bold font-mono tracking-wider uppercase">
            {currentLanguage.shortLabel}
          </span>
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

