'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Cpu, Terminal, Layers, Globe } from 'lucide-react';

const skillsData = [
  {
    category: "Robotics & Perception",
    icon: Bot,
    description: "Building autonomous systems",
    items: [
      { name: "ROS/ROS2" },
      { name: "SLAM" },
      { name: "OpenCV" },
      { name: "Path Planning" },
      { name: "Gazebo/Isaac Sim" },
      { name: "Sensor Fusion" },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: Brain,
    description: "Intelligent decision making",
    items: [
      { name: "Deep Learning" },
      { name: "PyTorch" },
      { name: "TensorFlow" },
      { name: "Computer Vision" },
      { name: "Reinforcement Learning" },
      { name: "YOLO/Object Detection" },
    ],
  },
  {
    category: "Embedded Systems",
    icon: Cpu,
    description: "Hardware-software integration",
    items: [
      { name: "C/C++" },
      { name: "Python" },
      { name: "STM32/Arduino" },
      { name: "Raspberry Pi" },
      { name: "RTOS" },
      { name: "IoT Protocols" },
    ],
  },
  {
    category: "Tools & Platforms",
    icon: Terminal,
    description: "Development ecosystem",
    items: [
      { name: "Linux/Bash" },
      { name: "Git/GitHub" },
      { name: "Docker" },
      { name: "Fusion 360" },
      { name: "SolidWorks" },
      { name: "AWS/Cloud" },
    ],
  },
];

export function Skills() {
  return (
    <section className="py-20 px-8 md:px-16 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Technical Arsenal
          </h2>

        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {skillsData.map((skillCategory, categoryIndex) => (
            <motion.div
              key={skillCategory.category}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-accent/50 text-foreground group-hover:scale-110 transition-transform duration-300">
                  <skillCategory.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {skillCategory.category}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {skillCategory.description}
                  </p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill, skillIndex) => (
                  <motion.span
                    key={skill.name}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-background border border-border text-foreground/80 hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200 cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05
                    }}
                    viewport={{ once: true }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-foreground/5 to-transparent -translate-y-8 translate-x-8 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 rounded-bl-full pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}