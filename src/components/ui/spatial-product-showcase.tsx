'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Sliders,
  Zap,
  Radar,
  LucideIcon,
} from 'lucide-react';
import { cn } from "@/lib/utils";

export type ProductId = 'sensor' | 'camera' | 'NUC' | 'ARM' | 'gripper';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string; // Display name for the switcher
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string; // Tailwind gradient classes
    glow: string;     // Tailwind color class for accents
    ring: string;     // Tailwind border color for rings
    radial: string;   // Radial gradient color for background
  };
  stats: {
    connectionStatus: string;
    batteryLevel: number;
  };
  features: FeatureMetric[];
}

// Default Data (Easy to Modify Here)
const PRODUCT_DATA: Record<ProductId, ProductData> = {
  sensor: {
    id: 'sensor',
    label: 'Sensor',
    title: 'RPLidar Sensor',
    description: 'A high-performance 360-degree laser range scanner. Provides the robot with precise spatial awareness and real-time mapping capabilities.',
    image: '/Products/Lidars.png',
    colors: {
      gradient: 'from-blue-600 to-indigo-900',
      glow: 'bg-blue-500',
      ring: 'border-blue-500/50',
      radial: 'rgba(59, 130, 246, 0.15)',
    },
    stats: { connectionStatus: 'Active', batteryLevel: 100 },
    features: [
      { label: 'Precision', value: 92, icon: Zap },
      { label: 'Range', value: 85, icon: Radar },
    ],
  },
  camera: {
    id: 'camera',
    label: 'Camera',
    title: 'Intel RealSense Depth Camera',
    description: 'High-speed stereo depth sensing for reliable obstacle avoidance and spatial mapping in dynamic environments.',
    image: '/Products/Camera.png',
    colors: {
      gradient: 'from-emerald-600 to-teal-900',
      glow: 'bg-emerald-500',
      ring: 'border-emerald-500/50',
      radial: 'rgba(16, 185, 129, 0.15)',
    },
    stats: { connectionStatus: 'Processing', batteryLevel: 100 },
    features: [
      { label: 'Compute', value: 98, icon: Sliders },
      { label: 'Efficiency', value: 88, icon: Zap },
    ],
  },
  NUC: {
    id: 'NUC',
    label: 'NUC',
    title: 'Intel NUC',
    description: 'Core compute unit for robot control, SLAM, and high-level mission planning logic.',
    image: '/Products/Intel NUC.png',
    colors: {
      gradient: 'from-orange-600 to-red-900',
      glow: 'bg-orange-500',
      ring: 'border-orange-500/50',
      radial: 'rgba(249, 115, 22, 0.15)',
    },
    stats: { connectionStatus: 'Operational', batteryLevel: 100 },
    features: [
      { label: 'Torque', value: 94, icon: Sliders },
      { label: 'Response', value: 96, icon: Zap },
    ],
  },
  ARM: {
    id: 'ARM',
    label: 'ARM',
    title: 'Elephant Robotics ARM',
    description: 'Precision 6-DOF robotic arm for advanced manipulation, sorting, and interaction with the environment.',
    image: '/Products/Robotic ARM.png',
    colors: {
      gradient: 'from-purple-600 to-fuchsia-900',
      glow: 'bg-purple-500',
      ring: 'border-purple-500/50',
      radial: 'rgba(168, 85, 247, 0.15)',
    },
    stats: { connectionStatus: 'Operational', batteryLevel: 100 },
    features: [
      { label: 'Precision', value: 94, icon: Zap },
      { label: 'Dexterity', value: 92, icon: Sliders },
    ],
  },
  gripper: {
    id: 'gripper',
    label: 'Gripper',
    title: 'Adaptive Robotic Gripper',
    description: 'A versatile end-effector designed for robust grasping of various objects, integrated with force sensors for delicate handling.',
    image: '/Products/Gripper.png',
    colors: {
      gradient: 'from-pink-600 to-rose-900',
      glow: 'bg-pink-500',
      ring: 'border-pink-500/50',
      radial: 'rgba(236, 72, 153, 0.15)',
    },
    stats: { connectionStatus: 'Operational', batteryLevel: 100 },
    features: [
      { label: 'Grip Force', value: 88, icon: Zap },
      { label: 'Sensitivity', value: 90, icon: Sliders },
    ],
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } as any,
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 } as any,
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  },
  image: (isLeft: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(15px)',
      rotate: isLeft ? -30 : 30,
      x: isLeft ? -80 : 80,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotate: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 } as any,
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: 'blur(20px)',
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================


