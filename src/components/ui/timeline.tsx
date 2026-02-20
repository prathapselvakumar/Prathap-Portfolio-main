"use client";
import {
    useScroll,
    useTransform,
    motion,
    useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}

interface TimelineProps {
    data: TimelineEntry[];
    title?: string;
    description?: string;
}

export const Timeline = ({ data, title, description }: TimelineProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001
    });

    const heightTransform = useTransform(smoothProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(smoothProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="w-full bg-background font-sans md:px-10"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto py-20 flex flex-col items-center text-center px-4 md:px-8 lg:px-10">
                <h2 className="text-5xl md:text-6xl lg:text-7xl mb-8 text-foreground font-bold tracking-tight max-w-4xl">
                    {title || "Changelog from my journey"}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    {description || "I've been working on Aceternity for the past 2 years. Here's a timeline of my journey."}
                </p>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-start pt-10 md:pt-40 md:gap-10"
                    >
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                            <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                            </div>
                            <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground/50 ">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-4 md:pl-4 w-full">
                            <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground/50">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-primary via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
