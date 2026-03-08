"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 240;
const preloadedImages: HTMLImageElement[] = [];

export default function LeoRoverExploded() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    useEffect(() => {
        // Preload images once on mount
        let loaded = 0;
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, '0');
            img.src = `/Leo-rover/ezgif-frame-${frameNumber}.jpg`;
            img.onload = () => {
                loaded++;
                setImagesLoaded(loaded);
                // Initial draw if frame 1 is loaded
                if (i === 1) {
                    drawToCanvas(1);
                }
            };
            preloadedImages[i] = img;
        }
    }, []);

    const drawToCanvas = (index: number) => {
        if (!canvasRef.current) return;
        // Handle cases where array is sparsely populated during fast loads
        const img = preloadedImages[index] || preloadedImages.find(i => i);
        if (!img) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
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
        const scale = Math.min(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;

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
    // Let's divide 0-1 into sections based on what parts of the rover are visible
    const textOpacity1 = useTransform(scrollYProgress, [0.0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
    const textOpacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.35, 0.4], [0, 1, 1, 0]);
    const textOpacity3 = useTransform(scrollYProgress, [0.4, 0.45, 0.55, 0.6], [0, 1, 1, 0]);
    const textOpacity4 = useTransform(scrollYProgress, [0.6, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
    const textOpacity5 = useTransform(scrollYProgress, [0.8, 0.85, 0.95, 1.0], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[600vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Loading overlay if not all images loaded */}
                {imagesLoaded < FRAME_COUNT && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 text-white flex-col">
                        <div className="text-2xl font-light mb-4 tracking-widest text-[#cfcfcf]">LOADING ASSETS</div>
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
                    {/* Step 1 */}
                    <motion.div style={{ opacity: textOpacity1 }} className="absolute bottom-[10%] lg:bottom-auto lg:top-[20%] left-[5%] lg:left-[10%] max-w-sm px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">SLAM</h2>
                        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                            <p className="text-neutral-200 text-base md:text-lg leading-relaxed">Simultaneous Localization and Mapping utilizing 2D/3D LiDAR fusion to construct high-fidelity spatial maps of unknown environments in real-time.</p>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div style={{ opacity: textOpacity2 }} className="absolute bottom-[10%] lg:bottom-auto lg:top-[30%] left-[5%] lg:left-auto lg:right-[10%] max-w-sm px-4 text-left lg:text-right">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">Autonomous Navigation</h2>
                        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                            <p className="text-neutral-200 text-base md:text-lg leading-relaxed">Dynamic path planning and robust obstacle avoidance algorithms ensuring seamless point-to-point traversal across complex terrain.</p>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div style={{ opacity: textOpacity3 }} className="absolute bottom-[10%] lg:bottom-[20%] left-[5%] lg:left-[10%] max-w-sm px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">Computer Vision</h2>
                        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                            <p className="text-neutral-200 text-base md:text-lg leading-relaxed">Edge-deployed YOLOv8 inference enabling rapid object detection, semantic segmentation, and advanced environmental perception.</p>
                        </div>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div style={{ opacity: textOpacity4 }} className="absolute bottom-[10%] lg:bottom-auto lg:top-[20%] left-[5%] lg:left-auto lg:right-[10%] max-w-sm px-4 text-left lg:text-right">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">ROS2 Architecture</h2>
                        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                            <p className="text-neutral-200 text-base md:text-lg leading-relaxed">A decentralized, highly modular communication framework managing sensor data streams and autonomous state machines continuously.</p>
                        </div>
                    </motion.div>

                    {/* Step 5 */}
                    <motion.div style={{ opacity: textOpacity5 }} className="absolute bottom-[10%] lg:bottom-[25%] left-[5%] lg:left-[15%] max-w-sm px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-black/60 backdrop-blur-md p-2 rounded-lg inline-block border border-white/10 shadow-xl">Path Logging</h2>
                        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/10">
                            <p className="text-neutral-200 text-base md:text-lg leading-relaxed">Comprehensive telemetry recording system tracking odometry, executed paths, and obstacle metadata for post-mission kinematic analysis.</p>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