const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Animated Rings */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`absolute inset-[-20%] rounded-full border border-dashed border-white/10 ${data.colors.ring}`}
    />
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-2xl opacity-40`}
    />

    {/* Image Container */}
    <div className="relative h-72 w-72 md:h-[500px] md:w-[500px] flex items-center justify-center rounded-full overflow-hidden border border-black/5 dark:border-white/10 shadow-inner">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center font-mono"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={ANIMATIONS.image(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

    {/* Status Label */}
    <motion.div
      layout="position"
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-950/80 px-4 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full ${data.colors.glow} animate-pulse`} />
        {data.stats.connectionStatus}
      </div>
    </motion.div>
  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
  const flexDirClass = isLeft ? 'flex-row' : 'flex-row-reverse';
  const barColorClass = data.colors.glow;

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.h2 variants={ANIMATIONS.item} className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
        Hardware Module
      </motion.h2>
      <motion.h1 variants={ANIMATIONS.item} className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:to-zinc-500">
        {data.title}
      </motion.h1>
      <motion.p variants={ANIMATIONS.item} className={`text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm leading-relaxed ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
        {data.description}
      </motion.p>

      {/* Feature Grid */}
      <motion.div variants={ANIMATIONS.item} className="w-full space-y-8">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}>
              <div className={`flex items-center gap-2 ${feature.value > 50 ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                <feature.icon size={16} /> <span>{feature.label}</span>
              </div>
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{feature.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-zinc-300/50 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barColorClass} opacity-80`}
              />
            </div>
          </div>
        ))}

       
      </motion.div>

      {/* Battery */}
      
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle 
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void 
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <div className="relative mt-16 flex justify-center z-50 pointer-events-none group/switcher">
      <motion.div 
        layout 
        className="relative pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 dark:bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.1),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Gloss Layer */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/10 to-transparent pointer-none" />
        
        {/* Adaptive distortion background */}
        <div
          className="absolute inset-0 -z-10 rounded-full"
          style={{ backdropFilter: 'url("#apple-liquid-glass")' }}
        />
        
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id as ProductId)}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "relative px-6 h-12 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none transition-all duration-300 z-10 whitespace-nowrap",
              activeId === opt.id ? "text-primary" : "text-zinc-500 hover:text-primary hover:scale-105"
            )}
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}
            <span>{opt.label}</span>
            {activeId === opt.id && (
              <motion.div
                layoutId="active-tube"
                className="absolute -bottom-1 h-0.5 w-8 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
      <GlassFilter />
    </div>
  );
};

const GlassFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="apple-liquid-glass" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
        
        {/* Specular highlights for edge depth */}
        <feSpecularLighting in="blurred" surfaceScale="5" specularConstant="1.2" specularExponent="40" lightingColor="white" result="specular">
          <feDistantLight azimuth="45" elevation="60" />
        </feSpecularLighting>
        <feComposite in="specular" in2="blurred" operator="in" result="glossy" />
        <feMerge>
          <feMergeNode in="glossy" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function HardwareShowcase() {
  const [activeId, setActiveId] = useState<ProductId>('sensor');
  
  const currentData = PRODUCT_DATA[activeId];
  // Alternating layout: Left, Right, Left, Right
  const isLeft = activeId === 'sensor' || activeId === 'NUC' || activeId === 'gripper';

  return (
    <div className="relative w-full text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center py-24 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Preload Images Hidden Layer */}
      <div className="hidden pointer-events-none appearance-none" aria-hidden="true">
        {Object.values(PRODUCT_DATA).map((product) => (
          <img key={product.id} src={product.image} alt="preload" />
        ))}
      </div>

      <main className="relative z-10 w-full px-6 flex flex-col justify-center max-w-7xl mx-auto">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 } as any}
          className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 lg:gap-48 w-full ${
            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Left Column: Visuals */}
          <ProductVisual data={currentData} isLeft={isLeft} />

          {/* Right Column: Content */}
          <motion.div layout="position" className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <ProductDetails 
                key={activeId} 
                data={currentData} 
                isLeft={isLeft} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      <Switcher activeId={activeId} onToggle={setActiveId} />
    </div>
  );
}
