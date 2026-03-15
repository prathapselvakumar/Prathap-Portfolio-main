"use client";

import { useState, useEffect, useRef } from "react";
import { Layers, Home, Search, Terminal, Github, ExternalLink, Star, Code2, Play, Square, ChevronRight, Cpu, Zap, Database, Check, AlertCircle, Loader2, User } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Testimonials } from "@/components/Testimonials";
import { projects } from "@/lib/projects";
import { MoireDeterrent } from "@/components/MoireDeterrent";

/* ─── Typing effect hook ─── */
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

/* ─── Section Header ─── */
const SectionHeader = ({ label, title, description }: { label: string; title: string; description?: string }) => (
    <div className="mb-12 text-center">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-2 md:mb-3">{label}</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 md:mb-4 text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">{description}</p>}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
    </div>
);

/* ─── Data ─── */
const features = [
    { icon: Cpu, title: "YOLOv8 Detection", desc: "Real-time snake detection using a custom-trained YOLOv8 model to identify and classify snake species from images and video." },
    { icon: Zap, title: "Species Classification", desc: "Classifies detected snakes as venomous or non-venomous, providing critical safety information for users." },
    { icon: Database, title: "Image & Video Input", desc: "Supports multiple input modes including uploaded images, video files, and live camera feed for flexible detection." },
    { icon: Search, title: "Annotated Results", desc: "Outputs annotated images and videos with bounding boxes, confidence scores, and species labels for clear identification." },
];

const codeSnippets = [
    {
        id: "1",
        title: "detect.py",
        description: "Main detection script using YOLOv8 for snake identification",
        code: `import cv2
from ultralytics import YOLO
import argparse

def load_model(weights_path):
    """Load the YOLOv8 model with custom weights."""
    model = YOLO(weights_path)
    return model

def detect_snake(model, source, conf=0.5):
    """Run snake detection on the given source."""
    results = model.predict(
        source=source,
        conf=conf,
        save=True,
        show=True
    )
    return results

def process_results(results):
    """Process and display detection results."""
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = result.names[cls]
            print(f"Detected: {label} ({conf:.2f})")
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", default="best.pt")
    parser.add_argument("--source", required=True)
    parser.add_argument("--conf", type=float, default=0.5)
    args = parser.parse_args()

    model = load_model(args.weights)
    results = detect_snake(model, args.source, args.conf)
    process_results(results)`,
    },
    {
        id: "2",
        title: "train.py",
        description: "Training script for the YOLOv8 snake detection model",
        code: `from ultralytics import YOLO

def train_model():
    """Train YOLOv8 model on snake dataset."""
    model = YOLO("yolov8n.pt")  # Load pretrained model

    results = model.train(
        data="data.yaml",
        epochs=100,
        imgsz=640,
        batch=16,
        name="snake_detection",
        patience=20,
        save=True,
        plots=True
    )
    return results

def validate_model(weights_path):
    """Validate the trained model."""
    model = YOLO(weights_path)
    metrics = model.val()
    print(f"mAP50: {metrics.box.map50:.4f}")
    print(f"mAP50-95: {metrics.box.map:.4f}")
    return metrics

if __name__ == "__main__":
    train_model()
    validate_model("runs/detect/snake_detection/weights/best.pt")`,
    },
    {
        id: "3",
        title: "app.py",
        description: "Streamlit web app for interactive snake detection",
        code: `import streamlit as st
from ultralytics import YOLO
from PIL import Image
import cv2
import tempfile

st.set_page_config(page_title="Snake Detection", page_icon="🐍")
st.title("🐍 Snake Detection System")

model = YOLO("best.pt")

option = st.selectbox("Input Source",
    ["Upload Image", "Upload Video", "Live Camera"])

if option == "Upload Image":
    uploaded = st.file_uploader("Upload an image",
        type=["jpg", "png", "jpeg"])
    if uploaded:
        image = Image.open(uploaded)
        results = model.predict(source=image, conf=0.5)
        annotated = results[0].plot()
        st.image(annotated, caption="Detection Results",
                 use_column_width=True)

        for box in results[0].boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = results[0].names[cls]
            st.success(f"Detected: {label} ({conf:.2%})")

elif option == "Upload Video":
    uploaded = st.file_uploader("Upload a video",
        type=["mp4", "avi", "mov"])
    if uploaded:
        tfile = tempfile.NamedTemporaryFile(delete=False)
        tfile.write(uploaded.read())
        st.video(tfile.name)
        st.info("Processing video for detections...")`,
    },
];

