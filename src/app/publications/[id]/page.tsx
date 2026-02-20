'use client';

import { useState } from "react";
import { BookOpen, ExternalLink, Quote, Award, User, Calendar, FileText, Lightbulb, Target, BarChart3, Music, Layers, Github, ArrowRight, Play, Code2 } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from "@/components/ui/button";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

/* ─── Section Header ─── */
const SectionHeader = ({ label, title, description }: { label: string; title: string; description?: string }) => (
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-3">{label}</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{description}</p>}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
    </div>
);

/* ─── Publication Data ─── */
const publication = {
    title: "Comparative Analysis Implementation of Queuing Songs in Players Using Audio Clustering Algorithm",
    journal: "IGI Global Publication",
    year: "2024",
    authors: ["Aarthi B", "Prathap Selvakumar", "Subiksha S", "Chhavi", "Swetha Parathasarathy"],
    doi: "#",
    abstract: `This research presents a comparative performance analysis of K-Means, DBSCAN, and Adaptive Clustering algorithms for grouping audio data in intelligent music player queuing systems. The study evaluates clustering robustness, parameter sensitivity, time complexity, growth rate, and asymptotic behavior. Results indicate that DBSCAN and Adaptive Clustering achieve higher recall and F-measure, while K-Means demonstrates high precision but lower recall. The findings highlight the importance of density-based and adaptive clustering approaches for dynamic multimedia applications.`,
    keywords: ["K-Means", "DBSCAN", "Adaptive Clustering", "Audio Signal Processing", "Precision", "Recall", "F-Measure", "Time Complexity", "Density-Based Clustering"],
    objectives: [
        "Compare centroid-based, density-based, and adaptive clustering methods",
        "Analyze algorithm performance using evaluation metrics",
        "Study time complexity and asymptotic behavior",
        "Identify the most suitable clustering method for intelligent music queuing systems"
    ],
    highlights: [
        "Comparative benchmarking of three clustering algorithms",
        "Time complexity analysis (O(n log n) vs O(n²))",
        "Evaluation using Precision, Recall, and F-Measure",
        "Practical application in intelligent music queuing systems",
        "Demonstrated superiority of density-based and adaptive methods"
    ],
    methodology: [
        { step: "Feature Representation", desc: "Audio signals were converted into numerical feature representations suitable for clustering algorithms." },
        { step: "K-Means Implementation", desc: "Centroid-based clustering minimizing within-cluster variance using Euclidean distance. Time Complexity: O(n²) (as discussed in growth analysis)." },
        { step: "DBSCAN Implementation", desc: "Density-based clustering using ε (epsilon): distance threshold and MinPts: minimum points for dense region. Time Complexity: O(n log n)." },
        { step: "Adaptive Clustering", desc: "Dynamic adjustment of cluster count during algorithm execution to determine optimal grouping. Time Complexity: O(n) to O(n²) depending on implementation." },
        { step: "Performance Evaluation", desc: "Algorithms evaluated using: Precision, Recall, F-Measure." },
    ],
    performance: [
        { algorithm: "K-Means", precision: "High", recall: "Low", fMeasure: "Low" },
        { algorithm: "DBSCAN", precision: "High", recall: "High", fMeasure: "High" },
        { algorithm: "Adaptive Clustering", precision: "High", recall: "High", fMeasure: "High" }
    ],
    strengths: [
        {
            algorithm: "K-Means",
            pros: ["Simple and efficient", "Works well when clusters are well-defined"],
            cons: ["Sensitive to centroid initialization", "Requires predefined number of clusters"]
        },
        {
            algorithm: "DBSCAN",
            pros: ["Identifies arbitrary-shaped clusters", "Does not require predefined cluster count", "Handles noise effectively"],
            cons: ["Sensitive to parameter selection"]
        },
        {
            algorithm: "Adaptive Clustering",
            pros: ["Automatically adjusts number of clusters", "High-quality cluster detection"],
            cons: ["Computationally expensive"]
        }
    ]
};

