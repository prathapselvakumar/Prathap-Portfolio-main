'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skillsData = [
  {
    category: "Programming Languages",
    items: [
      { name: "Python" },
      { name: "JavaScript" },
      { name: "HTML/CSS" },
      { name: "C++" },
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: [
      { name: "React.js" },
      { name: "Node.js" },
      { name: "NumPy" },
      { name: "PyTorch" },
    ],
  },
  {
    category: "Areas of Expertise",
    items: [
      { name: "Deep Learning" },
      { name: "AI/ML Models" },
      { name: "Web Development" },
      { name: "Data Analysis" },
    ],
  },
  {
    category: "Tools & Technologies",
    items: [
      { name: "Git" },
      { name: "AWS" },
      { name: "Docker" },
      { name: "Database Systems" },
    ],
  },
];

export function Skills() {
  return (
    <section className="min-h-screen py-20 px-8 md:px-16 bg-background flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-foreground text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillsData.map((skillCategory, categoryIndex) => (
            <motion.div
              key={skillCategory.category}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Category Title */}
              <h3 
                className="text-2xl font-bold text-foreground mb-6 transition-all duration-300"
                style={{
                  textShadow: '0 0 0px rgba(59, 130, 246, 0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(59, 130, 246, 0.7), 0 0 20px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = '0 0 0px rgba(59, 130, 246, 0)';
                }}
              >
                {skillCategory.category}
              </h3>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-3">
                {skillCategory.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="px-4 py-6 rounded-lg bg-accent/50 border border-border hover:border-border/80 hover:bg-accent transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: categoryIndex * 0.1 + skillIndex * 0.05 
                    }}
                    viewport={{ once: true }}
                  >
                    <p className="text-foreground font-medium text-center">
                      {skill.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}