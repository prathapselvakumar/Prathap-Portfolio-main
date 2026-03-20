"use client";

import React from "react";
import { projects } from "@/lib/projects";
import { ChevronLeft, Play, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import VideoPlayerPro from "@/components/ui/video-player-pro";

export default function ROS2DemoPage() {
    const project = projects.find((p) => p.id === "ros2-coursework1");

    if (!project) {
        return <div className="p-20 text-center text-white bg-black h-screen">Project not found</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary/30">
            {/* Header / Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link 
                        href="/projects/coursework1" 
                        className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-primary transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Project
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Live Demo / Video</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    {/* Title Section */}
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            {project.title} <span className="text-primary italic">Demo</span>
                        </h1>
                        <p className="text-lg text-neutral-400 leading-relaxed">
                            A dedicated walkthrough demonstrating the ROS 2 autonomous drone flight control system, PID stabilization, and waypoint navigation logic.
                        </p>
                    </div>

                    {/* Video Player Container */}
                    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
                        <VideoPlayerPro src={project.terminalVideo!} />
                        
                        {/* Overlay elements for premium feel */}
                        <div className="absolute top-4 left-4 pointer-events-none z-10">
                            <div className="bg-black/50 backdrop-blur-md border border-neutral-700/50 rounded-lg px-3 py-1.5 flex items-center gap-2">
                                <Play className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-tighter text-white">Recording / 1080p</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Highlights Section */}
                    <div className="grid md:grid-cols-3 gap-8 pt-6">
                        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">System Stability</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Observation of the PID controller responding to simulated external forces and maintaining position within a 5cm tolerance.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Play className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">Waypoint Logic</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Sequential execution of flight paths as defined in the ROS 2 node parameters, showing smooth transitions between targets.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
                           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <ChevronLeft className="w-5 h-5 text-primary rotate-180" />
                            </div>
                            <h3 className="font-bold text-lg">Telemetry Sync</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Real-time synchronization of flight data across nodes, visualized in the terminal output (as seen in the codebase).
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer space */}
            <footer className="py-12 border-t border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-neutral-500 text-sm">© 2024 Prathap Selvakumar • Robotics Portfolio</p>
                    <Link 
                        href="/projects" 
                        className="text-sm font-medium text-neutral-400 hover:text-primary transition-colors"
                    >
                        View More Projects
                    </Link>
                </div>
            </footer>
        </div>
    );
}
