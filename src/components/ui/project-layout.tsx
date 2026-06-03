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
    GitFork,
    Volume2,
    VolumeX,
    Pause,
    ChevronDown,
} from "lucide-react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import LeoRoverExploded from "@/app/projects/leo-rover/LeoRoverExploded";
import PathPlannerApp from "@/app/projects/a-start-algorithm/PathPlannerApp";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { motion, useScroll, useTransform } from "framer-motion";

import { TeamShowcase } from '@/components/TeamShowcase';
import { NavBar } from "@/components/ui/tubelight-navbar";
import HardwareShowcase from "@/components/ui/spatial-product-showcase";
import { getYouTubeThumbnail, cn } from "@/lib/utils";
import RuixenBentoCards from "@/components/ui/ruixen-bento-cards";
import VideoPlayerPro from "@/components/ui/video-player-pro";
import YouTubePlayerPro from "@/components/ui/youtube-player-pro";
import { ShatterButton } from "@/components/ui/ShatterButton";
import { VerticalImageStack } from "./vertical-image-stack";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

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
    const comments = /(#.*)$/;

    const commentMatch = line.match(comments);
    if (commentMatch && !line.trim().startsWith('"') && !line.trim().startsWith("'")) {
        const idx = line.indexOf(commentMatch[1]);
        const before = line.slice(0, idx);
        const comment = commentMatch[1];
        return (
            <>
                {highlightCode(before)}
                <span className="text-[#6A9955] italic">{comment}</span>
            </>
        );
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    const combined = new RegExp(
        `("""[\\s\\S]*?"""|'''[\\s\\S]*?'''|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|f"(?:[^"\\\\]|\\\\.)*"|f'(?:[^'\\\\]|\\\\.)*')` +
        `|(@\\w+)` +
        `|\\b(import|from|return|if|else|elif|for|in|while|with|as|try|except|finally|raise|pass|break|continue|yield|async|await)\\b` +
        `|\\b(def|class|lambda|global|nonlocal|not|and|or)\\b` +
        `|\\b(None|True|False|self|cls)\\b` +
        `|\\b(\\d+\\.?\\d*)\\b` +
        `|\\b([a-zA-Z_]\\w*)(?=\\s*\\()` +
        `|\\b([a-zA-Z_]\\w*)\\b`, 
        'g'
    );

    let match;
    while ((match = combined.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`} className="text-[#D4D4D4]">{line.slice(lastIndex, match.index)}</span>);
        }
        if (match[1]) {
            parts.push(<span key={match.index} className="text-[#CE9178]">{match[0]}</span>);
        } else if (match[2]) {
            parts.push(<span key={match.index} className="text-[#DCDCAA]">{match[0]}</span>);
        } else if (match[3]) {
            parts.push(<span key={match.index} className="text-[#C586C0] font-medium">{match[0]}</span>);
        } else if (match[4]) {
            parts.push(<span key={match.index} className="text-[#569CD6] font-medium">{match[0]}</span>);
        } else if (match[5]) {
            parts.push(<span key={match.index} className="text-[#569CD6]">{match[0]}</span>);
        } else if (match[6]) {
            parts.push(<span key={match.index} className="text-[#B5CEA8]">{match[0]}</span>);
        } else if (match[7]) {
            parts.push(<span key={match.index} className="text-[#DCDCAA]">{match[0]}</span>);
        } else if (match[8]) {
            parts.push(<span key={match.index} className="text-[#9CDCFE]">{match[0]}</span>);
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
        parts.push(<span key={`text-${lastIndex}`} className="text-[#D4D4D4]">{line.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? <>{parts}</> : <span className="text-[#D4D4D4]">{line}</span>;
}

/**
 * Props for the ProjectLayout component.
 * @property {Project} project - The project metadata and configuration.
 * @property {React.ReactNode} [customDemo] - Optional custom React component to render as the simulation/demo instead of the default terminal.
 */
interface ProjectLayoutProps {
    project: Project;
    customDemo?: React.ReactNode;
}

/**
 * ProjectLayout Component
 * 
 * A highly dynamic, multi-section layout template for showcasing individual portfolio projects.
 * It conditionally renders sections (e.g., features, products, code snippets, simulation demos, and videos)
 * based on the available data in the `project` prop.
 */

const ProjectLayout = ({ project, customDemo }: ProjectLayoutProps) => {
    const { language } = useLanguage();
    const t = translations[language].projects.ui;
    const commonT = translations[language].nav;

    const features = project.features?.map((f) => ({
        ...f,
        title: (language === 'ja' && f.title_ja) ? f.title_ja : f.title,
        description: (language === 'ja' && f.desc_ja) ? f.desc_ja : f.desc,
        Icon: iconMap[f.icon] || Cpu,
    }));

    const isAIMLProject = ["audio-search", "agro-analytics", "snake-detection", "drone-controller"].includes(project.id);
    const isAStarProject = project.id === "a-start-algorithm";
    const isDroneProject = project.id === "drone-controller";
    const isAutonomousRobotProject = project.id === "autonomous-robot";
    const isRLProject = project.id === "reinforcement-learning-exercise";
    const hasDemo = isAStarProject || isDroneProject || (!!project.terminalOutput && project.terminalOutput.length > 0) || (!!project.terminalSnippets && project.terminalSnippets.length > 0) || !!project.terminalVideo;

    // Build nav items from project sections
    const navItems = [
        { name: t.home, url: '#hero', icon: Home },
        ...(project.id === "autonomous-robot" ? [{ name: t.promo, url: '#promo', icon: Play }] : []),
        ...(features && features.length > 0 ? [{ name: t.features, url: '#features', icon: Cpu }] : []),
        ...(project.id === "autonomous-robot" ? [{ name: t.products, url: '#products', icon: Box }] : []),
        ...(project.files && project.files.length > 0 ? [{ name: t.design, url: '#files', icon: Ruler }] : []),
        ...(project.codeSnippets && project.codeSnippets.length > 0 ? [{ name: isAIMLProject ? t.source : t.code, url: isAIMLProject ? '#sources' : '#code', icon: Code2 }] : []),
        ...(hasDemo ? [{ name: t.simulation, url: '#demo', icon: Terminal }] : []),
        ...(project.graphImages && project.graphImages.length > 0 ? [{ name: language === 'ja' ? 'グラフ' : 'Graphs', url: '#graphs', icon: Activity }] : []),
        ...(project.videos && project.videos.length > 0 ? [{ name: t.videos, url: '#videos', icon: Play }] : []),
        ...(project.repoUrl ? [{ name: t.github, url: '#github', icon: Github }] : []),
        ...(project.team ? [{ name: t.team, url: '#team', icon: User }] : []),
    ];

    const [activeSection, setActiveSection] = useState("hero");
    const [inlinePlayingVideoId, setInlinePlayingVideoId] = useState<string | null>(null);

    // State and refs for full-screen interactive promo section
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const promoRef = useRef<HTMLDivElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    // Scroll-bound tracking for cinematic video section scrolling animations
    const { scrollYProgress } = useScroll(
        project.id === "autonomous-robot"
            ? {
                target: promoRef,
                offset: ["start end", "end start"]
              }
            : undefined
    );
    const videoY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
    const videoScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.1]);

    const toggleMute = () => {
        if (iframeRef.current) {
            const command = isMuted ? 'unMute' : 'mute';
            iframeRef.current.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: command }),
                '*'
            );
            setIsMuted(!isMuted);
        }
    };

    // Autoplay, pause, and restart video on section enter/exit
    useEffect(() => {
        if (project.id !== 'autonomous-robot') return;

        // Give a slight delay to allow the iframe API to initialize
        const timer = setTimeout(() => {
            if (activeSection === 'promo') {
                // Seek to beginning and play
                iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                    '*'
                );
                iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo' }),
                    '*'
                );
            } else {
                // Pause when scrolled away
                iframeRef.current?.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: 'pauseVideo' }),
                    '*'
                );
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [activeSection, project.id]);

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
        const sections = ['hero', 'promo', 'features', 'products', 'files', 'videos', 'sources', 'code', 'demo', 'github', 'team'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const isDarkSection = activeSection === "features";

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selected3DModel, setSelected3DModel] = useState<string>('Autonomous Mobile Robot');
    const [activeVideoFilter, setActiveVideoFilter] = useState<string>("All");
    const isModalOpenRef = useRef(false);

    // Terminal and code state
    const [activeSnippet, setActiveSnippet] = useState(project.codeSnippets?.[0]?.id || "1");
    const [activeTerminalSnippet, setActiveTerminalSnippet] = useState(project.terminalSnippets?.[0]?.id || "1");
    const [isRunning, setIsRunning] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);

    const terminalRef = useRef<HTMLDivElement>(null);

    const handleRun = () => {
        setIsRunning(true);
        setVisibleLines(0);
        let i = 0;

        let totalLines = 0;
        if (project.terminalSnippets && project.terminalSnippets.length > 0) {
            const activeSnippetObj = project.terminalSnippets.find(s => s.id === activeTerminalSnippet);
            totalLines = activeSnippetObj ? activeSnippetObj.code.split('\n').length : 0;
        } else if (project.terminalOutput) {
            totalLines = project.terminalOutput.length;
        }

        const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
            if (i >= totalLines) {
                clearInterval(interval);
                setTimeout(() => setIsRunning(false), 500);
            }
        }, project.terminalSnippets ? 50 : 200);
    };

    // Reset when switching terminal snippets
    useEffect(() => {
        if (project.terminalSnippets) {
            setIsRunning(false);
            setVisibleLines(0);
        }
    }, [activeTerminalSnippet, project.terminalSnippets]);

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
        <main className="min-h-screen bg-background text-foreground flex flex-col pb-32">
            {/* ─── Navigation ─── */}
            {/* Breadcrumb (Top Left) */}
            <div className="hidden lg:flex ipad-pro-hide fixed top-6 left-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">{t.home}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/#projects">{commonT.projects}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{project.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Theme & Language Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
                <LanguageSwitcher className="h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation - matches main page */}
            <NavBar
                items={navItems}
                forceDark={isDarkSection}
                className="ipad-pro-center-nav"
                onItemClick={(url) => {
                    if (url.startsWith('http')) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    } else if (url.startsWith('#')) {
                        const el = document.getElementById(url.replace('#', ''));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Use window.location or router for non-anchor internal links
                        window.location.href = url;
                    }
                }}
            />

            {/* ─── Hero ═══ */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 text-center order-1">
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
                    <h1 className={cn("font-bold mb-4 md:mb-6 leading-tight",
                        isDroneProject
                            ? "text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                            : "text-4xl sm:text-5xl md:text-6xl lg:text-8xl"
                    )}>
                        <span className="gradient-text">{project.title}</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                        {language === 'ja' && project.description_ja ? project.description_ja : project.description}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {project.categories.map((cat) => (
                            <span
                                key={cat}
                                className="px-4 py-2 rounded-full border text-xs font-mono"
                            >
                                {((translations[language].projects.categories as any)?.[cat.toLowerCase().replace(/[\s/]/g, '_')]) || cat}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Work in Progress Section for Visual Causal Chains ─── */}
            {project.id === 'visual-causal-chains' && (
                <section className="min-h-[55vh] flex flex-col items-center justify-center py-24 px-4 sm:px-6 bg-muted/5 border-y border-border/40 order-2">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.span 
                            className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs tracking-wider uppercase inline-block"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {language === 'ja' ? '修士論文プロジェクト' : 'MSc Dissertation Project'}
                        </motion.span>
                        <motion.h2 
                            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-muted-foreground to-foreground leading-none"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            {language === 'ja' ? '進行中' : 'WORK IN PROGRESS'}
                        </motion.h2>
                        <motion.p 
                            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {language === 'ja' 
                                ? 'マンチェスター大学 MSc ロボティクス修士論文の一部として現在開発中です。詳細な実装と実験結果は近日公開予定です。' 
                                : 'Currently under active development as part of the MSc Robotics Dissertation at the University of Manchester. Detailed implementation and experimental results will be published soon.'}
                        </motion.p>
                    </div>
                </section>
            )}

            {/* ─── Cinematic Promo Section ─── */}
            {project.id === "autonomous-robot" && (
                <section
                    id="promo"
                    ref={promoRef}
                    className="relative w-full h-[100dvh] bg-[#030303] overflow-hidden border-y border-border/40 order-2 md:order-2 flex flex-col justify-center items-center"
                >
                    {/* Mathematical Cinematic Video Container (Fitted to Viewport) */}
                    <motion.div 
                        className="absolute inset-0 z-0 select-none overflow-hidden w-full h-full origin-center flex items-center justify-center bg-[#030303]"
                        style={{ y: videoY, scale: videoScale }}
                    >
                        <div className="w-full h-full max-w-full max-h-full flex items-center justify-center p-0">
                            <div className="relative w-full max-w-full aspect-video" style={{ maxHeight: '100dvh', width: 'min(100vw, calc(100dvh * 16 / 9))' }}>
                                <iframe
                                    ref={iframeRef}
                                    src="https://www.youtube.com/embed/OvwIori7uV8?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=OvwIori7uV8&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1"
                                    title="LEO Rover Promo Video Background"
                                    className="absolute inset-0 w-full h-full pointer-events-none opacity-100 transition-opacity duration-700"
                                    scrolling="no"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Mute Button (Bottom Right) */}
                    <div className="absolute bottom-8 right-8 z-20 pointer-events-auto">
                        <button
                            onClick={toggleMute}
                            className="p-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white hover:text-cyan-400 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex items-center justify-center"
                            title={isMuted ? "Unmute Audio" : "Mute Audio"}
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-cyan-400 animate-pulse" />
                            )}
                        </button>
                    </div>
                </section>
            )}

            {/* ─── Features (or Custom Animation) ─── */}
            {project.id === "autonomous-robot" ? (
                <section id="features" className="w-full relative dark order-3 md:order-3">
                    <div className="pt-12 px-6 max-w-6xl mx-auto absolute z-20 left-0 right-0 top-0 pointer-events-none">
                        <SectionHeader
                            label="# features"
                            title={t.keyFeatures}
                            description={language === 'ja' ? "LEO Roverの構造を3Dで分解して確認できます。" : "Interactive 3D structural breakdown of the LEO Rover."}
                            titleClassName="text-white drop-shadow-md"
                            descClassName="text-white/80 drop-shadow-sm"
                            underlineClassName="bg-gradient-to-r from-white to-transparent"
                        />
                    </div>
                    <LeoRoverExploded />
                </section>
            ) : isAStarProject ? (
                <section id="features" className="py-16 md:py-24 px-4 sm:px-6 border-y border-border/40 order-3 md:order-3">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# features"
                            title={t.whatItDoes}
                            description={language === 'ja' ? "A-Starパスプランニングシステムの主な機能。" : "Core capabilities of the A-Star path planning system."}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-6">
                            {features?.map((f: any, i: number) => (
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
                <section id="features" className={cn("min-h-screen flex items-center py-16 md:py-24 px-4 sm:px-6", "order-3 md:order-3")}>
                    <div className="max-w-6xl mx-auto w-full">
                        <SectionHeader
                            label="# features"
                            title={t.keyFeatures}
                            description={language === 'ja' ? "主要な技術とシステムの機能。" : "Core technologies and system features."}
                        />
                        <RuixenBentoCards
                            features={project.features}
                            iconMap={iconMap}
                        />
                    </div>
                </section>
            )}

            {/* ─── Product Showcase ─── */}
            {project.id === "autonomous-robot" && (
                <section id="products" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/10 order-7 md:order-4">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# products"
                            title={t.productShowcase}
                            description={language === 'ja' ? "自律走行システムで使用されている専門的なハードウェアコンポーネントの詳細。" : "Deep dive into the specialized hardware components used in our mobile autonomous systems."}
                        />
                        <div className="mt-8">
                            <HardwareShowcase />
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Graphs (RL Project) ─── */}
            {project.graphImages && project.graphImages.length > 0 && (
                <section id="graphs" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/10 order-9 md:order-8 overflow-hidden relative">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# graphs"
                            title={language === 'ja' ? "パフォーマンスグラフ" : "Performance Graphs"}
                            description={language === 'ja' ? "モデルのパフォーマンスと結果の可視化" : "Visualizations of model performance and results across experiments."}
                        />
                        <div className="mt-8 flex justify-center w-full relative z-10">
                            <VerticalImageStack images={project.graphImages as any} />
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Files ─── */}
            {project.files && project.files.length > 0 && (
                <section id="files" className="py-16 md:py-24 px-4 sm:px-6 order-8 md:order-5">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# files"
                            title={t.designFiles}
                            description={language === 'ja' ? "モデル、回路図、アセット。" : "Models, schematics, and assets."}
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
                                            <h3 className="font-semibold text-lg mb-1">{language === 'ja' && file.name_ja ? file.name_ja : file.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {language === 'ja' && file.description_ja ? file.description_ja : file.description}
                                            </p>
                                            <div className="flex justify-between items-center mt-auto">
                                                <span className="text-xs font-mono px-2 py-1 rounded bg-muted/50 text-muted-foreground">{file.fileSize}</span>
                                                <div className="flex gap-2">
                                                    <ShatterButton
                                                        shatterColor="#ffffff"
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = file.downloadUrl;
                                                            link.download = '';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}
                                                        className="bg-primary text-primary-foreground hover:scale-105 transition-all !px-4 !py-2 !rounded-md !text-sm flex items-center justify-center"
                                                    >
                                                        <span className="flex items-center">
                                                            <Download className="w-4 h-4 mr-1" />
                                                            {t.download}
                                                        </span>
                                                    </ShatterButton>
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

            {/* ─── Source ─── */}
            {project.codeSnippets && project.codeSnippets.length > 0 && (
                <section id={isAIMLProject ? "sources" : "code"} className={cn("py-16 md:py-24 px-4 sm:px-6", "order-4 md:order-6")}>
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader label={isAIMLProject ? "# source" : "# source"} title={isAIMLProject ? t.source : (isAutonomousRobotProject ? "Source Code" : t.sourceCode)} description={language === 'ja' ? "主要なロジックモジュールの確認。" : "Explore the primary logical modules."} />

                        <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] rounded-md border border-[#3c3c3c] bg-[#1e1e1e] shadow-2xl overflow-hidden font-sans">
                            {/* Explorer (File list) */}
                            <div className="bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
                                <div className="px-4 py-2 flex items-center text-[11px] text-[#cccccc] font-semibold tracking-wider">
                                    EXPLORER
                                </div>
                                <div className="flex-1 overflow-y-auto py-1">
                                    {project.codeSnippets.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setActiveSnippet(s.id)}
                                            className={`w-full text-left px-4 py-1.5 flex items-center gap-2 text-sm transition-colors ${activeSnippet === s.id
                                                ? "bg-[#37373d] text-white"
                                                : "text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white"
                                                }`}
                                        >
                                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeSnippet === s.id ? "rotate-90 text-white" : "text-[#cccccc]"}`} />
                                            <span className="truncate">{language === 'ja' && s.title_ja ? s.title_ja : s.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Editor (Code viewer) */}
                            <div className="bg-[#1e1e1e] flex flex-col min-w-0 overflow-hidden">
                                {/* Editor Tabs */}
                                <div className="flex bg-[#252526] overflow-x-auto hide-scrollbar">
                                    <div className="bg-[#1e1e1e] border-t border-[#007acc] text-[#cccccc] px-4 py-2 text-sm flex items-center gap-2 min-w-max cursor-default">
                                        <span className="text-[#519aba]">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M11.95 2.155c-3.13 0-3.321.134-3.504.606-.18.472-.18 1.488-.18 1.488h3.684v1.077H5.666s-1.401-.013-2.128.714c-.727.727-.714 2.128-.714 2.128v3.684s-.013 1.401.714 2.128c.727.727 1.838.714 1.838.714h1.077V12.15c0-1.892.128-3.385.908-4.165.78-.78 2.273-.908 4.165-.908h3.684V5.41s.013-1.401-.714-2.128c-.727-.727-2.128-.714-2.128-.714h-.418zM12.05 21.845c3.13 0 3.321-.134 3.504-.606.18-.472.18-1.488.18-1.488h-3.684v-1.077h6.284s1.401.013 2.128-.714c.727-.727.714-2.128.714-2.128v-3.684s.013-1.401-.714-2.128c-.727-.727-1.838-.714-1.838-.714h-1.077v2.544c0 1.892-.128 3.385-.908 4.165-.78.78-2.273.908-4.165.908H8.766v1.667s-.013 1.401.714 2.128c.727.727 2.128.714 2.128.714h.418z"/>
                                            </svg>
                                        </span>
                                        {(() => {
                                            const s = project.codeSnippets.find(s => s.id === activeSnippet);
                                            return language === 'ja' && s?.title_ja ? s.title_ja : s?.title;
                                        })()}
                                    </div>
                                    <div className="flex-1 bg-[#252526] border-b border-[#252526]"></div>
                                </div>
                                
                                {/* Breadcrumbs */}
                                <div className="px-4 py-1 text-[12px] text-[#cccccc]/80 flex items-center gap-1 border-b border-[#3c3c3c]/50 bg-[#1e1e1e]">
                                    <span>src</span>
                                    <ChevronRight className="w-3 h-3 text-[#cccccc]/50" />
                                    <span>{(() => {
                                        const s = project.codeSnippets.find(s => s.id === activeSnippet);
                                        return language === 'ja' && s?.title_ja ? s.title_ja : s?.title;
                                    })()}</span>
                                </div>

                                {/* Code Content */}
                                <pre className="p-4 overflow-auto text-[14px] leading-6 font-mono bg-[#1e1e1e] flex-1">
                                    <code className="text-[#D4D4D4] block min-w-max">
                                        {project.codeSnippets.find(s => s.id === activeSnippet)?.code.split('\n').map((line, i) => (
                                            <div key={i} className="flex hover:bg-[#ffffff0a] px-2 -mx-2">
                                                <span className="w-10 flex-shrink-0 text-right pr-6 text-[#858585] select-none">{i + 1}</span>
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
                <section id="demo" className={cn("py-16 md:py-24 px-4 sm:px-6 surface-elevated", "order-5 md:order-7")}>
                    <div className={isDroneProject ? "max-w-7xl mx-auto" : "max-w-4xl mx-auto"}>
                        <SectionHeader
                            label="# simulation"
                            title={isAStarProject ? "A* Path Planner Simulation" : project.terminalVideo ? t.simulationVideo : isDroneProject ? "Adaptive RL Control Simulation" : t.liveSimulation}
                            description={isAStarProject ? (language === 'ja' ? "障害物を考慮したルーティングのための対話型A-Star可視化。" : "Interactive A-star visualization for obstacle-aware routing.") : project.terminalVideo ? (language === 'ja' ? "自律飛行システムの統合ビデオウォークスルー。" : "Integrated video walkthrough of the autonomous flight system.") : isDroneProject ? (language === 'ja' ? "PIDゲインスケジューリングを備えたリアルタイムQ学習シミュレーション。" : "Real-time Q-learning simulation with PID gain scheduling.") : (language === 'ja' ? "コンソール実行のシミュレーション。" : "Simulated console execution.")}
                        />

                        {isAStarProject ? (
                            <div className="rounded-lg border border-border overflow-hidden bg-background">
                                <PathPlannerApp />
                            </div>
                        ) : isDroneProject ? (
                            customDemo ? (
                                <div className="rounded-lg border border-border overflow-hidden bg-background shadow-2xl">
                                    {customDemo}
                                </div>
                            ) : null
                        ) : project.terminalSnippets && project.terminalSnippets.length > 0 ? (
                            <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4">
                                {/* File list */}
                                <div className="rounded-lg border border-border bg-card overflow-hidden">
                                    <div className="px-4 py-3 border-b border-border text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                        Outputs
                                    </div>
                                    {project.terminalSnippets.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setActiveTerminalSnippet(s.id)}
                                            className={`w-full text-left px-4 py-3 border-b border-border font-mono text-sm transition-colors ${activeTerminalSnippet === s.id
                                                ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Terminal className={`w-3 h-3 transition-transform ${activeTerminalSnippet === s.id ? "text-primary" : ""}`} />
                                                <span>{language === 'ja' && s.title_ja ? s.title_ja : s.title}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 ml-5">{language === 'ja' && s.description_ja ? s.description_ja : s.description}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Terminal viewer */}
                                <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden flex flex-col">
                                    {/* Terminal title bar */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                            <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                            <span className="ml-3 text-xs text-muted-foreground font-mono">
                                                {(() => {
                                                    const s = project.terminalSnippets.find(s => s.id === activeTerminalSnippet);
                                                    return language === 'ja' && s?.title_ja ? s.title_ja : s?.title;
                                                })()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleRun}
                                                disabled={isRunning}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                                            >
                                                {isRunning ? t.running : <><Play className="w-3 h-3" />{t.run}</>}
                                            </button>
                                        </div>
                                    </div>
                                    <div ref={terminalRef} className="p-5 overflow-y-auto font-mono text-sm leading-6 min-h-[350px] max-h-[500px] w-full bg-[#0d1117] text-[#c9d1d9]">
                                        {visibleLines === 0 && (
                                            <div className="flex gap-2">
                                                <span className="text-primary">$</span>
                                                <span className="text-muted-foreground">_</span>
                                                <span className="cursor-blink text-primary">▋</span>
                                            </div>
                                        )}
                                        <pre className="whitespace-pre-wrap font-inherit">
                                            {project.terminalSnippets.find(s => s.id === activeTerminalSnippet)?.code.split('\n').slice(0, visibleLines).join('\n')}
                                        </pre>
                                        {isRunning && (
                                            <span className="cursor-blink text-primary">▋</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border overflow-hidden bg-background shadow-2xl">
                                {/* Terminal title bar */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                        <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                        <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                        <span className="ml-3 text-xs text-muted-foreground font-mono">simulation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {project.demoUrl && (
                                            <Link
                                                href={project.demoUrl}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                {t.fullSimulation}
                                            </Link>
                                        )}
                                        {!project.terminalVideo && (
                                            <button
                                                onClick={handleRun}
                                                disabled={isRunning}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                                            >
                                                {isRunning ? t.running : <><Play className="w-3 h-3" />{t.run}</>}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {project.terminalVideo ? (
                                    <VideoPlayerPro
                                        src={project.terminalVideo}
                                        className="aspect-video"
                                    />
                                ) : (
                                    /* Terminal body */
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
                                                    <span>
                                                        {line.text.split('\\n').map((str, strIdx, arr) => (
                                                            <span key={strIdx}>
                                                                {str.split(/(https?:\/\/[^\s]+)/g).map((part, idx) => 
                                                                    part.match(/^https?:\/\//) ? (
                                                                        <a key={idx} href={part === 'http://127.0.0.1:5000' || part === 'http://127.0.0.1:5000/' ? 'https://undergrad-dissertation.vercel.app' : part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors pointer-events-auto">
                                                                            {part}
                                                                        </a>
                                                                    ) : (
                                                                        <span key={idx}>{part}</span>
                                                                    )
                                                                )}
                                                                {strIdx < arr.length - 1 && <br />}
                                                            </span>
                                                        ))}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {isRunning && (
                                            <span className="cursor-blink text-primary">▋</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ─── Videos ─── */}
            {project.videos && project.videos.length > 0 && (
                <section id="videos" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/20 order-10 md:order-9">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# videos"
                            title="Project Walkthroughs"
                            description="Click any video to play."
                        />

                        {(() => {
                            const filters = project.videos?.map(v => v.filter).filter(Boolean) as string[];
                            const uniqueFilters = ["All", ...Array.from(new Set(filters))];

                            const filteredVideos = activeVideoFilter === "All"
                                ? project.videos
                                : project.videos?.filter(v => v.filter === activeVideoFilter);

                            return (
                                <>
                                    {uniqueFilters.length > 1 && (
                                        <motion.div
                                            className="flex flex-wrap gap-3 mb-8 justify-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            viewport={{ once: true }}
                                        >
                                            {uniqueFilters.map((filter) => (
                                                <LiquidButton
                                                    key={filter}
                                                    onClick={() => setActiveVideoFilter(filter)}
                                                    size="default"
                                                    className={`pointer-events-auto cursor-pointer ${activeVideoFilter === filter
                                                        ? 'bg-foreground text-background'
                                                        : 'bg-background text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {filter}
                                                </LiquidButton>
                                            ))}
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredVideos?.map((video) => (
                                            <div
                                                key={video.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInlinePlayingVideoId(video.id);
                                                }}
                                                className="cursor-pointer rounded-lg overflow-hidden border bg-card hover:border-primary transition flex flex-col justify-between"
                                            >
                                                <div className="relative aspect-video w-full bg-black">
                                                    {inlinePlayingVideoId === video.id ? (
                                                        <iframe
                                                            src={`${video.url}${video.url.includes('?') ? '&' : '?'}autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                                                            title={video.title}
                                                            className="w-full h-full"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <>
                                                            <img
                                                                src={getYouTubeThumbnail(video.url)}
                                                                alt={video.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.currentTarget;
                                                                    if (target.src.includes('maxresdefault.jpg')) {
                                                                        target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                                                                    }
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                                <Play className="w-12 h-12 text-white" />
                                                            </div>
                                                            <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-1 rounded font-mono text-white">
                                                                {video.duration}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-semibold mb-1 text-sm md:text-base">{language === 'ja' && video.title_ja ? video.title_ja : video.title}</h3>
                                                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                                            {video.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </section>
            )}

            {/* ─── GitHub ─── */}
            {project.repoUrl && (
                <section id="github" className="py-16 md:py-24 px-4 sm:px-6 bg-muted/20 order-6 md:order-9">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeader
                            label={isAIMLProject ? "# github" : "# repositories"}
                            title={isAIMLProject ? t.github : (isAutonomousRobotProject ? "Get code" : (language === 'ja' ? "ソースコード" : "Source Code"))}
                            description={t.github_desc}
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
                                            {project.title} {t.repo_suffix}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t.access_github}
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
                                        <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/Autonomous-Mobile-Robot-LEO-Rover.git</div>
                                        <div><span className="text-primary">$</span> cd Autonomous-Mobile-Robot-LEO-Rover</div>
                                        <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                                        <div><span className="text-primary">$</span> python3 src/main.py</div>
                                    </div>
                                </div>
                            )}
                            {isDroneProject && (
                                <div className="rounded-lg border border-border bg-card p-5 font-mono text-sm animate-fade-in overflow-x-auto" style={{ animationDelay: "0.1s" }}>
                                    <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</div>
                                    <div className="space-y-2 text-foreground min-w-max">
                                        <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/AMR-Assignment-3</div>
                                        <div><span className="text-primary">$</span> cd AMR-Assignment-3</div>
                                        <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                                        <div><span className="text-primary">$</span> python run.py</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Team ─── */}
            {project.team && (
                <div id="team" className="order-11 md:order-10">
                    <TeamShowcase
                        title={language === 'ja' && project.team.title_ja ? project.team.title_ja : project.team.title}
                        description={language === 'ja' && project.team.description_ja ? project.team.description_ja : project.team.description}
                        members={project.team.members}
                    />
                </div>
            )}

            {/* ─── Footer ─── */}
            <footer className="py-10 px-6 border-t text-center text-xs text-muted-foreground order-12 md:order-11">
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
                    <div className="aspect-video w-full bg-black">
                        {selectedVideo && (
                            <YouTubePlayerPro
                                url={selectedVideo}
                                className="w-full h-full"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default ProjectLayout;
