'use client';

import { useState, useEffect, useRef } from "react";
import { Search, Terminal, Github, ExternalLink, Star, Code2, Play, Square, ChevronRight, Cpu, Zap, Database, Check, AlertCircle, Loader2 } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from "@/components/ui/button";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
    <div className="mb-12">
        <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase block mb-3">{label}</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">{description}</p>}
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-primary to-transparent" />
    </div>
);

/* ─── Data ─── */
const features = [
    { icon: Cpu, title: "Crop Recommendation", desc: "ML-powered crop suggestions using RandomForest and XGBoost based on temperature, humidity, pH, and rainfall." },
    { icon: Database, title: "MySQL Database", desc: "Secure user authentication with hashed passwords stored in MySQL, managing user sessions via Streamlit." },
    { icon: Zap, title: "Crop Health Detection", desc: "YOLOv8 object detection model analyzes uploaded crop images to identify diseases and health status." },
    { icon: Search, title: "Weather Forecasting", desc: "Integrates real-time weather data and forecasting to help farmers plan agricultural activities." },
];

const codeSnippets = [
    {
        id: "1",
        title: "AgroAnalytics.py",
        description: "Main app with auth, MySQL connection, and Streamlit UI",
        code: `import streamlit as st
import mysql.connector
from passlib.hash import pbkdf2_sha256
from PIL import Image

def create_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="crops"
    )

def create_users_table(connection):
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL
        )
    ''')
    connection.commit()

def register_user(connection, username, password):
    cursor = connection.cursor()
    hashed_password = pbkdf2_sha256.hash(password)
    cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)',
                   (username, hashed_password))
    connection.commit()

def authenticate_user(connection, username, password):
    cursor = connection.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s',
                   (username,))
    result = cursor.fetchone()
    if result:
        return pbkdf2_sha256.verify(password, result[0])
    return False

def main():
    st.set_page_config(layout="centered", page_icon="🌾")
    st.title("Agro Analytics")
    connection = create_connection()
    create_users_table(connection)

    page = st.sidebar.radio("", ["Login", "Register"])

    if page == "Register":
        st.header("Register")
        new_username = st.text_input("Enter your username:")
        new_password = st.text_input("Enter your password:", type="password")
        if st.button("Register"):
            register_user(connection, new_username, new_password)
            st.success("Registration successful!")

    elif page == "Login":
        st.header("Login")
        username = st.text_input("Enter your username:")
        password = st.text_input("Enter your password:", type="password")
        if st.button("Login"):
            if authenticate_user(connection, username, password):
                st.success("Login successful!")
                st.session_state["my_input"] = "success"
            else:
                st.error("Authentication failed.")

if __name__ == "__main__":
    main()`,
    },
    {
        id: "2",
        title: "1_Crop_Recommendation.py",
        description: "ML crop recommendation using RandomForest, XGBoost, and Naive Bayes",
        code: `import streamlit as st
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.naive_bayes import GaussianNB

if st.session_state['my_input'] == 'success':
    st.title("Crop Recommendation")

    # Load dataset
    df = pd.read_csv("dataset/Crop_recommendation.csv")

    # Prepare features and labels
    X = df[['temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    # Train models
    models = {
        "Random Forest": make_pipeline(StandardScaler(),
                         RandomForestClassifier()),
        "XGBoost": make_pipeline(StandardScaler(),
                    XGBClassifier()),
        "Naive Bayes": make_pipeline(StandardScaler(),
                       GaussianNB()),
    }

    # User input
    temp = st.number_input("Temperature (°C)", 0.0, 50.0)
    humidity = st.number_input("Humidity (%)", 0.0, 100.0)
    ph = st.number_input("pH Level", 0.0, 14.0)
    rainfall = st.number_input("Rainfall (mm)", 0.0, 500.0)

    if st.button("Recommend Crop"):
        input_data = np.array([[temp, humidity, ph, rainfall]])
        for name, model in models.items():
            model.fit(X_train, y_train)
            pred = model.predict(input_data)
            crop = le.inverse_transform(pred)
            st.write(f"{name}: {crop[0]}")`,
    },
    {
        id: "3",
        title: "2_Crop_Health.py",
        description: "YOLOv8 crop disease detection from uploaded images",
        code: `import streamlit as st
import cv2
from ultralytics import YOLO
from PIL import Image
import io
import tempfile
import os

if st.session_state['my_input'] == 'success':
    def saveImage(fileUpload, folderPath):
        file = fileUpload.read()
        fileName = fileUpload.name
        if not os.path.exists(folderPath):
            os.makedirs(folderPath)
        with open(os.path.join(folderPath, fileName), "wb") as f:
            f.write(file)

    model = YOLO('model/best.pt')

    st.title("Crop Health Monitoring")

    option = st.selectbox("Choose an option",
        ["Upload an Image", "Upload a Video", "Live Feed"])

    if option == "Upload an Image":
        fileUpload = st.file_uploader("Upload a crop image",
            type=["jpg", "png", "jpeg"])
        if fileUpload is not None:
            image = Image.open(fileUpload)
            results = model.predict(source=image)
            annotated = results[0].plot()
            st.image(annotated, caption="Detection Results",
                     use_column_width=True)`,
    },
];

