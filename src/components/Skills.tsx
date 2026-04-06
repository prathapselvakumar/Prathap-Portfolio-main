'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Cpu, Terminal, Map, Route, Box, Layers, Activity, Eye, Target, Timer, Radio, Hammer, Wrench } from 'lucide-react';
import { SiRos, SiOpencv, SiTensorflow, SiPytorch, SiCplusplus, SiPython, SiArduino, SiRaspberrypi, SiLinux } from 'react-icons/si';
import { FaDocker, FaAws, FaGithub } from 'react-icons/fa';

const skillsData = [
  {
    category: "Robotics & Perception",
    icon: Bot,
    description: "Building autonomous systems",
    items: [
      { name: "ROS/ROS2", logo: SiRos },
      { name: "SLAM", logo: Map },
      { name: "OpenCV", logo: SiOpencv },
      { name: "Path Planning", logo: Route },
      { name: "Gazebo/Isaac Sim", logo: Box },
      { name: "Sensor Fusion", logo: Layers },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: Brain,
    description: "Intelligent decision making",
    items: [
      { name: "Deep Learning", logo: Activity },
      { name: "PyTorch", logo: SiPytorch },
      { name: "TensorFlow", logo: SiTensorflow },
      { name: "Computer Vision", logo: Eye },
      { name: "Reinforcement Learning", logo: Brain },
      { name: "YOLO/Object Detection", logo: Target },
    ],
  },
  {
    category: "Embedded Systems",
    icon: Cpu,
    description: "Hardware-software integration",
    items: [
      { name: "C/C++", logo: SiCplusplus },
      { name: "Python", logo: SiPython },
      { name: "STM32/Arduino", logo: SiArduino },
      { name: "Raspberry Pi", logo: SiRaspberrypi },
      { name: "RTOS", logo: Timer },
      { name: "IoT Protocols", logo: Radio },
    ],
  },
  {
    category: "Tools & Platforms",
    icon: Terminal,
    description: "Development ecosystem",
    items: [
      { name: "Linux/Bash", logo: SiLinux },
      { name: "Git/GitHub", logo: FaGithub },
      { name: "Docker", logo: FaDocker },
      { name: "Fusion 360", logo: Hammer },
      { name: "SolidWorks", logo: Wrench },
      { name: "AWS/Cloud", logo: FaAws },
    ],
  },
];

export function Skills() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-8 md:px-16 bg-background relative overflow-hidden">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
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
                    className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium rounded-md bg-background border border-border text-foreground/80 hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200 cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + skillIndex * 0.05
                    }}
                    viewport={{ once: true }}
                  >
                    {skill.logo && <skill.logo className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />}
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