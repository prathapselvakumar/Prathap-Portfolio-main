'use client';

import { useState } from "react";
import { Home, BookOpen, ExternalLink, Quote, Award, User, Calendar, FileText, Lightbulb, Target, BarChart3, Music, Layers, Github, ArrowRight, Play, Code2 } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { TeamShowcase } from "@/components/TeamShowcase";
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { publications } from "@/lib/publications";
import { notFound } from "next/navigation";

/* ─── Section Header ─── */
const SectionHeader = ({ label, title, description }: { label: string; title: string; description?: string }) => (
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-3">{label}</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{description}</p>}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
    </div>
);

/* ─── Stats Helper ─── */
const getStats = (pub: any) => [
    { label: "Publication", value: pub.publisher.split(' ').slice(0, 2).join(' '), icon: BookOpen },
    { label: "Research Area", value: "Audio ML", icon: Music },
    { label: "Year", value: pub.date, icon: Calendar },
    { label: "Focus", value: "Clustering", icon: Layers },
];

/* ─── Page ─── */
const Index = ({ params }: { params: { id: string } }) => {
    const pub = publications.find(p => p.id === params.id) || publications[0];
    
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    // Using the name 'publication' to match rest of the component references
    const publication = {
        title: pub.title,
        journal: pub.publisher,
        year: pub.date,
        authors: pub.authors,
        doi: pub.url,
        abstract: pub.description,
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
        team: pub.team?.members || []
    };

    const stats = getStats(pub);

    const navItems = [
        { name: 'Home', url: '#hero', icon: Home },
        { name: 'Publication', url: '#publication', icon: FileText },
        { name: 'Contributions', url: '#highlights', icon: Target },
        { name: 'Objectives', url: '#objectives', icon: Layers },
        { name: 'Approach', url: '#methodology', icon: BarChart3 },
        { name: 'Future', url: '#future-work', icon: Lightbulb },
        { name: 'Team', url: '#team', icon: User },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* ═══ Navigation ═══ */}
            <div className="hidden lg:flex fixed top-6 left-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/#publications">Publications</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Publication</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation - matches main page */}
            <NavBar
                items={navItems}
                onItemClick={(url) => {
                    if (url.startsWith('http')) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    } else if (url.startsWith('#')) {
                        const el = document.getElementById(url.replace('#', ''));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = url;
                    }
                }}
            />

            {/* ═══ Hero ═══ */}
            <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/Thumbnails/Publication-Thumbnails/audio-clustering.png"
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

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-fade-in leading-tight" style={{ animationDelay: "0.1s" }}>
                        <span className="text-foreground">
                            Comparative Analysis Implementation of Queuing Songs in Players <br />
                            Using <br />
                            Audio Clustering Algorithm
                        </span>
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
                                {publication.title.includes('Clustering Algorithm') ? (
                                    <>
                                        Comparative Analysis Implementation of Queuing Songs in Players <br />
                                        Using <br />
                                        Audio Clustering Algorithm
                                    </>
                                ) : (
                                    publication.title
                                )}
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
                                <a href="https://www.igi-global.com/gateway/chapter/330399" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded border border-primary bg-primary text-primary-foreground font-mono text-sm font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg">
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

            {/* ═══ Team ═══ */}
            <section id="team" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <TeamShowcase 
                        title="Author Team" 
                        description="The researchers and engineers who contributed to this publication."
                        members={publication.team}
                    />
                </div>
            </section>
        </main>
    );
};

export default Index;