const terminalOutput = [
    { type: "cmd" as const, text: "streamlit run AgroAnalytics.py" },
    { type: "success" as const, text: "You can now view your Streamlit app in your browser." },
    { type: "info" as const, text: "Local URL: http://localhost:8501" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "success" as const, text: "Login successful! ✓" },
    { type: "info" as const, text: "Loading Crop Recommendation module..." },
    { type: "info" as const, text: "Training RandomForest on 2200 samples..." },
    { type: "success" as const, text: "RandomForest: Rice 🌾" },
    { type: "success" as const, text: "XGBoost: Rice 🌾" },
    { type: "success" as const, text: "NaiveBayes: Rice 🌾" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "info" as const, text: "Loading YOLO model (model/best.pt)..." },
    { type: "success" as const, text: "Crop Health Detection ready ✓" },
    { type: "info" as const, text: "Uploaded: tomato_leaf.jpg" },
    { type: "result" as const, text: " => Detected: Early Blight (confidence: 0.92)" },
    { type: "success" as const, text: "Analysis complete ✓" },
    { type: "divider" as const, text: "─".repeat(56) },
    { type: "info" as const, text: "📌 This is sample terminal output." },
    { type: "info" as const, text: "For full source code & docs, visit GitHub ↓" },
    { type: "result" as const, text: "→ github.com/prathapselvakumar/Agro-Analytics" },
];

const repo = {
    name: "Agro-Analytics",
    description: "A Streamlit-based agricultural analytics platform with ML crop recommendation (RandomForest, XGBoost), YOLOv8 crop health detection, weather forecasting, and MySQL user authentication.",
    language: "Python",
    languageColor: "hsl(50 70% 50%)",
    stars: 0,
    forks: 0,
    url: "https://github.com/prathapselvakumar/Agro-Analytics",
    topics: ["python", "streamlit", "machine-learning", "yolov8", "agriculture", "crop-recommendation"],
};

