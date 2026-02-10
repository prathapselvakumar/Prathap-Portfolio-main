"use client";

import { useState } from "react";
import {
    Search, Terminal, Github, ExternalLink, Star, Code2, Play, Square,
    ChevronRight, Cpu, Zap, Database, Check, AlertCircle, Loader2,
    Box, FileCode, Eye, Download, Wifi, Activity, Server, Layers,
    X
} from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projects";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

/* ─── Icon Mapping ─── */
const iconMap: Record<string, any> = {
    Cpu, Zap, Database, Search, Terminal, Github, Code2, Play,
    Wifi, Activity, Server, Layers, Box, FileCode
};

/* ─── Section Header ─── */
const SectionHeader = ({ label, title, description }: { label: string; title: string; description?: string }) => (
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-3">{label}</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{description}</p>}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
    </div>
);

interface ProjectLayoutProps {
    project: Project;
}

const ProjectLayout = ({ project }: ProjectLayoutProps) => {
    // Map string icons to components if features exist
    const features = project.features?.map(f => ({
        ...f,
        Icon: iconMap[f.icon] || Cpu // Fallback icon
    }));

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* ═══ Navigation ═══ */}
            {/* Project Title (Top Left) */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight">{project.title}</span>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation Menu */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-2 py-0.5">
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
                        {project.videos && project.videos.length > 0 && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href="#videos">
                                        <Button size="sm" variant="ghost" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                            <Play className="w-3.5 h-3.5 mr-2" />Videos
                                        </Button>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                        {project.files && project.files.length > 0 && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href="#files" className="hidden sm:inline-block">
                                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                            <Box className="w-3.5 h-3.5 mr-2" />Files
                                        </Button>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                        {project.repos && project.repos.length > 0 && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href="#repos">
                                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                            <Github className="w-3.5 h-3.5 mr-2" />GitHub
                                        </Button>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
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
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border border-primary/30 bg-primary/5 animate-fade-in">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-primary font-mono text-sm tracking-widest uppercase">Project Portfolio</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <span className="gradient-text">{project.title}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {project.description}
                    </p>

                    {/* Quick Stats or Tags */}
                    <div className="mt-10 animate-fade-in flex flex-wrap justify-center gap-2" style={{ animationDelay: "0.4s" }}>
                        {project.categories.map(cat => (
                            <div key={cat} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm font-mono text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-muted-foreground">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
                </div>
            </section>

            {/* ═══ Features ═══ */}
            {features && features.length > 0 && (
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader label="# features" title="Key Capabilities" description="Core features and technologies used in this project." />
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {features.map((f, i) => (
                                <div key={i} className="group p-6 rounded border border-border bg-card hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <f.Icon className="w-8 h-8 text-primary mb-4 transition-all" />
                                    <h3 className="font-mono font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ Videos ═══ */}
            {project.videos && project.videos.length > 0 && (
                <section id="videos" className="py-24 px-6 surface-elevated">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader label="# videos" title="Project Walkthroughs" description="Watch detailed recordings and demonstrations." />
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video.url)}
                                    className="group block rounded-lg overflow-hidden border border-border bg-card hover:border-primary/40 transition-all duration-300 animate-fade-in cursor-pointer"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                                            </div>
                                        </div>
                                        <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-background/80 text-xs font-mono text-foreground">{video.duration}</span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ Files / CAD ═══ */}
            {project.files && project.files.length > 0 && (
                <section id="files" className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader label="# files" title="Design Files & CAD" description="Download resources, models, and schematics." />
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.files.map((file, index) => (
                                <div key={file.id} className="group flex flex-col sm:flex-row rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="relative sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                                        <img src={file.previewImage} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-background/30" />
                                        <div className="absolute top-3 left-3">
                                            {file.icon === "fusion" ? <Box className="w-5 h-5 text-primary" /> : <FileCode className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{file.name}</h3>
                                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">{file.format}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{file.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground font-mono">{file.fileSize}</span>
                                            <div className="flex gap-2">
                                                <a href={file.downloadUrl}>
                                                    <Button size="sm" variant="secondary" className="h-8 text-xs">
                                                        <Eye className="w-3.5 h-3.5 mr-1" />Preview
                                                    </Button>
                                                </a>
                                                <a href={file.downloadUrl}>
                                                    <Button size="sm" variant="default" className="h-8 text-xs">
                                                        <Download className="w-3.5 h-3.5 mr-1" />Download
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ Repositories ═══ */}
            {project.repos && project.repos.length > 0 && (
                <section id="repos" className="py-24 px-6 surface-elevated">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeader label="# repositories" title="Source Code" description="Explore the codebase." />

                        <div className="space-y-4">
                            {project.repos.map((repo, index) => (
                                <a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-border bg-card p-8 hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Github className="w-6 h-6 text-primary" />
                                                <h3 className="font-mono text-xl font-bold text-foreground group-hover:text-primary transition-colors">{repo.name}</h3>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{repo.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {repo.topics.map((topic) => (
                                                    <span key={topic} className="px-2.5 py-1 rounded border border-border bg-secondary text-secondary-foreground text-xs font-mono">{topic}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3">
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                                                <span className="font-mono text-xs">{repo.language}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Star className="w-3.5 h-3.5" />
                                                <span className="font-mono text-xs">{repo.stars}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ Footer ═══ */}
            <footer className="border-t border-border py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                        <span className="text-primary">$</span> echo "© {new Date().getFullYear()} {project.title}"
                    </span>
                    <a href="https://github.com/prathapselvakumar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </footer>

            {/* ═══ Video Dialog ═══ */}
            <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                <DialogContent className="sm:max-w-4xl p-0 bg-black/90 border-transparent overflow-hidden">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                    <div className="relative aspect-video w-full">
                        {selectedVideo && (
                            <video
                                controls
                                autoPlay
                                className="w-full h-full"
                                src={selectedVideo}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
};

export default ProjectLayout;