const terminalOutput = [
    { type: "cmd" as const, text: "python detect.py --weights best.pt --source test_images/" },
    { type: "info" as const, text: "Loading YOLOv8 model (best.pt)..." },
    { type: "success" as const, text: "Model loaded successfully ✓" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "info" as const, text: "Processing: snake_01.jpg" },
    { type: "success" as const, text: "Detected: Indian Cobra (0.94)" },
    { type: "info" as const, text: "Processing: snake_02.jpg" },
    { type: "success" as const, text: "Detected: King Cobra (0.89)" },
    { type: "info" as const, text: "Processing: snake_03.jpg" },
    { type: "success" as const, text: "Detected: Russell's Viper (0.91)" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "result" as const, text: "3 images processed, 3 detections found" },
    { type: "success" as const, text: "Results saved to runs/detect/ ✓" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "info" as const, text: "📌 This is sample terminal output." },
    { type: "info" as const, text: "For full source code & docs, visit GitHub ↓" },
    { type: "result" as const, text: "→ github.com/prathapselvakumar/Snake-detection" },
];

const repo = {
    name: "Snake-detection",
    description: "A YOLOv8-powered snake detection and classification system that identifies snake species from images, video, and live camera feed, helping users determine if a snake is venomous or non-venomous.",
    language: "Python",
    languageColor: "hsl(50 70% 50%)",
    stars: 0,
    forks: 0,
    url: "https://github.com/prathapselvakumar/Snake-detection",
    topics: ["python", "yolov8", "deep-learning", "object-detection", "snake-detection", "computer-vision"],
};

