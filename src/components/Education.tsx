'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string[];
  achievements: string[];
  cgpa?: string;
  logo: string;
}

const education: EducationItem[] = [
  {
    id: "msc-robotics",
    degree: "MSc Robotics",
    institution: "University of Manchester, Manchester, United Kingdom",
    period: "2025 - Current",
    description: [
      "Advanced study in robotics systems, autonomous navigation, and intelligent control",
      "Research focus on AI-driven robotic applications and human-robot interaction",
      "Hands-on experience with cutting-edge robotics hardware and simulation environments",
      "Collaborative projects with industry partners and research institutions"
    ],
    achievements: ["Admitted to prestigious MSc program", "Research opportunities", "Industry collaborations"],
    logo: "/University_of_Manchester.svg"
  },
  {
    id: "btech-cse",
    degree: "B.Tech in Computer Science and Engineering",
    institution: "SRM Institute of Science and Technology, Chennai, India",
    period: "2020 - 2024",
    cgpa: "8.49",
    description: [
      "Comprehensive study of computer science fundamentals including algorithms, data structures, and software engineering",
      "Specialized coursework in artificial intelligence, machine learning, and robotics",
      "Hands-on experience with various programming languages and development frameworks",
      "Strong foundation that prepared for advanced robotics studies"
    ],
    achievements: ["CGPA: 8.49", "Dean's List Recognition", "Active participation in technical societies"],
    logo: "/SRM University.svg"
  },
];

export function Education() {
  const [activeTab, setActiveTab] = useState(education[0].id);

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
          Education
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tabs for larger screens */}
          <div className="hidden lg:flex lg:col-span-4 flex-col border-r border-border pr-4 space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="relative">
                <button
                  onClick={() => setActiveTab(edu.id)}
                  className={cn(
                    "w-full liquid-glass-card p-6 cursor-pointer transition-all duration-300 relative overflow-hidden",
                    "hover:scale-[1.02] transform transition-transform duration-200",
                    "border border-border rounded-xl bg-card",
                    activeTab === edu.id
                      ? "border-l-4 border-l-foreground bg-accent shadow-[0_0_20px_5px_rgba(59,130,246,0.3)]"
                      : "border-l-4 border-l-transparent hover:border-l-foreground/50 hover:bg-accent/50 hover:shadow-[0_0_15px_3px_rgba(59,130,246,0.2)]"
                  )}
                >
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground shadow-[0_0_10px_3px_rgba(59,130,246,0.8)] transition-all duration-300",
                    activeTab === edu.id ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  )}></div>
                  <div className="pl-2 relative z-10">
                    <h3 className="font-semibold text-sm leading-tight text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{edu.institution}</p>
                    {edu.cgpa && (
                      <p className="text-xs text-foreground mt-1">CGPA: {edu.cgpa}</p>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Tabbed content */}
          <div className="lg:col-span-8 lg:pl-6">
            {/* Mobile tabs */}
            <div className="lg:hidden mb-6 overflow-x-auto flex gap-2 pb-2">
              {education.map((edu) => (
                <button
                  key={edu.id}
                  onClick={() => setActiveTab(edu.id)}
                  className={cn(
                    "px-4 py-2 whitespace-nowrap text-sm rounded-full transition-colors",
                    activeTab === edu.id
                      ? "bg-foreground text-background"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {edu.degree.split(' ')[0]} {/* Show abbreviated version */}
                </button>
              ))}
            </div>

            {/* Content */}
            {education.map((edu) => (
              <div
                key={edu.id}
                className={cn(
                  "transition-all duration-300",
                  activeTab === edu.id ? "animate-fade-in" : "hidden"
                )}
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{edu.degree}</h3>
                      <p className="text-lg text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.period}</p>
                      {edu.cgpa && (
                        <p className="text-sm text-foreground font-medium mt-1">CGPA: {edu.cgpa}</p>
                      )}
                    </div>
                    {edu.logo && (
                      <div className="w-36 h-auto">
                        <img
                          src={edu.logo}
                          alt={`${edu.institution} Logo`}
                          className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Description</h4>
                    <ul className="space-y-2">
                      {edu.description.map((item, index) => (
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
                        <h4 className="text-sm font-medium mb-3 text-foreground/80">Key Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.achievements.map((achievement, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border/30 
                                       bg-card backdrop-blur-sm hover:bg-accent 
                                       transition-all duration-300 hover:shadow-sm text-foreground"
                            >
                              {achievement}
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