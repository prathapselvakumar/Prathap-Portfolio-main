"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { cn } from "@/lib/utils";

const FRAME_COUNT = 240;
const preloadedImages: HTMLImageElement[] = [];

export default function LeoRoverExploded() {
    const { language } = useLanguage();
    const t = translations[language].leoRover;
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    useEffect(() => {
        let loaded = 0;
        
        const loadChunk = (start: number, end: number) => {
            for (let i = start; i <= Math.min(end, FRAME_COUNT); i++) {
                const img = new Image();
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `/Autonomous-Mobile-Robot/Leo-rover/ezgif-frame-${frameNumber}.jpg`;
                img.onload = () => {
                    loaded++;
                    setImagesLoaded(loaded);
                    if (i === start) {
                        drawToCanvas(start);
                    }
                };
                preloadedImages[i] = img;
            }
        };

        // Immediate load of first 10 frames
        loadChunk(1, 10);

        // Defer remaining frames
        let idleId: any;
        if (typeof requestIdleCallback !== 'undefined') {
            idleId = requestIdleCallback(() => loadChunk(11, FRAME_COUNT));
        } else {
            idleId = setTimeout(() => loadChunk(11, FRAME_COUNT), 2000);
        }

        return () => {
            if (typeof cancelIdleCallback !== 'undefined' && idleId) {
                cancelIdleCallback(idleId);
            } else if (idleId) {
                clearTimeout(idleId);
            }
        };
    }, []);

    const drawToCanvas = (index: number) => {
        if (!canvasRef.current) return;
        // Handle cases where array is sparsely populated during fast loads
        const img = preloadedImages[index] || preloadedImages.find(i => i);
        if (!img) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Adjust canvas physical size for Retina/4K displays
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        }

        // Reset transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scale context to match device pixel ratio
        ctx.scale(dpr, dpr);

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Calculate scaling to contain the image proportionately
        let scale = Math.min(width / img.width, height / img.height);

        // Zoom the image sequence on mobile/tablet to make the robot details highly visible
        if (width < 768) {
            scale = scale * 1.6;
        }

        const x = (width / 2) - (img.width / 2) * scale;
        let y = (height / 2) - (img.height / 2) * scale;

        if (width < 768) {
            // Position the image towards the top of the section on mobile view to clear the bottom text
            y = 110;
        }

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        drawToCanvas(Math.round(latest));
    });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            drawToCanvas(Math.round(frameIndex.get()));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Text Animations based on scroll progress
    const textOpacity1 = useTransform(scrollYProgress, [0.0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
    const textOpacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.35, 0.4], [0, 1, 1, 0]);
    const textOpacity3 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
    const textOpacity4 = useTransform(scrollYProgress, [0.6, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
    const textOpacity5 = useTransform(scrollYProgress, [0.8, 0.85, 0.95, 1.0], [0, 1, 1, 0]);

    const opacities = [textOpacity1, textOpacity2, textOpacity3, textOpacity4, textOpacity5];

    return (
        <div ref={containerRef} className="relative h-[300vh] md:h-[600vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Loading overlay if not all images loaded */}
                {imagesLoaded < FRAME_COUNT && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 text-white flex-col">
                        <div className="text-2xl font-light mb-4 tracking-widest text-[#cfcfcf]">{t.loading}</div>
                        <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-300" style={{ width: `${(imagesLoaded / FRAME_COUNT) * 100}%` }} />
                        </div>
                        <div className="mt-2 text-sm text-neutral-400">{Math.round((imagesLoaded / FRAME_COUNT) * 100)}%</div>
                    </div>
                )}

                {/* Canvas for image sequence */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

                {/* Text Overlays overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {t.steps.map((step, index) => (
                        <motion.div
                            key={index}
                            style={{ opacity: opacities[index] }}
                            className={cn(
                                "absolute bottom-[12%] lg:bottom-auto lg:top-auto max-w-sm px-4",
                                index % 2 === 0
                                    ? "lg:top-[20%] left-[5%] lg:left-[10%]"
                                    : "lg:top-[30%] left-[5%] lg:left-auto lg:right-[10%] text-left lg:text-right ipad-pro-leo-right"
                            )}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">{step.title}</h2>
                            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                                <p className="text-neutral-200 text-base md:text-lg leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
