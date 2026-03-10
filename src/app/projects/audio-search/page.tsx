"use client";

import { useState, useEffect, useRef } from "react";
import { Layers, Home, Search, Terminal, Github, ExternalLink, Star, Code2, Play, Square, ChevronRight, Cpu, Zap, Database, Check, AlertCircle, Loader2 } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";

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
    { icon: Cpu, title: "Audio Fingerprinting", desc: "Generates unique acoustic fingerprints from audio channels using spectral analysis and hashing." },
    { icon: Database, title: "SQLite Storage", desc: "Stores fingerprints in SQLite database for fast lookup and matching against recorded audio." },
    { icon: Zap, title: "Real-Time Listening", desc: "Records audio from microphone in real-time and matches it against the fingerprint database." },
    { icon: Search, title: "Hash Matching", desc: "Finds matching songs by comparing fingerprint hashes with confidence scoring and offset alignment." },
];

const codeSnippets = [
    {
        id: "1",
        title: "analyze.py",
        description: "Analyzes music files and stores fingerprints in the database",
        code: `import os
import src.analyzer as analyzer
from src.filereader import FileReader
from termcolor import colored
from src.db import SQLiteDatabase

MUSICS_FOLDER_PATH = "mp3"

if __name__ == '__main__':
    db = SQLiteDatabase()

    for filename in os.listdir(MUSICS_FOLDER_PATH):
        # Skip hidden files and non-WAV files
        if not filename.endswith(".wav") or filename.startswith('.'):
            continue

        try:
            file_path = os.path.join(MUSICS_FOLDER_PATH, filename)
            reader = FileReader(file_path)
            audio = reader.parse_audio()
        except Exception as e:
            print(colored(f"Error processing {filename}: {str(e)}", "red"))
            continue

        song = db.get_song_by_filehash(audio['file_hash'])

        if not song:
            song_id = db.add_song(filename, audio['file_hash'])
        else:
            song_id = song['id']

        print(colored(f"Analyzing music: {filename}", "green"))

        hash_count = db.get_song_hashes_count(song_id)
        if hash_count > 0:
            msg = f'Warning: This song already exists ({hash_count} hashes), skipping'
            print(colored(msg, 'yellow'))
            continue

        hashes = set()

        for channeln, channel in enumerate(audio['channels']):
            channel_hashes = analyzer.fingerprint(channel, Fs=audio['Fs'])
            channel_hashes = set(channel_hashes)
            msg = f'Channel {channeln} saved {len(channel_hashes)} hashes'
            print(colored(msg, attrs=['dark']))
            hashes |= channel_hashes

        values = [(song_id, hash, offset) for hash, offset in hashes]
        db.store_fingerprints(values)

    print(colored('Done', "green"))`,
    },
    {
        id: "2",
        title: "listen.py",
        description: "Records audio from mic and matches against fingerprint database",
        code: `import os
import sys
import src
import src.analyzer as analyzer
import argparse
from argparse import RawTextHelpFormatter
from itertools import zip_longest
from termcolor import colored
from src.listener import Listener
from src.db import SQLiteDatabase

if __name__ == '__main__':
    db = SQLiteDatabase()
    parser = argparse.ArgumentParser(formatter_class=RawTextHelpFormatter)
    parser.add_argument('-s', '--seconds', nargs='?')
    args = parser.parse_args()

    if not args.seconds:
        print(colored("Warning: You don't set any second. It's 10 by default", "yellow"))
        args.seconds = "10"

    seconds = int(args.seconds)
    chunksize = 2**12
    channels = 1
    record_forever = False

    listener = Listener()
    listener.start_recording(
        seconds=seconds,
        chunksize=chunksize,
        channels=channels
    )

    while True:
        bufferSize = int(listener.rate / listener.chunksize * seconds)
        print(colored("Listening....", "green"))
        for i in range(0, bufferSize):
            nums = listener.process_recording()
        if not record_forever: break

    listener.stop_recording()
    print(colored('Okey, enough', attrs=['dark']))

    def grouper(iterable, n, fillvalue=None):
        args = [iter(iterable)] * n
        return (filter(None, values) for values
                in zip_longest(fillvalue=fillvalue, *args))

    data = listener.get_recorded_data()
    msg = 'Took %d samples'
    print(colored(msg, attrs=['dark']) % len(data[0]))

    Fs = analyzer.DEFAULT_FS
    channel_amount = len(data)
    result = set()
    matches = []

    def find_matches(samples, Fs=analyzer.DEFAULT_FS):
        hashes = analyzer.fingerprint(samples, Fs=Fs)
        return return_matches(hashes)

    def return_matches(hashes):
        mapper = {}
        for hash, offset in hashes:
            mapper[hash.upper()] = offset
        values = mapper.keys()
        for split_values in grouper(values, 1000):
            query = """
                SELECT upper(hash), song_fk, offset
                FROM fingerprints
                WHERE upper(hash) IN (%s)
            """
            vals = list(split_values).copy()
            length = len(vals)
            query = query % ', '.join('?' * length)
            x = db.executeAll(query, values=vals)
            matches_found = len(x)
            if matches_found > 0:
                msg = 'I found %d hash in db'
                print(colored(msg, 'green') % matches_found)
            for hash, sid, offset in x:
                yield (sid, mapper[hash])

    for channeln, channel in enumerate(data):
        matches.extend(find_matches(channel))

    def align_matches(matches):
        diff_counter = {}
        largest = 0
        largest_count = 0
        song_id = -1
        for tup in matches:
            sid, diff = tup
            if diff not in diff_counter:
                diff_counter[diff] = {}
            if sid not in diff_counter[diff]:
                diff_counter[diff][sid] = 0
            diff_counter[diff][sid] += 1
            if diff_counter[diff][sid] > largest_count:
                largest = diff
                largest_count = diff_counter[diff][sid]
                song_id = sid

        songM = db.get_song_by_id(song_id)
        nseconds = round(float(largest) / analyzer.DEFAULT_FS *
                         analyzer.DEFAULT_WINDOW_SIZE *
                         analyzer.DEFAULT_OVERLAP_RATIO, 5)
        return {
            "SONG_ID": song_id,
            "SONG_NAME": songM[1],
            "CONFIDENCE": largest_count,
            "OFFSET": int(largest),
            "OFFSET_SECS": nseconds
        }

    total_matches_found = len(matches)
    if total_matches_found > 0:
        msg = 'Totally found %d hash'
        print(colored(msg, 'green') % total_matches_found)
        song = align_matches(matches)
        msg = ' => song: %s (id=%d)\\n'
        msg += '    offset: %d (%d secs)\\n'
        print(colored(msg, 'green') % (
            song['SONG_NAME'], song['SONG_ID'],
            song['OFFSET'], song['OFFSET_SECS']
        ))
    else:
        msg = 'Not anything matching'
        print(colored(msg, 'red'))`,
    },
];