/* ─── Stats ─── */
const stats = [
    { label: "Publication", value: "IGI Global", icon: BookOpen },
    { label: "Research Area", value: "Audio ML", icon: Music },
    { label: "Year", value: "2024", icon: Calendar },
    { label: "Focus", value: "Clustering", icon: Layers },
];

/* ─── Page ─── */
const Index = () => {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* ═══ Navigation ═══ */}
            {/* Project Title (Top Left) */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm animate-fade-in">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight hidden sm:block">Audio Clustering</span>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50 animate-fade-in">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation Menu */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-2 py-0.5 animate-fade-in">
                {/* Liquid Glass Background */}
                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
                    shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
                    transition-all 
                    dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />

                <div
                    className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
                    style={{ backdropFilter: 'url("#navbar-glass")' }} />

                <NavigationMenu className="relative z-10">
                    <NavigationMenuList className="gap-1">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#publication" className="hidden sm:inline-block">
                                    <Button size="sm" variant="ghost" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <FileText className="w-3.5 h-3.5 mr-2" />Journal Publication
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#highlights" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Target className="w-3.5 h-3.5 mr-2" />Key Contributions
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#objectives" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Layers className="w-3.5 h-3.5 mr-2" />Research Objectives
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#methodology" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <BarChart3 className="w-3.5 h-3.5 mr-2" />Research Approach
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#future-work" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Lightbulb className="w-3.5 h-3.5 mr-2" />What's Next
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>


                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* SVG Filter for Glass Effect */}
            <svg className="hidden">
                <defs>
                    <filter
                        id="navbar-glass"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.05 0.05"
                            numOctaves="1"
                            seed="1"
                            result="turbulence" />
                        <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="blurredNoise"
                            scale="70"
                            xChannelSelector="R"
                            yChannelSelector="B"
                            result="displaced" />
                        <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                        <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                    </filter>
                </defs>
            </svg>

            {/* ═══ Hero ═══ */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/audio-clustering.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border border-primary/30 bg-primary/5 animate-fade-in">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-primary font-mono text-sm tracking-widest uppercase">Published Research</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in leading-tight" style={{ animationDelay: "0.1s" }}>

                        <span className="text-foreground">Publications</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        Exploring the intersection of audio signal processing,<br />
                        machine learning, and intelligent media systems.
                    </p>



                    {/* Stats bar */}
                    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        {stats.map((s, i) => (
                            <div key={i} className="p-4 rounded border border-border/50 bg-card/60 backdrop-blur-md text-center shadow-lg transition-transform hover:-translate-y-1">
                                <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                                <div className="text-foreground font-mono font-bold text-sm">{s.value}</div>
                                <div className="text-muted-foreground text-xs font-mono mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Featured Publication ═══ */}
            <section id="publication" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader label="# featured publication" title="Journal Paper" description="My published research in audio processing and machine learning." />

                    {/* Publication card */}
                    <div className="rounded-lg border border-border bg-card overflow-hidden animate-fade-in">
                        {/* Header bar */}
                        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <span className="font-mono text-xs text-primary tracking-widest uppercase">Peer-Reviewed Journal</span>
                            <span className="ml-auto px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">{publication.year}</span>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-4">
                                {publication.title}
                            </h3>

                            {/* Journal */}
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground font-mono">Published in <span className="text-foreground font-semibold">{publication.journal}</span></span>
                            </div>

                            {/* Authors */}
                            <div className="flex items-center gap-2 mb-8">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground font-mono">
                                    {publication.authors.join(", ")}
                                </span>
                            </div>

                            {/* Abstract */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Quote className="w-4 h-4 text-primary" />
                                    <span className="font-mono text-xs text-primary tracking-widest uppercase">Abstract</span>
                                </div>
                                <div className="pl-4 border-l-2 border-primary/30">
                                    <p className="text-sm text-muted-foreground leading-relaxed">{publication.abstract}</p>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {publication.keywords.map((kw) => (
                                    <span key={kw} className="px-3 py-1 rounded-full border border-border bg-secondary text-secondary-foreground text-xs font-mono">
                                        {kw}
                                    </span>
                                ))}
                            </div>

                            {/* View Publication Button */}
                            <div className="flex items-center">
                                <a href="https://www.igi-global.com/gateway/chapter/330399" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded border border-primary bg-primary text-primary-foreground font-mono text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg">
                                    <FileText className="w-4 h-4" />View Publication
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Key Highlights ═══ */}
            <section id="highlights" className="py-24 px-6 surface-elevated">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader label="# highlights" title="Key Contributions" description="The main contributions and findings of this research." />

                    <div className="grid md:grid-cols-2 gap-4">
                        {publication.highlights.map((h, i) => (
                            <div key={i} className="group p-6 rounded-lg border border-border bg-card hover:border-primary/40 hover:box-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1} s` }}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded border border-primary/30 bg-primary/10 flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-primary font-mono mb-2 block">Contribution #{i + 1}</span>
                                        <p className="text-sm text-foreground leading-relaxed">{h}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Research Objectives ═══ */}
            <section id="objectives" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader label="# objectives" title="Research Objectives" description="The primary goals and focus areas of this study." />

                    <div className="grid md:grid-cols-2 gap-4">
                        {publication.objectives.map((obj, i) => (
                            <div key={i} className="group p-6 rounded-lg border border-border bg-card hover:border-primary/40 hover:box-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded border border-primary/30 bg-primary/10 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <span className="text-xs text-primary font-mono mb-2 block">Objective #{i + 1}</span>
                                        <p className="text-sm text-foreground leading-relaxed">{obj}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Methodology ═══ */}
            <section id="methodology" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader label="# methodology" title="Research Approach" description="The step-by-step methodology used in this research." />

                    <div className="space-y-4 animate-fade-in">
                        {publication.methodology.map((m, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer"
                                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                            >
                                <div className="flex items-center gap-4 p-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded border border-primary/30 bg-primary/10 flex items-center justify-center font-mono text-primary font-bold text-sm">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-mono font-bold text-foreground text-sm">{m.step}</h4>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedStep === i ? "rotate-90" : ""}`} />
                                </div>
                                {expandedStep === i && (
                                    <div className="px-5 pb-5 pl-[4.5rem]">
                                        <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Visual pipeline */}
                    <div className="mt-12 p-6 rounded-lg border border-border bg-card animate-fade-in">
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-4">Research Pipeline</div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
                            {publication.methodology.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 md:gap-3">
                                    <div className="px-3 py-2 rounded border border-primary/30 bg-primary/5 text-xs font-mono text-primary whitespace-nowrap">
                                        {m.step}
                                    </div>
                                    {i < publication.methodology.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>




            {/* ═══ Future Work ═══ */}
            <section id="future-work" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader label="# future work" title="What's Next" description="Upcoming research directions and planned publications." />

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: "Deep Audio Embeddings", desc: "Exploring transformer-based models for richer audio feature representations in clustering tasks.", status: "Exploring" },
                            { title: "Real-time Adaptive Queuing", desc: "Building adaptive queuing systems that learn user preferences in real-time using reinforcement learning.", status: "Planned" },
                            { title: "Cross-modal Analysis", desc: "Combining audio features with lyrical and visual metadata for holistic music understanding.", status: "Ideation" },
                            { title: "Edge Deployment", desc: "Optimizing clustering algorithms for resource-constrained mobile and IoT music devices.", status: "Ideation" },
                        ].map((fw, i) => (
                            <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-mono font-bold text-foreground text-sm">{fw.title}</h4>
                                    <span className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">{fw.status}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{fw.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>




        </main>
    );
};

export default Index;