/* ─── Page ─── */
const Index = () => {
    const [activeSnippet, setActiveSnippet] = useState("1");
    const [isRunning, setIsRunning] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);

    const project = projects.find(p => p.id === 'snake-detection');

    if (!project) return null;
    const navItems = [
        { name: 'Home', url: '#hero', icon: Home },
        { name: 'Features', url: '#features', icon: Layers },
        { name: 'Source', url: '#code', icon: Code2 },
        { name: 'Demo', url: '#demo', icon: Terminal },
        { name: 'GitHub', url: '#github', icon: Github },
        ...(project?.team ? [{ name: 'Team', url: '#team', icon: User }] : []),
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const navItem = navItems.find(item => item.url === `#${id}`);
                    if (navItem) {
                        // The NavBar handles its own state
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['hero', 'features', 'code', 'demo', 'github'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [navItems]);

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
            if (i >= terminalOutput.length) {
                clearInterval(interval);
                setTimeout(() => setIsRunning(false), 500);
            }
        }, 200);
    };

    const getLineColor = (type: string) => {
        switch (type) {
            case "cmd": return "text-primary text-glow";
            case "success": return "text-primary";
            case "info": return "text-muted-foreground";
            case "header": return "text-foreground font-bold";
            case "result": return "text-foreground";
            case "divider": return "text-border";
            default: return "text-foreground";
        }
    };

    return (
        <main className="min-h-screen bg-background w-full overflow-hidden">
            {/* ═══ Navigation ═══ */}
            {/* Project Title (Top Left) */}
            <div className="hidden lg:flex fixed top-6 left-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight">Snake Detection</span>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation - matches main page */}
            <NavBar
                items={navItems}
                onItemClick={(url) => {
                    const el = document.getElementById(url.replace('#', ''));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 text-center">
                       
                                       {/* Background Image */}
                                       <div className="absolute inset-0 z-0">
                                           <img
                                               src={project.image}
                                               alt=""
                                               className="w-full h-full object-cover opacity-80 dark:opacity-40"
                                           />
                                           <MoireDeterrent />
                                           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />
                                           <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                                       </div>
                       
                            <div className="relative z-10 max-w-4xl pt-20">
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

            {/* ═══ Features ═══ */}
            <section id="features" className="min-h-screen flex items-center py-16 md:py-24 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# features" title="What It Does" description="Core capabilities of the Snake Detection system." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="group p-6 rounded border border-border bg-card hover:border-primary/40 hover:box-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <f.icon className="w-8 h-8 text-primary mb-4 group-hover:text-glow transition-all" />
                                <h3 className="font-mono font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Source Code ═══ */}
            <section id="code" className="py-16 md:py-24 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# source" title="Project Source Code" description="Browse the core Python modules that power the Snake Detection system." />

                    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4 animate-fade-in">
                        {/* File list */}
                        <div className="rounded-lg border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 border-b border-border text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                Files
                            </div>
                            {codeSnippets.map((s) => (
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
                                    {codeSnippets.find(s => s.id === activeSnippet)?.title}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">Python</span>
                            </div>
                            <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm leading-6 font-mono">
                                <code className="text-foreground">
                                    {codeSnippets.find(s => s.id === activeSnippet)?.code.split('\n').map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-8 sm:w-10 flex-shrink-0 text-right pr-2 sm:pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                                            <span className="flex-1">{highlightPython(line)}</span>
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Terminal Demo ═══ */}
            <section id="demo" className="py-16 md:py-24 px-4 sm:px-6 surface-elevated">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# demo" title="Live Terminal Output" description="See the Snake Detection system in action. Click Run to simulate." />

                    <div className="rounded-lg border border-border overflow-hidden bg-background animate-fade-in">
                        {/* Terminal title bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                <span className="ml-3 text-xs text-muted-foreground font-mono">terminal — python</span>
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
                        <div ref={terminalRef} className="p-5 font-mono text-sm leading-7 min-h-[350px] max-h-[500px] overflow-y-auto">
                            {visibleLines === 0 && (
                                <div className="flex gap-2 break-all">
                                    <span className="text-primary">$</span>
                                    <span className="text-muted-foreground">_</span>
                                    <span className="cursor-blink text-primary">▋</span>
                                </div>
                            )}
                            {terminalOutput.slice(0, visibleLines).map((line, i) => (
                                <div key={i} className={`${getLineColor(line.type)} ${line.type === "cmd" ? "mb-1" : ""} break-all sm:break-normal whitespace-pre-wrap`}>
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
                </div>
            </section>

            {/* ─── GitHub ─── */}
            <section id="github" className="py-16 md:py-24 px-4 sm:px-6 surface-elevated">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# repository" title="Get the Code" description="Clone the repository and start searching from your terminal." />

                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-border bg-card p-8 hover:border-primary/40 hover:box-glow transition-all duration-300 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
                            <div className="flex-1 flex flex-col items-center sm:items-start">
                                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 w-full overflow-hidden">
                                    <Github className="w-6 h-6 text-primary flex-shrink-0" />
                                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">{repo.name}</h3>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5 break-words max-w-lg text-center sm:text-left">{repo.description}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    {repo.topics.map((topic) => (
                                        <span key={topic} className="px-2.5 py-1 rounded border border-border bg-secondary text-secondary-foreground text-xs font-mono break-all sm:break-normal">{topic}</span>
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

                    {/* Clone command */}
                    <div className="mt-6 rounded-lg border border-border bg-card p-5 font-mono text-sm animate-fade-in overflow-x-auto" style={{ animationDelay: "0.1s" }}>
                        <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</div>
                        <div className="space-y-2 text-foreground min-w-max">
                            <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/Snake-detection.git</div>
                            <div><span className="text-primary">$</span> cd Snake-detection</div>
                            <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                            <div><span className="text-primary">$</span> python detect.py --source test_images/</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Team ═══ */}
            {project?.team && (
                <div id="team">
                    <Testimonials 
                        title={project.team.title || "Team"} 
                        description={project.team.description}
                        variant="animated"
                        data={project.team.members}
                    />
                </div>
            )}

            {/* ═══ Footer ═══ */}
            <footer className="border-t border-border py-10 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                        <span className="text-primary">$</span> echo "© {new Date().getFullYear()} Snake-Detection"
                    </span>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </footer>
        </main >
    );
};

/* ─── Basic Python syntax highlighting ─── */
function highlightPython(line: string): React.ReactNode {
    const keywords = /\b(import|from|def|class|return|if|else|elif|for|in|with|as|async|await|not|and|or|try|except|raise|None|True|False|self|yield)\b/g;
    const strings = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|f"(?:[^"\\]|\\.)*"|f'(?:[^'\\]|\\.)*')/g;
    const comments = /(#.*)$/;
    const decorators = /(@\w+)/g;
    const numbers = /\b(\d+)\b/g;

    const commentMatch = line.match(comments);
    if (commentMatch && !line.trim().startsWith('"') && !line.trim().startsWith("'")) {
        const idx = line.indexOf(commentMatch[1]);
        const before = line.slice(0, idx);
        const comment = commentMatch[1];
        return (
            <>
                {highlightPython(before)}
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

export default Index;