const terminalOutput = [
    { type: "cmd" as const, text: "python analyze.py" },
    { type: "success" as const, text: "Analyzing music: 1.wav" },
    { type: "info" as const, text: "Channel 0 saved 4823 hashes" },
    { type: "success" as const, text: "Analyzing music: 2.wav" },
    { type: "info" as const, text: "Channel 0 saved 5102 hashes" },
    { type: "success" as const, text: "Analyzing music: 3.wav" },
    { type: "info" as const, text: "Channel 0 saved 4956 hashes" },
    { type: "success" as const, text: "Done" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "cmd" as const, text: "python listen.py -s 10" },
    { type: "info" as const, text: "Warning: Recording for 10 seconds..." },
    { type: "success" as const, text: "Listening...." },
    { type: "info" as const, text: "Okey, enough" },
    { type: "info" as const, text: "Took 44100 samples" },
    { type: "success" as const, text: "I found 342 hash in db" },
    { type: "success" as const, text: "Totally found 342 hash" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "result" as const, text: " => song: 1.wav (id=1)" },
    { type: "result" as const, text: "    offset: 2048 (12 secs)" },
    { type: "success" as const, text: "Match found! ✓" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "info" as const, text: "📌 This is sample terminal output." },
    { type: "info" as const, text: "For full source code & docs, visit GitHub ↓" },
    { type: "result" as const, text: "→ github.com/prathapselvakumar/Audio-Search-Engine" },
];

const repo = {
    name: "Audio-Search-Engine",
    description: "A Python-based audio fingerprinting and recognition system. Analyzes WAV files, generates acoustic fingerprints, stores them in SQLite, and matches recorded audio against the database in real-time.",
    language: "Python",
    languageColor: "hsl(50 70% 50%)",
    stars: 0,
    forks: 0,
    url: "https://github.com/prathapselvakumar/Audio-Search-Engine",
    topics: ["python", "audio-fingerprinting", "sqlite", "signal-processing", "music-recognition"],
};

