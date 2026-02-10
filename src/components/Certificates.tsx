'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string[];
  skills: string[];
  verificationUrl?: string;
}

const certificates: Certificate[] = [
  {
    id: "python-flask",
    title: "Python And Flask Framework Complete Course For Beginners",
    issuer: "UDEMY",
    date: "2023",
    category: "Web Development",
    description: [
      "Comprehensive introduction to Python programming language",
      "Building web applications using Flask framework",
      "Hands-on projects for practical experience"
    ],
    skills: ["Python", "Flask", "Web Development", "Backend"],
  },
  {
    id: "excel-basics",
    title: "Introduction to Microsoft Excel",
    issuer: "Coursera",
    date: "2023",
    category: "Productivity",
    description: [
      "Fundamentals of Microsoft Excel",
      "Data organization and analysis",
      "Basic formulas and functions"
    ],
    skills: ["Microsoft Excel", "Data Analysis", "Spreadsheets", "Productivity Tools"],
  },
  {
    id: "javascript-ibm",
    title: "JavaScript Programming",
    issuer: "IBM",
    date: "2023",
    category: "Programming",
    description: [
      "Core JavaScript programming concepts",
      "Client-side web development",
      "Interactive web applications"
    ],
    skills: ["JavaScript", "Web Development", "Frontend"],
  },
  {
    id: "prompt-engineering",
    title: "Introduction to Prompt Engineering for Generative AI",
    issuer: "LinkedIn Learning",
    date: "2023",
    category: "AI/ML",
    description: [
      "Fundamentals of prompt engineering",
      "Techniques for effective AI interactions",
      "Best practices for generative AI applications"
    ],
    skills: ["AI", "Prompt Engineering", "Generative AI", "Machine Learning"],
  },
  {
    id: "numpy-pandas",
    title: "NumPy & Pandas in Python",
    issuer: "UDEMY",
    date: "2022",
    category: "Data Science",
    description: [
      "Data manipulation with NumPy and Pandas",
      "Data analysis techniques",
      "Practical applications and projects"
    ],
    skills: ["Python", "NumPy", "Pandas", "Data Analysis"],
  },
  {
    id: "js-axix-intellects",
    title: "JavaScript Programming",
    issuer: "SRM AXIS Intellects",
    date: "2022",
    category: "Programming",
    description: [
      "JavaScript fundamentals",
      "Web development concepts",
      "Practical programming exercises"
    ],
    skills: ["JavaScript", "Web Development", "Programming"],
  },
  {
    id: "c-programming-scratch-to-master",
    title: "C Programming from Scratch to Master",
    issuer: "UDEMY",
    date: "2024",
    category: "Programming",
    description: [
      "C language fundamentals: variables, data types, control flow",
      "Pointers, arrays, strings, and memory management",
      "Functions, structures, files, and modular programming"
    ],
    skills: ["C", "Pointers", "Memory Management", "Problem Solving"],
  },
  {
    id: "basics-of-python-c-square",
    title: "Basics of Python",
    issuer: "C-SQUARE Info Solutions",
    date: "2023",
    category: "Programming",
    description: [
      "Core Python syntax and control structures",
      "Functions, modules, and file handling",
      "Hands-on practice with basic scripts"
    ],
    skills: ["Python", "Scripting", "Problem Solving"],
  },
  {
    id: "power-bi-fundamentals",
    title: "Power BI Fundamentals",
    issuer: "Microsoft Power BI",
    date: "2023",
    category: "Data Science",
    description: [
      "Data import, modeling, and DAX basics",
      "Interactive dashboards and reports",
      "Publishing and sharing insights"
    ],
    skills: ["Power BI", "Data Modeling", "Dashboards"],
  },
  {
    id: "srm-axis-ml-big-data",
    title: "Machine Learning and Big Data",
    issuer: "SRM AXIS",
    date: "2022",
    category: "AI/ML",
    description: [
      "ML fundamentals and workflows",
      "Introduction to big data concepts",
      "Practical applications and use cases"
    ],
    skills: ["Machine Learning", "Big Data", "Data Processing"],
  },
  {
    id: "shah-1353-prathap-s",
    title: "SHAH - 1353 PRATHAP S",
    issuer: "SHAH",
    date: "2023",
    category: "Programming",
    description: [
      "Certification awarded to PRATHAP S",
      "Demonstrated competence as per SHAH program"
    ],
    skills: ["Problem Solving"],
  },
  {
    id: "qentelli-intern",
    title: "AI/ML Project Internship",
    issuer: "Qentelli Solutions",
    date: "2024",
    category: "AI/ML",
    description: [
      "Successfully completed AI/ML project internship",
      "Worked on predictive analytics and machine learning models",
      "Demonstrated enthusiasm, self-discipline and self-motivation"
    ],
    skills: ["AI/ML", "Predictive Analytics", "Machine Learning"],
  }
];

export function Certificates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(certificates.map(cert => cert.category)))];

  // Filter certificates based on selected category
  const filteredCertificates = selectedCategory === 'All'
    ? certificates
    : certificates.filter(cert => cert.category === selectedCategory);

  const handleViewCertificate = (cert: Certificate) => {
    if (cert.verificationUrl) {
      window.open(cert.verificationUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Create a custom notification instead of alert
      const notification = document.createElement('div');
      notification.textContent = `Certificate "${cert.title}" - Contact for verification details`;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-foreground);
        color: var(--color-background);
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.transition = 'opacity 0.3s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  return (
    <section id="certificates" className="min-h-screen py-12 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Certificates
        </motion.h2>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <LiquidButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              size="default"
              className={`pointer-events-auto cursor-pointer ${selectedCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
            >
              {category}
            </LiquidButton>
          ))}
        </motion.div>

        {/* Even Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-muted-foreground transition-all duration-500 hover:scale-[1.02] flex flex-col h-full min-h-[400px]"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                      {cert.category}
                    </div>
                    <Award className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                  </div>

                  <h3 className="font-bold text-foreground mb-2 line-clamp-2 text-lg">
                    {cert.title}
                  </h3>

                  <p className="text-muted-foreground text-sm font-medium mb-1">
                    {cert.issuer}
                  </p>
                  <p className="text-muted-foreground/70 text-xs mb-4">
                    {cert.date}
                  </p>

                  {/* Description */}
                  <ul className="space-y-1 mb-4">
                    {cert.description.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                        <span className="text-foreground mt-1">•</span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-muted/50 border border-border rounded text-xs text-muted-foreground group-hover:bg-muted group-hover:border-muted-foreground/50 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Certificate Button */}
                <div className="mt-4 relative z-20">
                  <LiquidButton
                    size="sm"
                    onClick={() => handleViewCertificate(cert)}
                    className="w-full bg-foreground text-background hover:text-background pointer-events-auto cursor-pointer"
                  >
                    View Certificate
                  </LiquidButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}