'use client';

import React, { useState } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { SparklesCore } from '@/components/ui/sparkles';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { motion } from 'framer-motion';
import { Education } from '@/components/Education';
import { Certificates } from '@/components/Certificates';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { Testimonials } from '@/components/Testimonials';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Home, User, GraduationCap, Briefcase, Code, FolderOpen, BookOpen, Award, MessageSquare } from 'lucide-react';
import { Publications } from '@/components/Publications';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { Github, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

/**
 * PortfolioContent Component
 * Main container for the portfolio, rendering the hero section, about, 
 * education, experience, and the filtered projects gallery.
 */
export function PortfolioContent() {
  const { language } = useLanguage();
  const t = translations[language];

  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  React.useEffect(() => {
    setMounted(true);
    
    // Theme observer: directly monitors the <html> class to instantly
    // update particle colors (SparklesCore) when switching light/dark modes.
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Scroll Spy: Update URL hash as user scrolls
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // We use a small threshold and a specific rootMargin to trigger
        // when the section enters the top-middle part of the screen.
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }
      });
    }, { 
      // This margin triggers when the section is in the top 30% of the viewport
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0.01 
    });

    const sectionIds = ['hero', 'about', 'education', 'experience', 'skills', 'projects', 'publications', 'certificates', 'testimonials'];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const scrollToSection = (url: string) => {
    const id = url.replace('#', '');
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ─── Spline Control ─── */
  const splineRef = React.useRef<any>(null);

  const handleSplineLoad = (spline: any) => {
    splineRef.current = spline;
    console.log("Spline loaded", spline);
  };

  /**
   * Triggers the "Bye" animation for the 3D robot scene.
   * This provides an interactive send-off when the user navigates away from the Hero section.
   */
  const triggerRobotBye = () => {
    if (splineRef.current) {
      // Attempt to trigger "Bye" animation
      // Assuming "Robot" is the object name and "mouseDown" triggers the action
      // You may need to adjust "Robot" to the exact name in your Spline scene
      const robot = splineRef.current.findObjectByName('Robot');
      if (robot) {
        splineRef.current.emitEvent('mouseDown', 'Robot');
        console.log("Triggered Bye animation on Robot");
      } else {
        console.log("Robot object not found in Spline scene");
        // Fallback: emit global event if specific object not found
        splineRef.current.emitEvent('mouseDown');
      }
    }
  };

  const handleNavClick = (url: string) => {
    scrollToSection(url);

    // If navigating away from home, trigger robot "Bye"
    if (url !== '#hero') {
      triggerRobotBye();
    }
  };

  const navItems = [
    { name: t.nav.home, url: '#hero', icon: Home },
    { name: t.nav.about, url: '#about', icon: User },
    { name: t.nav.education, url: '#education', icon: GraduationCap },
    { name: t.nav.experience, url: '#experience', icon: Briefcase },
    { name: t.nav.skills, url: '#skills', icon: Code },
    { name: t.nav.projects, url: '#projects', icon: FolderOpen },
    { name: t.nav.publications, url: '#publications', icon: BookOpen },
    { name: t.nav.certificates, url: '#certificates', icon: Award },
    { name: t.nav.testimonials, url: '#testimonials', icon: MessageSquare }];

  // Extract unique categories from all projects to dynamically build the filter menu
  const discoveredCategories = Array.from(new Set(projects.flatMap((p) => p.categories)));
  const preferredOrder = ['Robotics', 'AI/ML', 'Algorithms', 'Computer Vision'];
  const orderedCategories = [
    ...preferredOrder.filter((category) => discoveredCategories.includes(category)),
    ...discoveredCategories.filter((category) => !preferredOrder.includes(category)),
  ];
  const allCategories = ['All', ...orderedCategories];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' ?
    projects :
    projects.filter((p) => p.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 sm:pb-0 scroll-smooth">
      {/* Navigation Bar */}
      <NavBar
        items={navItems}
        onItemClick={handleNavClick} />


      {/* Theme & Language Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <LanguageSwitcher className="h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
        <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
      </div>

      {/* Hero Section - Full Screen Split */}
      <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-background">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="currentColor" />

          {/* 3D Scene - Absolute Background */}
          <div className="absolute bottom-0 right-0 h-[60%] w-full z-0 md:top-0 md:bottom-auto md:h-full md:w-[60%] md:max-lg:bottom-0 md:max-lg:top-auto md:max-lg:h-[65%] md:max-lg:w-full md:max-lg:-bottom-10">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>

          <div className="flex h-full flex-col md:flex-row md:max-lg:flex-col relative z-10 pointer-events-none items-center">
            {/* Left: Text Content */}
            <motion.div
              className="flex-1 p-4 sm:p-8 md:p-12 lg:p-24 flex flex-col justify-center pt-0 items-center text-center pointer-events-auto max-w-2xl lg:max-w-4xl mx-auto w-full md:items-start md:text-left md:mx-0 md:max-lg:justify-start md:max-lg:pt-32 md:max-lg:items-center md:max-lg:text-center md:max-lg:mx-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4 md:space-y-6 flex flex-col items-center w-full md:items-start md:max-lg:items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full flex flex-col items-center md:items-start md:max-lg:items-center"
                >
                  {/* Robotics Engineer - Now at the top */}
                  <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest mb-4">
                    {t.hero.role}
                  </p>

                  {/* Name */}
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground mt-6 mb-4 md:mb-8 whitespace-nowrap">
                    {t.hero.name}
                  </h1>
                 

                  {/* Sparkles Effect - Theme-Aware for Both Light and Dark Mode */}
                  <div className="w-full max-w-[80vw] md:max-w-none md:w-[25rem] lg:w-[40rem] h-24 md:h-40 relative mt-4 md:mt-8 mx-auto md:mx-0 md:max-lg:mx-auto">
                    {/* Gradients - Theme Aware */}
                    <div className="absolute inset-x-0 md:inset-x-auto mx-auto md:mx-0 md:max-lg:inset-x-0 md:max-lg:mx-auto md:left-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 dark:via-indigo-400 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-0 md:inset-x-auto mx-auto md:mx-0 md:max-lg:inset-x-0 md:max-lg:mx-auto md:left-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 dark:via-indigo-400 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-0 md:inset-x-auto mx-auto md:mx-0 md:max-lg:inset-x-0 md:max-lg:mx-auto md:left-0 top-0 bg-gradient-to-r from-transparent via-sky-500 dark:via-sky-400 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-0 md:inset-x-auto mx-auto md:mx-0 md:max-lg:inset-x-0 md:max-lg:mx-auto md:left-0 top-0 bg-gradient-to-r from-transparent via-sky-500 dark:via-sky-400 to-transparent h-px w-1/4" />

                    {/* Core component - Theme Aware Particles */}
                    {mounted && (
                      <SparklesCore
                        key={String(isDark)}
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor={isDark ? '#FFFFFF' : '#000000'}
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right spacer for layout balance if needed, but flex-1 on left handles it */}
            <div className="flex-1" />
          </div>
        </div>
      </section>

      {/* About Section - Redesigned Minimalist Hero */}
      <section id="about" className="min-h-screen bg-background overflow-hidden">
        <MinimalistHero
          mainText={t.about.mainText}
          cvUrl="/Prathap Selvakumar-CV.pdf"
          downloadCvText={t.about.download_cv}
          imageSrc="/Team_and_Testimonial/prathapselvakumar.png"
          imageAlt="Prathap Selvakumar"
          overlayText={{
            part1: t.about.title1,
            part2: t.about.title2
          }}
          socialLinks={[
            { icon: Linkedin, href: "https://www.linkedin.com/in/prathapsk" },
            { icon: Github, href: "https://github.com/prathapselvakumar" }
          ]}
          locationText=""
        />
      </section>

      {/* Education Section */}
      <section id="education" className="min-h-screen py-24 md:py-32 px-6 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Education />
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen py-24 md:py-32 px-6 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Experience />
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-24 md:py-32 px-6 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Skills />
        </div>
      </section>

      {/* Projects Section - Bento Grid */}
      <section id="projects" className="min-h-screen py-24 md:py-32 px-4 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}>

            {t.projects.title}
          </motion.h2>
          <motion.p
            className="text-sm md:text-base text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}>
            {t.projects.subtitle}
          </motion.p>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap gap-3 mb-12 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}>

            {allCategories.map((category) =>
              <LiquidButton
                key={category}
                onClick={() => setSelectedCategory(category)}
                size="default"
                className={`${selectedCategory === category ?
                  'bg-foreground text-background' :
                  'bg-background text-muted-foreground hover:text-foreground'}`
                }>

                {((translations[language].projects.categories as any)?.[category.toLowerCase().replace(/[\s/]/g, '_')]) || category}
              </LiquidButton>
            )}
          </motion.div>

          {/* Asymmetric Layout: Large Left + Stacked Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => {
              const isLarge = project.size === 'large';

              return (
                <motion.div
                  key={project.id}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${isLarge ? 'h-[400px] sm:h-[500px] md:h-[700px] md:row-span-2' : 'h-[280px] sm:h-[340px]'}`
                  }
                  initial={{ opacity: 0, x: isLarge ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}>

                  <div className="h-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-5 md:p-6 lg:p-8">
                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                      {project.categories?.map((cat) =>
                        <span
                          key={cat}
                          className="px-2 md:px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[10px] md:text-xs text-white">

                          {((translations[language].projects.categories as any)?.[cat.toLowerCase().replace(/[\s/]/g, '_')]) || cat}
                        </span>
                      )}
                    </div>

                    <h3 className={`font-bold text-white mb-2 ${isLarge ? 'text-2xl sm:text-3xl lg:text-5xl mb-2 sm:mb-4' : 'text-xl md:text-2xl lg:text-3xl'}`
                    }>
                      {project.title}
                    </h3>
                    <p className={`text-neutral-300 line-clamp-2 md:line-clamp-none ${isLarge ? 'text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-lg' : 'text-xs md:text-sm mb-3 md:mb-4'}`
                    }>
                      {language === 'ja' && project.description_ja ? project.description_ja : project.description}
                    </p>
                    <Link
                      href={project.id === 'audio-search' ? "/projects/audio-search" : `/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="default"
                        className="w-fit bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        {t.projects.viewProject}
                      </Button>
                    </Link>
                  </div>
                </motion.div>);

            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 &&
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>

              <p className="text-muted-foreground text-lg">
                {t.projects.noProjects}
              </p>
            </motion.div>
          }
        </div>
      </section >

      {/* Publications Section */}
      <section id="publications" className="min-h-screen py-24 md:py-32 px-4 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Publications />
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="min-h-screen py-24 md:py-32 px-4 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Certificates />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="min-h-screen py-24 md:py-32 px-4 sm:px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <Testimonials />
        </div>
      </section>

      {/* Footer */}

    </div >);

}