/* ─── Page ─── */
const Index = () => {
    const [activeSnippet, setActiveSnippet] = useState("1");
    const [isRunning, setIsRunning] = useState(false);
    const [visibleLines, setVisibleLines] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { name: 'Home', url: '#hero', icon: Home },
        { name: 'Features', url: '#features', icon: Layers },
        { name: 'Terminal', url: '#demo', icon: Terminal },
        { name: 'Source', url: '#code', icon: Code2 },
        { name: 'GitHub', url: '#repository', icon: Github },
    ];

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
        <main className="min-h-screen bg-background w-full overflow-hidden">
            {/* ═══ Navigation ═══ */}
            {/* Project Title (Top Left) */}
            <div className="hidden lg:flex fixed top-6 left-6 z-50 items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight">Audio Search Engine</span>
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

            {/* ═══ Hero ═══ */}
            <section id="hero" className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 px-4 sm:px-6">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg"
                        alt=""
                        className="w-full h-full object-cover opacity-80 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border border-primary/30 bg-primary/5 animate-fade-in">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-primary font-mono text-sm tracking-widest uppercase">Python CLI Project</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <span className="gradient-text">Audio Search</span> <span className="text-foreground">Engine</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono animate-fade-in break-words text-center" style={{ animationDelay: "0.2s" }}>
                        A Python-based audio fingerprinting <br className="block sm:hidden" />
                        and recognition system. <br className="block md:hidden" />
                        <br className="hidden md:block" />
                        Analyze WAV files, generate fingerprints, <br className="block sm:hidden" />
                        and match audio in real-time.
                    </p>


                    {/* Quick install */}
                    <div className="mt-10 animate-fade-in hidden sm:block" style={{ animationDelay: "0.4s" }}>
                        <div className="inline-flex max-w-full items-center gap-3 px-5 py-3 rounded border border-border bg-card font-mono text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <span className="text-primary flex-shrink-0">$</span>
                            <span className="text-muted-foreground">git clone https://github.com/prathapselvakumar/Audio-Search-Engine.git</span>
                        </div>
                    </div>
                </div>
            </section >

            {/* ═══ Features ═══ */}
            <section id="features" className="min-h-screen flex items-center py-16 md:py-24 px-4 sm:px-6" >
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# features" title="What It Does" description="Core capabilities of the auto search engine." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f, i) => (
                            <div key={i} className="group p-6 rounded border border-border bg-card hover:border-primary/40 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <f.icon className="w-8 h-8 text-primary mb-4 transition-all" />
                                <h3 className="font-mono font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ═══ Terminal Demo ═══ */}
            < section id="demo" className="py-16 md:py-24 px-4 sm:px-6 surface-elevated" >
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# demo" title="Live Terminal Output" description="See the audio fingerprinting and matching in action. Click Run to simulate." />

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
            </section >

            {/* ═══ Source Code ═══ */}
            < section id="code" className="py-16 md:py-24 px-4 sm:px-6" >
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# source" title="Project Source Code" description="Browse the core Python modules that power the audio search engine." />

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
            </section >

            {/* ═══ Repository ═══ */}
            <section id="repository" className="py-16 md:py-24 px-4 sm:px-6 surface-elevated">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# repository" title="Get the Code" description="Clone the repository and start searching from your terminal." />

                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-border bg-card p-8 hover:border-primary/40 transition-all duration-300 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
                            <div className="flex-1 flex flex-col items-center sm:items-start">
                                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 w-full overflow-hidden">
                                    <Github className="w-6 h-6 text-primary flex-shrink-0" />
                                    <h3 className="font-mono text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate">{repo.name}</h3>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5 break-words max-w-lg">{repo.description}</p>
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
                            <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/Audio-Search-Engine.git</div>
                            <div><span className="text-primary">$</span> cd Audio-Search-Engine</div>
                            <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                            <div><span className="text-primary">$</span> python analyze.py</div>
                            <div><span className="text-primary">$</span> python listen.py -s 10</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ═══ Footer ═══ */}
            < footer className="border-t border-border py-10 px-4 sm:px-6" >
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                        <span className="text-primary">$</span> echo "© {new Date().getFullYear()} Audio-Search-Engine"
                    </span>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </footer >
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
