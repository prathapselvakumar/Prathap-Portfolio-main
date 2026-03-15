"use client";

import { useState, useEffect, useRef } from "react";
import {
    Terminal,
    Github,
    ExternalLink,
    Star,
    Code2,
    Play,
    Cpu,
    Zap,
    Database,
    Box,
    FileCode,
    Eye,
    Download,
    Wifi,
    Activity,
    Server,
    Layers,
    Square,
    ChevronRight,
    Home,
    MessageSquare,
    Ruler,
    User,
} from "lucide-react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import LeoRoverExploded from "@/app/projects/leo-rover/LeoRoverExploded";
import PathPlannerApp from "@/app/projects/a-start-algorithm/PathPlannerApp";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { motion } from "framer-motion";

import { Testimonials } from '@/components/Testimonials';
import { NavBar } from "@/components/ui/tubelight-navbar";
import HardwareShowcase from "@/components/ui/spatial-product-showcase";
import { getYouTubeThumbnail, cn } from "@/lib/utils";
import RuixenBentoCards from "@/components/ui/ruixen-bento-cards";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

/* ─── Icon Mapping ─── */
const iconMap: Record<string, any> = {
    Cpu,
    Zap,
    Database,
    Github,
    Code2,
    Play,
    Wifi,
    Activity,
    Server,
    Layers,
    Box,
    FileCode,
};


/* ─── Section Header ─── */
const SectionHeader = ({
    label,
    title,
    description,
    titleClassName,
    descClassName,
    underlineClassName,
}: {
    label: string;
    title: string;
    description?: string;
    titleClassName?: string;
    descClassName?: string;
    underlineClassName?: string;
}) => (
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-2 md:mb-3">
            {label}
        </span>
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 ${titleClassName || ''}`}>{title}</h2>
        {description && (
            <p className={`max-w-xl text-lg ${descClassName || 'text-muted-foreground'}`}>
                {description}
            </p>
        )}
        <div className={`mt-6 h-px w-20 ${underlineClassName || 'bg-gradient-to-r from-primary to-transparent'}`} />
    </div>
);

/* ─── Typing effect hook ─── */
const AStarPlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        className={`dark:text-white text-black size-6 ${className || ""}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const AStarCornerPlusIcons = () => (
    <>
        <AStarPlusIcon className="absolute -top-3 -left-3" />
        <AStarPlusIcon className="absolute -top-3 -right-3" />
        <AStarPlusIcon className="absolute -bottom-3 -left-3" />
        <AStarPlusIcon className="absolute -bottom-3 -right-3" />
    </>
);

const AStarFeatureCard = ({
    className = "",
    title,
    description,
    Icon,
}: {
    className?: string;
    title: string;
    description: string;
    Icon: any;
}) => (
    <div
        className={cn(
            "relative border border-dashed border-zinc-400 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-950 min-h-[200px]",
            "flex flex-col justify-between",
            className,
        )}
    >
        <AStarCornerPlusIcons />
        <div className="relative z-10 space-y-2">
            <div className="mb-3">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
    </div>
);

const useTypingEffect = (text: string, speed = 40, startDelay = 0) => {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
            return () => clearInterval(interval);
        }, startDelay);
        return () => clearTimeout(timeout);
    }, [text, speed, startDelay]);

    return { displayed, done };
};

/* ─── Terminal Line Component ─── */
const TerminalLine = ({ prefix = "$", text, delay = 0, className = "" }: { prefix?: string; text: string; delay?: number; className?: string }) => {
    const { displayed, done } = useTypingEffect(text, 30, delay);
    return (
        <div className={`flex gap-2 ${className}`}>
            <span className="text-primary flex-shrink-0">{prefix}</span>
            <span className="text-foreground">
                {displayed}
                {!done && <span className="cursor-blink text-primary">▋</span>}
            </span>
        </div>
    );
};

