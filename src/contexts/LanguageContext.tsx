"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "en" | "ja" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("portfolio-language") as Language;
    if (savedLang && ["en", "ja", "de"].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Basic auto-detection if no saved preference
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "ja") setLanguageState("ja");
      else if (browserLang === "de") setLanguageState("de");
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-language", lang);
    document.documentElement.lang = lang;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      let next: Language;
      if (prev === "en") next = "ja";
      else if (prev === "ja") next = "de";
      else next = "en";
      
      localStorage.setItem("portfolio-language", next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
