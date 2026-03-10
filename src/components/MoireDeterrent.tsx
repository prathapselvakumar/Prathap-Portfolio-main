'use client';

import React, { useEffect, useState } from 'react';

export function MoireDeterrent({
    className = "absolute inset-0",
    variant = "standard"
}: {
    className?: string;
    variant?: "standard" | "ultra";
}) {
    const [seed, setSeed] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeed(Math.random() * 1000);
        }, variant === "ultra" ? 10 : 20);
        return () => clearInterval(interval);
    }, [variant]);

    const isUltra = variant === "ultra";

    return (
        <div className={`${className} pointer-events-none z-[99] select-none overflow-hidden`}>
            <svg className={`absolute inset-0 w-full h-full ${isUltra ? 'opacity-[0.18] dark:opacity-[0.25]' : 'opacity-[0.1] dark:opacity-[0.15]'} mix-blend-overlay`}>
                <filter id="moireNoise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={isUltra ? "0.95" : "0.75"}
                        numOctaves={isUltra ? "7" : "4"}
                        seed={seed}
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={isUltra ? "5" : "2"}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#moireNoise)" />
            </svg>

            <div
                className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, #000 0.5px, transparent 0.5px),
                        linear-gradient(to right, #000 0.2px, transparent 0.2px),
                        linear-gradient(to bottom, #000 0.2px, transparent 0.2px)
                    `,
                    backgroundSize: isUltra ? '1.2px 1.2px, 0.6px 0.6px, 0.6px 0.6px' : '1.8px 1.8px, 0.9px 0.9px, 0.9px 0.9px',
                    mixBlendMode: 'overlay'
                }}
            />
        </div>
    );
}