/* ─── Basic syntactic highlighting ─── */
function highlightCode(line: string): React.ReactNode {
    const keywords = /\b(import|from|def|class|return|if|else|elif|for|in|with|as|async|await|not|and|or|try|except|raise|None|True|False|self|yield)\b/g;
    const comments = /(#.*)$/;

    const commentMatch = line.match(comments);
    if (commentMatch && !line.trim().startsWith('"') && !line.trim().startsWith("'")) {
        const idx = line.indexOf(commentMatch[1]);
        const before = line.slice(0, idx);
        const comment = commentMatch[1];
        return (
            <>
                {highlightCode(before)}
                <span className="text-muted-foreground/50 italic">{comment}</span>
            </>
        );
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const combined = new RegExp(`("""[\\s\\S]*?"""|'''[\\s\\S]*?'''|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|f"(?:[^"\\\\]|\\\\.)*"|f'(?:[^'\\\\]|\\\\.)*')|(@\\w+)|\\b(import|from|def|class|return|if|else|elif|for|in|with|as|async|await|not|and|or|try|except|raise|None|True|False|self|yield)\\b|\\b(\\d+)\\b`, 'g');

    let match;
    while ((match = combined.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
        }
        if (match[1]) {
            parts.push(<span key={match.index} className="text-primary/70">{match[0]}</span>);
        } else if (match[2]) {
            parts.push(<span key={match.index} className="text-accent">{match[0]}</span>);
        } else if (match[3]) {
            parts.push(<span key={match.index} className="text-primary font-bold">{match[0]}</span>);
        } else if (match[4]) {
            parts.push(<span key={match.index} className="text-accent/80">{match[0]}</span>);
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : line;
}

interface ProjectLayoutProps {
    project: Project;
}

const ProjectLayout = ({ project }: ProjectLayoutProps) => {
    const features = project.features?.map((f) => ({
        ...f,
        Icon: iconMap[f.icon] || Cpu,
    }));

    const isAIMLProject = ["audio-search", "agro-analytics", "snake-detection"].includes(project.id);
    const isAStarProject = project.id === "a-start-algorithm";
    const isAutonomousRobotProject = project.id === "autonomous-robot";
    const hasDemo = isAStarProject || (!!project.terminalOutput && project.terminalOutput.length > 0);

    // Build nav items from project sections
    const navItems = [
        { name: 'Home', url: '#hero', icon: Home },
        ...(features && features.length > 0 ? [{ name: 'Features', url: '#features', icon: Cpu }] : []),
        ...(project.id === "autonomous-robot" ? [{ name: 'Products', url: '#products', icon: Box }] : []),
        ...(project.files && project.files.length > 0 ? [{ name: 'Design', url: '#files', icon: Ruler }] : []),
        ...(project.videos && project.videos.length > 0 ? [{ name: 'Videos', url: '#videos', icon: Play }] : []),
        ...(project.codeSnippets && project.codeSnippets.length > 0 ? [{ name: isAIMLProject ? 'Source' : 'Code', url: isAIMLProject ? '#sources' : '#code', icon: Code2 }] : []),
        ...(hasDemo ? [{ name: isAIMLProject ? 'Demo' : 'Demo', url: '#demo', icon: Terminal }] : []),
        ...(project.repoUrl ? [{ name: isAIMLProject ? 'GitHub' : 'GitHub', url: '#github', icon: Github }] : []),
        ...(project.team ? [{ name: 'Team', url: '#team', icon: User }] : []),
    ];

    const [activeSection, setActiveSection] = useState("hero");

    // Scroll-based section detection for localized dark mode
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (isModalOpenRef.current) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['hero', 'features', 'products', 'files', 'videos', 'sources', 'code', 'demo', 'github', 'team'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const isDarkSection = activeSection === "features";

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selected3DModel, setSelected3DModel] = useState<string>('Autonomous Mobile Robot');
    const isModalOpenRef = useRef(false);

    // Terminal and code state
    const [activeSnippet, setActiveSnippet] = useState(project.codeSnippets?.[0]?.id || "1");
    const [isRunning, setIsRunning] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);

    const terminalRef = useRef<HTMLDivElement>(null);

    const handleRun = () => {
        setIsRunning(true);
        setVisibleLines(0);
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
            if (project.terminalOutput && i >= project.terminalOutput.length) {
                clearInterval(interval);
                setTimeout(() => setIsRunning(false), 500);
            }
        }, 200);
    };

    const getLineColor = (type: string) => {
        switch (type) {
            case "cmd": return "text-primary";
            case "success": return "text-primary";
            case "info": return "text-muted-foreground";
            case "header": return "text-foreground font-bold";
            case "result": return "text-foreground";
            case "divider": return "text-border";
            default: return "text-foreground";
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* ─── Navigation ─── */}
            {/* Project Title (Top Left) */}
            <div className="hidden lg:flex fixed top-6 left-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight">{project.title}</span>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation - matches main page */}
            <NavBar
                items={navItems}
                forceDark={isDarkSection}
                onItemClick={(url) => {
                    if (url.startsWith('http')) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    } else {
                        const el = document.getElementById(url.replace('#', ''));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
            />

            {/* ─── Hero ═══ */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 text-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={project.image}
                        alt=""
                        className="w-full h-full object-cover opacity-80 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 max-w-4xl pt-8 md:pt-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6">
                        <span className="gradient-text">{project.title}</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                        {project.description}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {project.categories.map((cat) => (
                            <span
                                key={cat}
                                className="px-4 py-2 rounded-full border text-xs font-mono"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features (or Custom Animation) ─── */}
            {project.id === "autonomous-robot" ? (
                <section id="features" className="w-full relative dark">
                    <div className="pt-12 px-6 max-w-6xl mx-auto absolute z-20 left-0 right-0 top-0 pointer-events-none">
                        <SectionHeader
                            label="# features"
                            title="Key Features"
                            description="Interactive 3D structural breakdown of the LEO Rover."
                            titleClassName="text-white drop-shadow-md"
                            descClassName="text-white/80 drop-shadow-sm"
                            underlineClassName="bg-gradient-to-r from-white to-transparent"
                        />
                    </div>
                    <LeoRoverExploded />
                </section>
            ) : isAStarProject ? (
                <section id="features" className="py-16 md:py-24 px-4 sm:px-6 border-y border-border/40">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# features"
                            title="What It Does"
                            description="Core capabilities of the A-Star path planning system."
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-6">
                            {features?.map((f, i) => (
                                <AStarFeatureCard
                                    key={i}
                                    Icon={f.Icon}
                                    title={f.title}
                                    description={f.desc}
                                    className={
                                        i === 0
                                            ? "lg:col-span-3 lg:row-span-2"
                                            : i === 1
                                            ? "lg:col-span-3 lg:row-span-2"
                                            : i === 2
                                            ? "lg:col-span-4 lg:row-span-1"
                                            : "lg:col-span-2 lg:row-span-1"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ) : features && features.length > 0 && (
                <section id="features" className="min-h-screen flex items-center py-16 md:py-24 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto w-full">
                        <SectionHeader
                            label="# features"
                            title="Key Features"
                            description="Core technologies and system features."
                        />
                        <RuixenBentoCards
                            title={project.title}
                            subtitle={`A quick look at how ${project.title} works, from input signals to practical outcomes.`}
                        />
                    </div>
                </section>
            )}

            {/* ─── Product Showcase ─── */}
            {project.id === "autonomous-robot" && (
                <section id="products" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/10">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# products"
                            title="Product Showcase"
                            description="Deep dive into the specialized hardware components used in our mobile autonomous systems."
                        />
                        <div className="mt-8">
                            <HardwareShowcase />
                        </div>
                    </div>
                </section>
            )}


            {/* ─── Files ─── */}
            {project.files && project.files.length > 0 && (
                <section id="files" className="py-16 md:py-24 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# files"
                            title="Design Files & CAD"
                            description="Models, schematics, and assets."
                        />

                        {project.id === 'autonomous-robot' && (
                            <>
                                <motion.div
                                    className="flex flex-wrap gap-3 mb-8 justify-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    {['Autonomous Mobile Robot', 'Arm mounting plate v7', 'LIDAR A2 mount v4', 'NUC mounting plate v4', 'L camera mount v6'].map((model) => (
                                        <LiquidButton
                                            key={model}
                                            onClick={() => setSelected3DModel(model)}
                                            size="default"
                                            className={`pointer-events-auto cursor-pointer ${selected3DModel === model
                                                ? 'bg-foreground text-background'
                                                : 'bg-background text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {model}
                                        </LiquidButton>
                                    ))}
                                </motion.div>

                                <div className="mb-12 flex flex-col gap-6">
                                    {(selected3DModel === 'Autonomous Mobile Robot') && (
                                        <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex justify-center flex-col items-center pt-4">
                                            <h3 className="font-semibold text-lg mb-4 w-full text-center">Autonomous Mobile Robot Assembly</h3>
                                            <iframe
                                                src="https://gmail5797073.autodesk360.com/shares/public/SH28cd1QT2badd0ea72b3c9248b3cee23223?mode=embed"
                                                title="Autonomous Mobile Robot"
                                                width="100%"
                                                height="600"
                                                allowFullScreen={true}
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    )}

                                    {(selected3DModel === 'Arm mounting plate v7') && (
                                        <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex justify-center flex-col items-center pt-4">
                                            <h3 className="font-semibold text-lg mb-4 w-full text-center">Arm mounting plate v7</h3>
                                            <iframe
                                                src="https://gmail5797073.autodesk360.com/shares/public/SH28cd1QT2badd0ea72be128034cae94a4f8?mode=embed"
                                                title="Arm mounting plate v7"
                                                width="100%"
                                                height="600"
                                                allowFullScreen={true}
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    )}

                                    {(selected3DModel === 'LIDAR A2 mount v4') && (
                                        <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex justify-center flex-col items-center pt-4">
                                            <h3 className="font-semibold text-lg mb-4 w-full text-center">LIDAR A2 mount v4</h3>
                                            <iframe
                                                src="https://gmail5797073.autodesk360.com/shares/public/SH28cd1QT2badd0ea72b5beb4d37c0b7bf26?mode=embed"
                                                title="LIDAR A2 mount v4"
                                                width="100%"
                                                height="600"
                                                allowFullScreen={true}
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    )}

                                    {(selected3DModel === 'NUC mounting plate v4') && (
                                        <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex justify-center flex-col items-center pt-4">
                                            <h3 className="font-semibold text-lg mb-4 w-full text-center">NUC mounting plate v4</h3>
                                            <iframe
                                                src="https://gmail5797073.autodesk360.com/shares/public/SH28cd1QT2badd0ea72b8d58d1e2059fcddf?mode=embed"
                                                title="NUC mounting plate v4"
                                                width="100%"
                                                height="600"
                                                allowFullScreen={true}
                                                frameBorder="0"
                                            ></iframe>
                                           
                                        </div>
                                    )}

                                    {(selected3DModel === 'L camera mount v6') && (
                                        <div className="w-full rounded-xl overflow-hidden border bg-card shadow-lg flex justify-center flex-col items-center pt-4">
                                            <h3 className="font-semibold text-lg mb-4 w-full text-center">L camera mount v6</h3>
                                            <iframe
                                                src="https://gmail5797073.autodesk360.com/shares/public/SH28cd1QT2badd0ea72b91dbac7d9902d74c?mode=embed"
                                                title="L camera mount v6"
                                                width="100%"
                                                height="600"
                                                allowFullScreen={true}
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {(!project.id.includes('autonomous')) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex flex-col sm:flex-row rounded-lg border bg-card overflow-hidden group"
                                    >
                                        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-zinc-900 overflow-hidden flex-shrink-0">
                                            <img
                                                src={file.previewImage}
                                                alt={file.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col justify-center">
                                            <h3 className="font-semibold text-lg mb-1">{file.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {file.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-auto">
                                                <span className="text-xs font-mono px-2 py-1 rounded bg-muted/50 text-muted-foreground">{file.fileSize}</span>
                                                <div className="flex gap-2">
                                                    <a href={file.downloadUrl}>
                                                        <Button size="sm">
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Download
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ─── Videos ─── */}
            {project.videos && project.videos.length > 0 && (
                <section id="videos" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/20">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# videos"
                            title="Project Walkthroughs"
                            description="Click any video to play."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.videos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedVideo(video.url);
                                    }}
                                    className="cursor-pointer rounded-lg overflow-hidden border bg-card hover:border-primary transition"
                                >
                                    <div className="relative aspect-video">
                                        <img
                                            src={getYouTubeThumbnail(video.url)}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white" />
                                        </div>
                                        <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded">
                                            {video.duration}
                                        </span>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">{video.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {video.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Source ─── */}
            {project.codeSnippets && project.codeSnippets.length > 0 && (
                <section id={isAIMLProject ? "sources" : "code"} className="py-16 md:py-24 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader label={isAIMLProject ? "# source" : "# source"} title={isAIMLProject ? "Source" : "Project Source Code"} description="Explore the primary logical modules." />

                        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4">
                            {/* File list */}
                            <div className="rounded-lg border border-border bg-card overflow-hidden">
                                <div className="px-4 py-3 border-b border-border text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                    Files
                                </div>
                                {project.codeSnippets.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSnippet(s.id)}
                                        className={`w-full text-left px-4 py-3 border-b border-border font-mono text-sm transition-colors ${activeSnippet === s.id
                                            ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ChevronRight className={`w-3 h-3 transition-transform ${activeSnippet === s.id ? "rotate-90 text-primary" : ""}`} />
                                            <span>{s.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 ml-5">{s.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Code viewer */}
                            <div className="rounded-lg border border-border bg-card overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                                    <span className="font-mono text-sm text-foreground">
                                        {project.codeSnippets.find(s => s.id === activeSnippet)?.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {project.codeSnippets.find(s => s.id === activeSnippet)?.language}
                                    </span>
                                </div>
                                <pre className="p-5 overflow-x-auto text-sm leading-6 font-mono">
                                    <code className="text-foreground">
                                        {project.codeSnippets.find(s => s.id === activeSnippet)?.code.split('\n').map((line, i) => (
                                            <div key={i} className="flex">
                                                <span className="w-10 flex-shrink-0 text-right pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                                                <span className="flex-1 whitespace-pre">{highlightCode(line)}</span>
                                            </div>
                                        ))}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Demo ─── */}
            {hasDemo && (
                <section id="demo" className="py-16 md:py-24 px-4 sm:px-6 surface-elevated">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeader
                            label="# demo"
                            title={isAStarProject ? "A* Path Planner Demo" : "Live Terminal Output"}
                            description={isAStarProject ? "Interactive A-star visualization for obstacle-aware routing." : "Simulated console execution."}
                        />

                        {isAStarProject ? (
                            <div className="rounded-lg border border-border overflow-hidden bg-background">
                                <PathPlannerApp />
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border overflow-hidden bg-background shadow-2xl">
                            {/* Terminal title bar */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                    <span className="ml-3 text-xs text-muted-foreground font-mono">terminal</span>
                                </div>
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                                >
                                    {isRunning ? <><Square className="w-3 h-3" />Running...</> : <><Play className="w-3 h-3" />Run</>}
                                </button>
                            </div>

                            {/* Terminal body */}
                            <div ref={terminalRef} className="p-5 font-mono text-sm leading-7 min-h-[350px] max-h-[500px] overflow-y-auto w-full">
                                {visibleLines === 0 && (
                                    <div className="flex gap-2">
                                        <span className="text-primary">$</span>
                                        <span className="text-muted-foreground">_</span>
                                        <span className="cursor-blink text-primary">▋</span>
                                    </div>
                                )}
                                {project.terminalOutput?.slice(0, visibleLines).map((line, i) => (
                                    <div key={i} className={`${getLineColor(line.type)} ${line.type === "cmd" ? "mb-1" : ""}`}>
                                        {line.type === "cmd" ? (
                                            <span><span className="text-primary">$ </span>{line.text}</span>
                                        ) : (
                                            <span>{line.text}</span>
                                        )}
                                    </div>
                                ))}
                                {isRunning && (
                                    <span className="cursor-blink text-primary">▋</span>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ─── GitHub ─── */}
            {project.repoUrl && (
                <section id="github" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/20">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeader
                            label={isAIMLProject ? "# github" : "# repositories"}
                            title={isAIMLProject ? "GitHub" : "Source Code"}
                            description="GitHub repositories for this project."
                        />

                        <div className="space-y-4">
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 rounded-lg border bg-card hover:border-primary transition"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-mono font-bold text-lg">
                                            {project.title} Repository
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Access the complete source code on GitHub.
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </a>
                            {isAStarProject && (
                                <div className="rounded-lg border border-border bg-card p-5 font-mono text-sm animate-fade-in overflow-x-auto" style={{ animationDelay: "0.1s" }}>
                                    <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</div>
                                    <div className="space-y-2 text-foreground min-w-max">
                                        <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/AMR-Coursework-2</div>
                                        <div><span className="text-primary">$</span> cd AMR-Coursework-2</div>
                                        <div><span className="text-primary">$</span> python -m venv .venv</div>
                                        <div><span className="text-primary">$</span> . .venv/bin/activate</div>
                                        <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                                        <div><span className="text-primary">$</span> python a_star_algorithm.py</div>
                                    </div>
                                </div>
                            )}
                            {isAutonomousRobotProject && (
                                <div className="rounded-lg border border-border bg-card p-5 font-mono text-sm animate-fade-in overflow-x-auto" style={{ animationDelay: "0.1s" }}>
                                    <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</div>
                                    <div className="space-y-2 text-foreground min-w-max">
                                        <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/Leo-Rover.git</div>
                                        <div><span className="text-primary">$</span> cd Leo-Rover</div>
                                        <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                                        <div><span className="text-primary">$</span> python3 src/main.py</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Team ─── */}
            {project.team && (
                <div id="team">
                    <Testimonials 
                        title={project.team.title || "Team"} 
                        description={project.team.description}
                        variant="animated"
                        data={project.team.members}
                    />
                </div>
            )}

            {/* ─── Footer ─── */}
            <footer className="py-10 px-6 border-t text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} {project.title}
            </footer>

            {/* ─── Video Modal (iframe) ─── */}
            <Dialog
                open={!!selectedVideo}
                onOpenChange={(open) => {
                    isModalOpenRef.current = open;
                    if (!open) setSelectedVideo(null);
                }}
            >
                <DialogContent 
                    className="sm:max-w-4xl p-0 bg-black border-none"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                    <div className="aspect-video w-full">
                        {selectedVideo && (
                            <iframe
                                src={`${selectedVideo}${selectedVideo.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default ProjectLayout;
