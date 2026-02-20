'use client';

import React, { useState } from 'react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { SparklesCore } from '@/components/ui/sparkles';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { motion } from 'framer-motion';
import { Education } from '@/components/Education';
import { Certificates } from '@/components/Certificates';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { Testimonials } from '@/components/Testimonials';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Home, User, GraduationCap, Briefcase, Code, FolderOpen, BookOpen, Award, MessageSquare } from 'lucide-react';
import { Publications } from '@/components/Publications';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { projects } from '@/lib/projects';

export function PortfolioContent() {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  React.useEffect(() => {
    setMounted(true);
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
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Education', url: '#education', icon: GraduationCap },
    { name: 'Experience', url: '#experience', icon: Briefcase },
    { name: 'Skills', url: '#skills', icon: Code },
    { name: 'Projects', url: '#projects', icon: FolderOpen },
    { name: 'Publications', url: '#publications', icon: BookOpen },
    { name: 'Certificates', url: '#certificates', icon: Award },
    { name: 'Testimonials', url: '#testimonials', icon: MessageSquare }];

  // Projects data with categories



  // Extract unique categories
  const allCategories = ['All', ...Array.from(new Set(projects.flatMap((p) => p.categories)))];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All' ?
    projects :
    projects.filter((p) => p.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 sm:pb-0">
      {/* Navigation Bar */}
      <NavBar
        items={navItems}
        onItemClick={handleNavClick} />


      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
      </div>

      {/* Hero Section - Full Screen Split */}
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="currentColor" />

          {/* 3D Scene - Absolute Background */}
          <div className="absolute top-0 right-0 h-full w-full md:w-[60%] z-0">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>

          <div className="flex h-full flex-col lg:flex-row relative z-10 pointer-events-none">
            {/* Left: Text Content */}
            <motion.div
              className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-center pointer-events-auto max-w-4xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Robotics Engineer - Now at the top */}
                  <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest mb-4">
                    Robotics Graduate
                  </p>

                  {/* Name - Theme Aware */}
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground mb-8">
                    Prathap Selvakumar
                  </h1>

                  {/* Sparkles Effect - Theme-Aware for Both Light and Dark Mode */}
                  <div className="w-full md:w-[40rem] h-40 relative mt-4">
                    {/* Gradients - Theme Aware */}
                    <div className="absolute left-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 dark:via-indigo-400 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute left-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 dark:via-indigo-400 to-transparent h-px w-3/4" />
                    <div className="absolute left-0 top-0 bg-gradient-to-r from-transparent via-sky-500 dark:via-sky-400 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute left-0 top-0 bg-gradient-to-r from-transparent via-sky-500 dark:via-sky-400 to-transparent h-px w-1/4" />

                    {/* Core component - Theme Aware Particles */}
                    {mounted && (
                      <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1}
                        particleDensity={1200}
                        className="w-full h-full"
                        particleColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
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

      {/* About Section - Asymmetric Grid */}
      <section id="about" className="min-h-screen py-20 px-8 md:px-16 bg-background flex items-center">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text takes 7 columns */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground text-center">
                About Me
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                I'm a dedicated robotics engineering student with a passion for creating
                intelligent systems that solve real-world problems. My journey combines
                Python, ROS2, and machine learning.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Currently focusing on autonomous navigation, computer vision, and
                human-robot interaction. I am seeking a role where I can apply my expertise to deliver tangible results. My focus is on execution and bringing value to the team immediately.
              </p>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {['Robotics', 'AI/ML', 'Computer Vision', 'Embedded Systems'].map((skill) =>
                  <div key={skill} className="p-4 border border-border rounded-lg bg-card">
                    <p className="text-foreground font-semibold">{skill}</p>
                  </div>
                )}
              </div>

              {/* Download CV and LinkedIn Buttons */}
              <motion.div
                className="pt-6 flex gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}>

                <LiquidButton
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Prathap Selvakumar-CV.pdf';
                    link.download = 'Prathap Selvakumar-CV.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>

                  Download CV
                </LiquidButton>
                <LiquidButton
                  onClick={() => {
                    // Open LinkedIn profile - replace with actual LinkedIn URL
                    window.open('https://www.linkedin.com/in/prathapsk', '_blank', 'noopener,noreferrer');
                  }}>

                  LinkedIn
                </LiquidButton>
              </motion.div>
            </div>

            {/* Image takes 5 columns */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-border">
                <img
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/DSC00380-1762246337337.JPG?width=8000&height=8000&resize=contain"
                  alt="Profile"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />

              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Education Section */}
      <div id="education">
        <Education />
      </div>

      {/* Experience Section */}
      <div id="experience">
        <Experience />
      </div>

      {/* Skills Section */}
      <div id="skills">
        <Skills />
      </div>

      {/* Projects Section - Bento Grid */}
      <section id="projects" className="min-h-screen py-20 px-8 md:px-16 bg-background flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}>

            Featured Projects
          </motion.h2>

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

                {category}
              </LiquidButton>
            )}
          </motion.div>

          {/* Asymmetric Layout: Large Left + Stacked Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => {
              const isLarge = project.size === 'large';

              return (
                <motion.div
                  key={project.id}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${isLarge ? 'h-[500px] lg:h-[700px] lg:row-span-2' : 'h-[340px]'}`
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 lg:p-8">
                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.categories.map((cat) =>
                        <span
                          key={cat}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white">

                          {cat}
                        </span>
                      )}
                    </div>

                    <h3 className={`font-bold text-white mb-2 ${isLarge ? 'text-4xl lg:text-5xl mb-4' : 'text-2xl lg:text-3xl'}`
                    }>
                      {project.title}
                    </h3>
                    <p className={`text-neutral-300 ${isLarge ? 'text-lg mb-6 max-w-lg' : 'text-sm mb-4'}`
                    }>
                      {project.description}
                    </p>
                    <Link
                      href={project.id === 'audio-search' ? "/projects/audio-search" : `/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="default"
                        className="w-fit bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        View Project
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
                No projects found in this category.
              </p>
            </motion.div>
          }
        </div>
      </section>

      {/* Publications Section */}
      <Publications />

      {/* Certificates Section */}
      <div id="certificates">
        <Certificates />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* Footer */}

    </div>);

}