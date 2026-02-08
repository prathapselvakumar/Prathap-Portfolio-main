'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: "csq-swe",
    title: "Software Engineer",
    company: "C-Square Info Solutions (Subsidiary of Reliance Retail)",
    period: "AUG-2024 to MAY-2025",
    description: [
      "Working with React.js and Node.js to develop full-stack web applications",
      "Collaborating with cross-functional teams to deliver high-quality software solutions",
      "Implementing responsive designs and ensuring optimal performance across devices"
    ],
    technologies: ["React.js", "JavaScript", "HTML/CSS", "Git"],
  },
  {
    id: "qentelli-intern",
    title: "AI/ML Project Intern",
    company: "Qentelli Solutions",
    period: "FEB-2024 to APR-2024",
    description: [
      "Participated in AI/ML projects focused on predictive analytics",
      "Assisted in developing machine learning models for business applications",
      "Gained hands-on experience with machine learning frameworks and tools"
    ],
    technologies: ["Python", "Machine Learning", "Predictive Analytics", "Data Science"],
  },
  {
    id: "nus-academic-intern",
    title: "Big Data Analytics using Deep Learning - Academic Internship",
    company: "National University of Singapore",
    period: "DEC-2023 to JAN-2024",
    description: [
      "Applied deep learning techniques to analyze large datasets",
      "Worked on research projects involving pattern recognition in data",
      "Collaborated with academic researchers on cutting-edge deep learning approaches"
    ],
    technologies: ["Python", "TensorFlow", "Deep Learning", "Big Data Analytics"],
  },
  {
    id: "csq-intern",
    title: "Python Developer Intern",
    company: "C-Square Info Solutions (Subsidiary of Reliance Retail)",
    period: "SEP-2023 to NOV-2023",
    description: [
      "Developed Python scripts for automation and data processing",
      "Worked on internal tools to improve team productivity",
      "Gained experience with database operations and API integration"
    ],
    technologies: ["Python", "SQL", "Data Processing", "MongoDB"],
  },
];

export function Experience() {
  const [activeTab, setActiveTab] = useState(experiences[0].id);

  return (
    <section className="py-20 px-8 md:px-16 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tabs for larger screens */}
          <div className="hidden lg:flex lg:col-span-4 flex-col border-r border-border pr-4 space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <button
                  onClick={() => setActiveTab(exp.id)}
                  className={cn(
                    "w-full liquid-glass-card p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                    "hover:scale-[1.02] transform transition-transform duration-200",
                    "border border-border rounded-xl bg-card",
                    activeTab === exp.id 
                      ? "border-l-4 border-l-foreground bg-accent shadow-[0_0_20px_5px_rgba(59,130,246,0.3)]" 
                      : "border-l-4 border-l-transparent hover:border-l-foreground/50 hover:bg-accent/50 hover:shadow-[0_0_15px_3px_rgba(59,130,246,0.2)]"
                  )}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground shadow-[0_0_10px_3px_rgba(59,130,246,0.8)] transition-all duration-300",
                    activeTab === exp.id ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  )}></div>
                  <div className="pl-2 relative z-10">
                    <h3 className="font-semibold text-sm leading-tight text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          {/* Tabbed content */}
          <div className="lg:col-span-8 lg:pl-6">
            {/* Mobile tabs */}
            <div className="lg:hidden mb-6 overflow-x-auto flex gap-2 pb-2">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveTab(exp.id)}
                  className={cn(
                    "px-4 py-2 whitespace-nowrap text-sm rounded-full transition-colors",
                    activeTab === exp.id
                      ? "bg-foreground text-background"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {exp.title.split(' ')[0]} {/* Show first word */}
                </button>
              ))}
            </div>
            
            {/* Content */}
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={cn(
                  "transition-all duration-300",
                  activeTab === exp.id ? "animate-fade-in" : "hidden"
                )}
              >
                <div className="space-y-4">
                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                      <p className="text-lg text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                    </div>
                  </div>
                
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Key Responsibilities</h4>
                    <ul className="space-y-2">
                      {exp.description.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-foreground mr-2">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                
                  <div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 p-4">
                        <h4 className="text-sm font-medium mb-3 text-foreground/80">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/30 
                                       bg-card backdrop-blur-sm hover:bg-accent 
                                       transition-all duration-300 hover:shadow-sm text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}