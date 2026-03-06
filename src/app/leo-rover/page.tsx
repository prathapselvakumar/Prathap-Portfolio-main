import LeoRoverExploded from "@/components/LeoRoverExploded";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "LEO Rover Exploded View | Prathap Selvakumar",
    description: "Explore the internal engineering of the LEO Rover with an interactive 3D exploded view on scroll.",
};

export default function LeoRoverPage() {
    return (
        <main className="bg-black text-white">

            {/* Navigation aid */}
            <div className="fixed top-6 left-6 z-50">
                <Link href="/" className="inline-flex items-center justify-center p-3 rounded-full bg-neutral-900/80 backdrop-blur-sm shadow-sm md:shadow-md hover:bg-neutral-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="sr-only">Back to Home</span>
                </Link>
            </div>

            {/* Hero section to introduce the page */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center px-4 relative bg-black">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-sm">
                    LEO Rover
                </h1>
                <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light">
                    Scroll down to explore the mechanical structure and electronic architecture step by step. A fully immersive technical breakdown.
                </p>
                <div className="absolute bottom-10 animate-bounce text-neutral-500 dark:text-neutral-400">
                    <p className="text-sm tracking-widest uppercase mb-2 font-medium">Scroll To Explore</p>
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </div>

            <LeoRoverExploded />

            {/* Footer / Outro */}
            <div className="h-[70vh] w-full flex flex-col items-center justify-center bg-black text-white p-8">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Engineering Excellence</h2>
                    <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                    <p className="text-lg md:text-2xl text-neutral-400 font-light leading-relaxed">
                        The LEO Rover exemplifies the synergy between mechanical rigidity and electronic intelligence.
                        Every component serves a specific purpose, contributing to the ultimate goal of autonomous exploration.
                    </p>
                    <div className="pt-8">
                        <Link href="/" className="px-8 py-4 bg-white text-neutral-950 rounded-full font-semibold hover:bg-neutral-200 transition-colors shadow-xl">
                            Return to Project Overview
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
