'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipContent } from '@/components/charts/charts-base';
import { Bot, Brain, Cpu, Terminal, Palette, Layout, Target, Zap } from 'lucide-react';

const CATEGORIES = {
  ALL: 'All',
  ROBOTICS: 'Robotics',
  AI: 'AI & ML',
  EMBEDDED: 'Embedded',
  TOOLS: 'Tools',
};

const CATEGORY_COLORS = {
  [CATEGORIES.ROBOTICS]: '#3b82f6', // Blue
  [CATEGORIES.AI]: '#a855f7',       // Purple
  [CATEGORIES.EMBEDDED]: '#14b8a6', // Teal
  [CATEGORIES.TOOLS]: '#f59e0b',    // Amber
};

const CATEGORY_ICONS = {
  [CATEGORIES.ALL]: Layout,
  [CATEGORIES.ROBOTICS]: Bot,
  [CATEGORIES.AI]: Brain,
  [CATEGORIES.EMBEDDED]: Cpu,
  [CATEGORIES.TOOLS]: Terminal,
};

const SKILLS_DATA = {
  [CATEGORIES.ALL]: [
    { item: "Robotics", value: 92, category: CATEGORIES.ROBOTICS },
    { item: "AI & ML", value: 85, category: CATEGORIES.AI },
    { item: "Embedded", value: 72, category: CATEGORIES.EMBEDDED },
    { item: "Tools", value: 88, category: CATEGORIES.TOOLS },
    { item: "Theory", value: 65, category: CATEGORIES.ALL },
    { item: "Design", value: 80, category: CATEGORIES.ALL },
  ],
  [CATEGORIES.ROBOTICS]: [
    { item: "ROS/ROS2", value: 95 },
    { item: "SLAM", value: 78 },
    { item: "Gazebo/Isaac Sim", value: 85 },
    { item: "OpenCV", value: 90 },
    { item: "Sensor Fusion", value: 72 },
    { item: "Path Planning", value: 88 },
  ],
  [CATEGORIES.AI]: [
    { item: "Deep Learning", value: 82 },
    { item: "Computer Vision", value: 92 },
    { item: "YOLO/Detection", value: 88 },
    { item: "PyTorch", value: 75 },
    { item: "Reinforce. Learning", value: 60 },
    { item: "TensorFlow", value: 70 },
  ],
  [CATEGORIES.EMBEDDED]: [
    { item: "STM32/Arduino", value: 88 },
    { item: "Raspberry Pi", value: 92 },
    { item: "IoT Protocols", value: 65 },
    { item: "Hardware Integ.", value: 85 },
    { item: "RTOS", value: 55 },
    { item: "Embedded C/C++", value: 90 },
  ],
  [CATEGORIES.TOOLS]: [
    { item: "Git/GitHub", value: 95 },
    { item: "AWS/Cloud", value: 68 },
    { item: "Docker", value: 82 },
    { item: "Fusion 360", value: 88 },
    { item: "Linux/Bash", value: 92 },
    { item: "SolidWorks", value: 75 },
  ],
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);

  const currentColor = activeCategory === CATEGORIES.ALL
    ? '#a855f7'
    : (CATEGORY_COLORS as any)[activeCategory];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A comprehensive overview of my technical expertise across robotics, AI, and embedded systems.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 md:mb-16">
          {Object.values(CATEGORIES).map((category) => {
            const Icon = (CATEGORY_ICONS as any)[category] || Target;
            const isActive = activeCategory === category;
            const catColor = category === CATEGORIES.ALL ? '#a855f7' : (CATEGORY_COLORS as any)[category];

            return (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 relative group overflow-hidden ${isActive
                    ? 'border-transparent text-white shadow-xl bg-opacity-100'
                    : 'border-border bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                  }`}
                style={{
                  backgroundColor: isActive ? catColor : undefined,
                  boxShadow: isActive ? `0 10px 20px -10px ${catColor}66` : undefined
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} className={isActive ? "animate-pulse" : "group-hover:rotate-12 transition-transform"} />
                <span className="font-semibold text-sm tracking-wide">{category}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-white/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Radar Section */}
        <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={(SKILLS_DATA as any)[activeCategory]}
                >
                  <PolarGrid stroke="var(--foreground)" strokeOpacity={0.3} strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="item"
                    tick={(props: any) => {
                      const { x, y, payload, textAnchor } = props;
                      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor={textAnchor}
                          fill="var(--foreground)"
                          fontSize={isMobile ? 10 : 13}
                          fontWeight={600}
                          className="opacity-80 transition-all duration-500"
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<ChartTooltipContent />}
                    cursor={{ strokeDasharray: '3 3' }}
                  />

                  <Radar
                    name={activeCategory}
                    dataKey="value"
                    stroke={currentColor}
                    fill={currentColor}
                    fillOpacity={0.4}
                    strokeWidth={2.5}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>

          {/* Center Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-border shadow-inner z-20" />
        </div>

        {/* Legend / Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-card/30 border border-border backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }} />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{activeCategory} Core Competenices</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-1 text-sm font-bold text-foreground">
              <Zap size={14} className="text-yellow-500" />
              <span>Advanced Proficiency</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}