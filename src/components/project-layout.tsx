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
            {/* ─── Header ─── */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur border">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm font-bold">{project.title}</span>
            </div>

            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler />
            </div>

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
                                    className="flex rounded-lg border bg-card overflow-hidden"
                                >
                                    <img
                                        src={file.previewImage}
                                        alt={file.name}
                                        className="w-48 object-cover"
                                    />
                                    <div className="p-5 flex-1">
                                        <h3 className="font-semibold">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {file.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono">{file.fileSize}</span>
                                            <a href={file.downloadUrl}>
                                                <Button size="sm">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </Button>
                                            </a>
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