/* ─── Page ─── */
const Index = () => {
    const [activeSnippet, setActiveSnippet] = useState("1");
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
        <main className="min-h-screen bg-background">
            {/* ─── Navigation ─── */}
            {/* Project Title (Top Left) */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-md border border-border/40 text-foreground shadow-sm">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm tracking-tight">Agro Analytics Platform</span>
            </div>

            {/* Theme Toggle (Top Right) */}
            <div className="fixed top-6 right-6 z-50">
                <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
            </div>

            {/* Centered Navigation Menu */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-2 py-0.5">
                {/* Liquid Glass Background */}
                <div className="absolute inset-0 z-0 h-full w-full rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm" />

                <NavigationMenu className="relative z-10">
                    <NavigationMenuList className="gap-1">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#demo">
                                    <Button size="sm" variant="ghost" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Play className="w-3.5 h-3.5 mr-2" />Run Demo
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#code" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Code2 className="w-3.5 h-3.5 mr-2" />Source
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                <a href="#repository" className="hidden sm:inline-block">
                                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 h-7 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground hover:text-primary data-[active=true]:text-primary">
                                        <Github className="w-3.5 h-3.5 mr-2" />GitHub
                                    </Button>
                                </a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* SVG Filter removed */}

            {/* ═══ Hero ═══ */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg"
                        alt=""
                        className="w-full h-full object-cover opacity-80 dark:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded border border-primary/30 bg-primary/5 animate-fade-in">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-primary font-mono text-sm tracking-widest uppercase">Streamlit + ML Project</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <span className="gradient-text text-glow">Agro</span> <span className="text-foreground">Analytics</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-mono animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        A Streamlit-based agricultural analytics platform with ML crop recommendation,<br />
                        YOLOv8 crop health detection, and weather forecasting.
                    </p>

                    {/* Quick install */}
                    <div className="mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <div className="inline-flex items-center gap-3 px-5 py-3 rounded border border-border bg-card font-mono text-sm">
                            <span className="text-primary">$</span>
                            <span className="text-muted-foreground">git clone https://github.com/prathapselvakumar/Agro-Analytics.git</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Features ═══ */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# features" title="What It Does" description="Core capabilities of the Agro Analytics platform." />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* ═══ Terminal Demo ═══ */}
            <section id="demo" className="py-24 px-6 surface-elevated">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# demo" title="Live Terminal Output" description="See the Agro Analytics platform in action. Click Run to simulate." />

                    <div className="rounded-lg border border-border overflow-hidden bg-background animate-fade-in">
                        {/* Terminal title bar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                                <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                                <span className="ml-3 text-xs text-muted-foreground font-mono">terminal — streamlit</span>
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
                                <div className="flex gap-2">
                                    <span className="text-primary">$</span>
                                    <span className="text-muted-foreground">_</span>
                                    <span className="cursor-blink text-primary">▋</span>
                                </div>
                            )}
                            {terminalOutput.slice(0, visibleLines).map((line, i) => (
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
                </div>
            </section>

            {/* ═══ Source Code ═══ */}
            <section id="code" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <SectionHeader label="# source" title="Project Source Code" description="Browse the core Python modules that power the Agro Analytics platform." />

                    <div className="grid lg:grid-cols-[280px_1fr] gap-4 animate-fade-in">
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
                            <pre className="p-5 overflow-x-auto text-sm leading-6 font-mono">
                                <code className="text-foreground">
                                    {codeSnippets.find(s => s.id === activeSnippet)?.code.split('\n').map((line, i) => (
                                        <div key={i} className="flex">
                                            <span className="w-10 flex-shrink-0 text-right pr-4 text-muted-foreground/40 select-none">{i + 1}</span>
                                            <span className="flex-1">{highlightPython(line)}</span>
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Repository ═══ */}
            <section id="repository" className="py-24 px-6 surface-elevated">
                <div className="max-w-4xl mx-auto">
                    <SectionHeader label="# repository" title="Get the Code" description="Clone the repository and start searching from your terminal." />

                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-border bg-card p-8 hover:border-primary/40 hover:box-glow transition-all duration-300 animate-fade-in">
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

                    {/* Clone command */}
                    <div className="mt-6 rounded-lg border border-border bg-card p-5 font-mono text-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Quick Start</div>
                        <div className="space-y-2 text-foreground">
                            <div><span className="text-primary">$</span> git clone https://github.com/prathapselvakumar/Agro-Analytics.git</div>
                            <div><span className="text-primary">$</span> cd Agro-Analytics</div>
                            <div><span className="text-primary">$</span> pip install -r requirements.txt</div>
                            <div><span className="text-primary">$</span> streamlit run AgroAnalytics.py</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="border-t border-border py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                        <span className="text-primary">$</span> echo "© {new Date().getFullYear()} Agro-Analytics"
                    </span>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </footer>
        </main>
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
