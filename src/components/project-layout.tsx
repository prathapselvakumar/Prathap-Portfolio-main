"use client";

import { useState } from "react";
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
} from "lucide-react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
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

/* ─── YouTube Thumbnail Helper ─── */
const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/embed\/([^?]+)/);
    return match
        ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        : "";
};

/* ─── Section Header ─── */
const SectionHeader = ({
    label,
    title,
    description,
}: {
    label: string;
    title: string;
    description?: string;
}) => (
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-3">
            {label}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        {description && (
            <p className="text-muted-foreground max-w-xl text-lg">
                {description}
            </p>
        )}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
    </div>
);

interface ProjectLayoutProps {
    project: Project;
}

const ProjectLayout = ({ project }: ProjectLayoutProps) => {
    const features = project.features?.map((f) => ({
        ...f,
        Icon: iconMap[f.icon] || Cpu,
    }));




    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* ─── Navigation ─── */}
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
                        {project.demoUrl && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="ghost" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                            <Play className="w-3.5 h-3.5 mr-2" />Live Demo
                                        </Button>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                        {project.videos && project.videos.length > 0 && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href="#videos">
                                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                            <Play className="w-3.5 h-3.5 mr-2" />Walkthroughs
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
                                            <Box className="w-3.5 h-3.5 mr-2" />Design Files
                                        </Button>
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}

                        {project.repoUrl && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                    <a href="#repos" className="hidden sm:inline-block">
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

            {/* ─── Hero ─── */}
            <section className="min-h-[80vh] flex items-center justify-center pt-24 px-6 text-center">
                <div className="max-w-4xl">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6">
                        <span className="gradient-text">{project.title}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground">
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

            {/* ─── Features ─── */}
            {features && features.length > 0 && (
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# features"
                            title="Key Capabilities"
                            description="Core technologies and system features."
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded border bg-card hover:border-primary transition"
                                >
                                    <f.Icon className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="font-bold mb-2">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Videos ─── */}
            {project.videos && project.videos.length > 0 && (
                <section id="videos" className="py-24 px-6 bg-muted/20">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# videos"
                            title="Project Walkthroughs"
                            description="Click any video to play."
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.videos.map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video.url)}
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

            {/* ─── Files ─── */}
            {project.files && project.files.length > 0 && (
                <section id="files" className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            label="# files"
                            title="Design Files & CAD"
                            description="Models, schematics, and assets."
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            {project.files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex rounded-lg border bg-card overflow-hidden group"
                                >
                                    <div className="relative w-48 h-full bg-zinc-900 overflow-hidden">
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
                    </div>
                </section>
            )}

            {/* ─── Repositories ─── */}
            {project.repos && project.repos.length > 0 && (
                <section id="repos" className="py-24 px-6 bg-muted/20">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeader
                            label="# repositories"
                            title="Source Code"
                            description="GitHub repositories for this project."
                        />

                        <div className="space-y-4">
                            {project.repos.map((repo) => (
                                <a
                                    key={repo.id}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-6 rounded-lg border bg-card hover:border-primary transition"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-mono font-bold text-lg">
                                                {repo.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {repo.description}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─── Footer ─── */}
            <footer className="py-10 px-6 border-t text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} {project.title}
            </footer>

            {/* ─── Video Modal (iframe) ─── */}
            <Dialog
                open={!!selectedVideo}
                onOpenChange={(open) => !open && setSelectedVideo(null)}
            >
                <DialogContent className="sm:max-w-4xl p-0 bg-black border-none">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                    <div className="aspect-video w-full">
                        {selectedVideo && (
                            <iframe
                                src={selectedVideo}
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
