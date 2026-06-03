'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/all';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';


// ============================================================================
// TYPES
// ============================================================================
type ReflectionType = "mirror" | "realistic" | "none"
type TextureMode = "all" | "random" | "off"

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string[];
  description_ja?: string[];
  skills: string[];
  verificationUrl?: string;
  filePath?: string;
}

const certificates: Certificate[] = [
  {
    id: "igi-publication",
    title: "IGI Publication",
    issuer: "IGI Global",
    date: "2024",
    category: "Publication",
    description: ["Research publication in IGI Global", "Academic contribution to the field", "Peer-reviewed research work"],
    description_ja: ["IGI Globalでの研究出版", "この分野への学術的貢献", "査読付き研究成果"],
    skills: ["Research", "Academic Writing", "Publication"],
    filePath: "/Certificate/IGI Publication.pdf"
  },
  {
    id: "python-flask",
    title: "Python And Flask Framework Complete Course For Beginners",
    issuer: "UDEMY",
    date: "2023",
    category: "Web Development",
    description: ["Comprehensive introduction to Python programming language", "Building web applications using Flask framework", "Hands-on projects for practical experience"],
    description_ja: ["Pythonプログラミング言語の包括的な入門", "Flaskフレームワークを使用したWebアプリケーション構築", "実践的な経験のためのハンズオンプロジェクト"],
    skills: ["Python", "Flask", "Web Development", "Backend"],
    filePath: "/Certificate/Python And Flask Framework Complete Course For Beginners.pdf"
  },
  {
    id: "excel-basics",
    title: "Introduction to Microsoft Excel",
    issuer: "Coursera",
    date: "2023",
    category: "Productivity",
    description: ["Fundamentals of Microsoft Excel", "Data organization and analysis", "Basic formulas and functions"],
    description_ja: ["Microsoft Excelの基礎", "データの整理と分析", "基本的な数式と関数"],
    skills: ["Microsoft Excel", "Data Analysis", "Spreadsheets", "Productivity Tools"],
    filePath: "/Certificate/An Introduction to  Excel.pdf"
  },
  {
    id: "javascript-ibm",
    title: "JavaScript Programming",
    issuer: "IBM",
    date: "2023",
    category: "Programming",
    description: ["Core JavaScript programming concepts", "Client-side web development", "Interactive web applications"],
    description_ja: ["JavaScriptプログラミングのコアコンセプト", "クライアントサイドWeb開発", "インタラクティブなWebアプリケーション"],
    skills: ["JavaScript", "Web Development", "Frontend"],
    filePath: "/Certificate/IBMCE CEJS1IN Certificate  IBM.pdf"
  },
  {
    id: "prompt-engineering",
    title: "Introduction to Prompt Engineering for Generative AI",
    issuer: "LinkedIn Learning",
    date: "2023",
    category: "AI/ML",
    description: ["Fundamentals of prompt engineering", "Techniques for effective AI interactions", "Best practices for generative AI applications"],
    description_ja: ["プロンプトエンジニアリングの基礎", "効果的なAIインタラクションのためのテクニック", "生成AIアプリケーションのベストプラクティス"],
    skills: ["AI", "Prompt Engineering", "Generative AI", "Machine Learning"],
    filePath: "/Certificate/Introduction to Prompt Engineering.pdf"
  },
  {
    id: "numpy-pandas",
    title: "NumPy & Pandas in Python",
    issuer: "UDEMY",
    date: "2022",
    category: "Data Science",
    description: ["Data manipulation with NumPy and Pandas", "Data analysis techniques", "Practical applications and projects"],
    description_ja: ["NumPyとPandasによるデータ操作", "データ分析テクニック", "実践的なアプリケーションとプロジェクト"],
    skills: ["Python", "NumPy", "Pandas", "Data Analysis"],
    filePath: "/Certificate/Numpy Pandas in Python.pdf"
  },
  {
    id: "js-axix-intellects",
    title: "JavaScript Programming",
    issuer: "SRM AXIS Intellects",
    date: "2022",
    category: "Programming",
    description: ["JavaScript fundamentals", "Web development concepts", "Practical programming exercises"],
    description_ja: ["JavaScriptの基礎", "Web開発のコンセプト", "実践的なプログラミング演習"],
    skills: ["JavaScript", "Web Development", "Programming"],
    filePath: "/Certificate/SRM Axis Java Script.pdf"
  },
  {
    id: "c-programming-scratch-to-master",
    title: "C Programming from Scratch to Master",
    issuer: "UDEMY",
    date: "2024",
    category: "Programming",
    description: ["C language fundamentals: variables, data types, control flow", "Pointers, arrays, strings, and memory management", "Functions, structures, files, and modular programming"],
    description_ja: ["C言語の基礎: 変数、データ型、制御フロー", "ポインタ、配列、文字列、およびメモリ管理", "関数、構造体、ファイル、およびモジュール化プログラミング"],
    skills: ["C", "Pointers", "Memory Management", "Problem Solving"],
    filePath: "/Certificate/C Programming Language.pdf"
  },
  {
    id: "basics-of-python-c-square",
    title: "Basics of Python",
    issuer: "C-SQUARE Info Solutions",
    date: "2023",
    category: "Programming",
    description: ["Core Python syntax and control structures", "Functions, modules, and file handling", "Hands-on practice with basic scripts"],
    description_ja: ["Pythonのコア構文と制御構造", "関数、モジュール、およびファイル操作", "基本的なスクリプトの実践的な練習"],
    skills: ["Python", "Scripting", "Problem Solving"],
    filePath: "/Certificate/Basics of Python C-SQUARE.pdf"
  },
  {
    id: "power-bi-fundamentals",
    title: "Power BI Fundamentals",
    issuer: "Microsoft Power BI",
    date: "2023",
    category: "Data Science",
    description: ["Data import, modeling, and DAX basics", "Interactive dashboards and reports", "Publishing and sharing insights"],
    description_ja: ["データのインポート、モデリング、およびDAXの基礎", "インタラクティブなダッシュボードとレポート", "インサイトの公開と共有"],
    skills: ["Power BI", "Data Modeling", "Dashboards"],
    filePath: "/Certificate/Power Bi .pdf"
  },
  {
    id: "srm-axis-ml-big-data",
    title: "Machine Learning and Big Data",
    issuer: "SRM AXIS",
    date: "2022",
    category: "AI/ML",
    description: ["ML fundamentals and workflows", "Introduction to big data concepts", "Practical applications and use cases"],
    description_ja: ["機械学習の基礎とワークフロー", "ビッグデータの概念入門", "実践的なアプリケーションとユースケース"],
    skills: ["Machine Learning", "Big Data", "Data Processing"],
    filePath: "/Certificate/SRM AXIS- Machine Learning and Big Data.pdf"
  },
  {
    id: "shah-1353-prathap-s",
    title: "SHAH - 1353 PRATHAP S",
    issuer: "SHAH",
    date: "2023",
    category: "Programming",
    description: ["Certification awarded to PRATHAP S", "Demonstrated competence as per SHAH program"],
    description_ja: ["PRATHAP Sに授与された認定", "SHAHプログラムに従った能力の実証"],
    skills: ["Problem Solving"],
    filePath: "/Certificate/SHAH - 1353 PRATHAP S.pdf"
  },
  {
    id: "qentelli-intern",
    title: "AI/ML Project Internship",
    issuer: "Qentelli Solutions",
    date: "2024",
    category: "AI/ML",
    description: ["Successfully completed AI/ML project internship", "Worked on predictive analytics and machine learning models", "Demonstrated enthusiasm, self-discipline and self-motivation"],
    description_ja: ["AI/MLプロジェクトインターンシップを正常に完了", "予測分析と機械学習モデルに従事", "熱意、自己規律、および自己動機付けを実証"],
    skills: ["AI/ML", "Predictive Analytics", "Machine Learning"],
    filePath: "/Certificate/Qentelli Intership certificate.pdf"
  }
];

const TEXTURE_LIST = [
  "/img/aa1.png", "/img/aa2.png", "/img/aa4.png", "/img/aa5.png", "/img/aa6.png", "/img/aa7.png",
  "/img/aa8.png", "/img/aa9.png", "/img/aa10.png", "/img/aa11.png", "/img/aa12.jpg", "/img/aa13.jpg",
];

const PANEL_COLORS = {
  primary: "#505050",
  deepBlack: "#0F0F0F",
  panelGray: "#1A1A1A",
  trackGray: "#2A2A2A",
  highlightWhite: "#E0E0E0",
  textColor: "#9CA3AF",
};

// ============================================================================
// SVG FILTER COMPONENT
// ============================================================================
function RealisticReflectionFilter() {
  const d = 0.05
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "fixed" }}>
      <defs>
        <filter id="realistic-shadow" x="-0.5" y="-0.5" width="2" height="2" colorInterpolationFilters="sRGB" primitiveUnits="objectBoundingBox">
          <feGaussianBlur stdDeviation={d} />
          <feOffset dx={d * 0.5} dy={d * 1.5} result="in" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9713" />
          <feDisplacementMap in="in" scale={d * 1.5} yChannelSelector="R" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  )
}

// ============================================================================
// VINYL CAROUSEL COMPONENT
// ============================================================================
function VinylCarousel({
  reflectionType = "mirror",
  textureMode = "all",
  selectedTexture = "/img/aa1.png",
  navRef,
  onSelectCert,
  items
}: {
  reflectionType?: ReflectionType
  textureMode?: TextureMode
  selectedTexture?: string
  navRef?: React.MutableRefObject<{ prev: () => void; next: () => void }>
  onSelectCert: (cert: Certificate) => void
  items: Certificate[]
}) {
  const initialIndex = Math.floor(items.length / 2)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const activeIndexRef = useRef(initialIndex)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const boxesRef = useRef<HTMLDivElement | null>(null)
  const draggableInstance = useRef<Draggable | null>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const centerOffsetRef = useRef(0)

  const [randomTextures] = useState(() =>
    items.map(() => TEXTURE_LIST[Math.floor(Math.random() * TEXTURE_LIST.length)])
  )

  const [dimensions, setDimensions] = useState({ width: 550, height: 390, gap: 80 });
  const itemWidth = dimensions.width;
  const itemHeight = dimensions.height;
  const itemGap = dimensions.gap;

  const rotationAmount = -40
  const focusedScale = 1.2
  const focusedTranslateY = 20
  const focusedTranslateZ = 120
  const adjacentScale = 0.95

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        setDimensions({ width: 260, height: 185, gap: 30 });
      } else if (screenWidth < 640) {
        setDimensions({ width: 320, height: 227, gap: 40 });
      } else if (screenWidth < 768) {
        setDimensions({ width: 400, height: 284, gap: 50 });
      } else if (screenWidth < 1024) {
        setDimensions({ width: 450, height: 320, gap: 60 });
      } else {
        setDimensions({ width: 550, height: 390, gap: 80 });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateVisuals = useCallback((currentIndexFloat: number) => {
    if (!boxesRef.current) return;
    const boxes = gsap.utils.toArray<HTMLElement>(boxesRef.current.children)
    boxes.forEach((box, i) => {
      const distance = i - currentIndexFloat
      const absDistance = Math.abs(distance)
      const isCenter = absDistance < 0.5
      const isLeftNeighbor = Math.round(distance) === -1 && absDistance >= 0.5 && absDistance < 1.5
      const isRightNeighbor = Math.round(distance) === 1 && absDistance >= 0.5 && absDistance < 1.5

      box.classList.toggle("is-active", isCenter)

      const props: gsap.TweenVars = {
        rotationY: 0,
        rotationX: 0,
        z: 0,
        scale: 1,
        y: 0,
        zIndex: 1,
        filter: "blur(0px)",
        transformOrigin: "center center",
      }

      if (isCenter) {
        props.scale = focusedScale
        props.y = focusedTranslateY
        props.z = focusedTranslateZ
        props.zIndex = 100
      } else if (isLeftNeighbor) {
        props.rotationY = rotationAmount
        props.z = 150
        props.scale = adjacentScale
        props.zIndex = 60
      } else if (isRightNeighbor) {
        props.rotationY = -rotationAmount
        props.z = 150
        props.scale = adjacentScale
        props.zIndex = 60
      } else {
        props.zIndex = 100 - Math.round(absDistance * 10)
        props.y = 8
        props.filter = `blur(${absDistance > 2.5 ? Math.min((absDistance - 2.5) * 0.8, 4) : 0}px)`
      }

      gsap.to(box, { ...props, duration: 0.03, ease: "power1.out", overwrite: true, force3D: true })
    })
  }, [adjacentScale, focusedScale, focusedTranslateY, focusedTranslateZ, rotationAmount]);

  const animateTo = useCallback((index: number, duration: number) => {
    animationRef.current?.kill()
    animationRef.current = gsap.to(boxesRef.current, {
      x: centerOffsetRef.current - index * (itemWidth + itemGap),
      duration,
      ease: "power2.out",
      force3D: true,
      overwrite: true,
      onUpdate: () => {
        const currentX = gsap.getProperty(boxesRef.current, "x") as number
        updateVisuals(-(currentX - centerOffsetRef.current) / (itemWidth + itemGap))
      },
      onComplete: () => setActiveIndex(index),
    })
  }, [itemWidth, itemGap, updateVisuals]);

  const goToPrev = useCallback(() => {
    const newIndex = Math.max(0, activeIndexRef.current - 1)
    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex
      animateTo(newIndex, 0.15)
    }
  }, [animateTo]);

  const goToNext = useCallback(() => {
    const newIndex = Math.min(items.length - 1, activeIndexRef.current + 1)
    if (newIndex !== activeIndexRef.current) {
      activeIndexRef.current = newIndex
      animateTo(newIndex, 0.15)
    }
  }, [animateTo, items.length]);

  useEffect(() => {
    gsap.registerPlugin(Draggable)
    centerOffsetRef.current = wrapperRef.current ? wrapperRef.current.offsetWidth / 2 - itemWidth / 2 : 0
    const startIdx = Math.floor(items.length / 2)
    activeIndexRef.current = startIdx;
    setActiveIndex(startIdx);
    
    gsap.set(boxesRef.current, { x: centerOffsetRef.current - startIdx * (itemWidth + itemGap), force3D: true })
    updateVisuals(startIdx)

    draggableInstance.current = Draggable.create(boxesRef.current, {
      type: "x",
      edgeResistance: 0.65,
      inertia: false,
      bounds: {
        minX: centerOffsetRef.current - (items.length - 1) * (itemWidth + itemGap),
        maxX: centerOffsetRef.current,
      },
      onDrag: function () {
        updateVisuals(-(this.x - centerOffsetRef.current) / (itemWidth + itemGap))
      },
      onDragEnd: function () {
        const newIndex = Math.round(-(this.x - centerOffsetRef.current) / (itemWidth + itemGap))
        const clampedIndex = gsap.utils.clamp(0, items.length - 1, newIndex)
        activeIndexRef.current = clampedIndex
        animateTo(clampedIndex, 0.2)
      },
    })[0]

    return () => { draggableInstance.current?.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, itemWidth, itemGap]) 

  useEffect(() => {
    const handleResize = () => {
      centerOffsetRef.current = wrapperRef.current ? wrapperRef.current.offsetWidth / 2 - itemWidth / 2 : 0
      gsap.set(boxesRef.current, { x: centerOffsetRef.current - activeIndexRef.current * (itemWidth + itemGap), force3D: true })
      updateVisuals(activeIndexRef.current)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const currentX = gsap.getProperty(boxesRef.current, "x") as number
      const newX = currentX - event.deltaY * 0.5
      const minX = centerOffsetRef.current - (items.length - 1) * (itemWidth + itemGap)
      const clampedX = gsap.utils.clamp(minX, centerOffsetRef.current, newX)

      gsap.to(boxesRef.current, {
        x: clampedX,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
        force3D: true,
        onUpdate: () => {
          const x = gsap.getProperty(boxesRef.current, "x") as number
          const idx = -(x - centerOffsetRef.current) / (itemWidth + itemGap)
          updateVisuals(idx)
          const nearestIndex = gsap.utils.clamp(0, items.length - 1, Math.round(idx))
          if (nearestIndex !== activeIndexRef.current) {
            activeIndexRef.current = nearestIndex
            setActiveIndex(nearestIndex)
          }
        },
      })
    }

    const wrapper = wrapperRef.current
    window.addEventListener("resize", handleResize)
    wrapper?.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("resize", handleResize)
      wrapper?.removeEventListener("wheel", handleWheel)
    }
  }, [items.length, itemWidth, itemGap, updateVisuals])

  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])
  useEffect(() => { if (navRef) navRef.current = { prev: goToPrev, next: goToNext } }, [navRef, goToPrev, goToNext])

  const getTextureForItem = (index: number): string | null => {
    if (textureMode === "off") return null
    if (textureMode === "all") return selectedTexture
    if (textureMode === "random") return randomTextures[index]
    return null
  }

  const getReflectionStyle = (): React.CSSProperties => {
    if (reflectionType === "mirror") {
      return { WebkitBoxReflect: "below 1px linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 10%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.05) 40%, transparent 60%)" }
    }
    if (reflectionType === "realistic") {
      return { filter: "url(#realistic-shadow)" }
    }
    return {}
  }

  return (
    <>
      <RealisticReflectionFilter />
      <div
        ref={wrapperRef}
        className="flex items-center justify-start w-full grow overflow-hidden cursor-grab active:cursor-grabbing relative"
        style={{ perspective: "1500px", perspectiveOrigin: "center center", height: "60vh" }}
      >
        <div
          ref={boxesRef}
          className="flex items-center relative select-none mt-[-10dvh]"
          style={{ gap: `${itemGap}px`, transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {items.map((cert, index) => {
            const texture = getTextureForItem(index)
            return (
              <div
                key={cert.id + index}
                className="vinyl-box cursor-pointer flex-shrink-0 relative group"
                style={{ width: itemWidth, height: itemHeight, transformStyle: "preserve-3d", willChange: "transform, filter", backfaceVisibility: "hidden" }}
                onClick={() => {
                  if (activeIndexRef.current === index) {
                    onSelectCert(cert);
                  } else {
                    activeIndexRef.current = index;
                    animateTo(index, 0.2);
                  }
                }}
                aria-label={cert.title}
              >
                <div
                  className="w-full h-full grid place-items-center rounded bg-zinc-900 border border-zinc-800 relative overflow-hidden"
                  style={{ ...getReflectionStyle(), transition: "filter 0.3s ease-in-out" }}
                >
                  {cert.filePath ? (
                    <iframe
                      src={cert.filePath + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit"}
                      className="w-full h-full pointer-events-none bg-white object-cover"
                      title={cert.title}
                      scrolling="no"
                      style={{
                        border: 'none',
                        backfaceVisibility: "hidden",
                        overflow: 'hidden'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-white flex flex-col p-6 items-center justify-center text-center">
                      <span className="font-bold text-black">{cert.title}</span>
                    </div>
                  )}

                  {/* Glass overlay preventing iframe interaction but keeping visual */}
                  <div className="absolute inset-0 z-10 block pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                  {/* Hover visual for "Click to view" */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-white font-bold bg-foreground/20 px-4 py-2 rounded-full backdrop-blur-sm border border-foreground/30">{translations[useLanguage().language].certificates.click_to_open}</span>
                    <p className="text-white text-xs mt-2 text-center px-4 line-clamp-2">{cert.title}</p>
                  </div>

                  {/* Texture Overlay */}
                  {texture && (
                    <div
                      className="absolute inset-0 pointer-events-none rounded transition-opacity duration-200 texture-overlay"
                      style={{
                        backgroundImage: `url(${texture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        mixBlendMode: "screen",
                        opacity: 0.8,
                        zIndex: 3,
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style jsx>{`
        .vinyl-box.is-active .texture-overlay {
          opacity: 0 !important;
          transform: translateY(-100%);
        }
      `}</style>
    </>
  )
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export function Certificates() {
  const { language } = useLanguage();
  const t = translations[language].certificates;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const carouselNavRef = useRef<{ prev: () => void; next: () => void }>({ prev: () => { }, next: () => { } })

  const categories = ['All', ...Array.from(new Set(certificates.map(cert => cert.category)))];

  const filteredCertificates = selectedCategory === 'All'
    ? certificates
    : certificates.filter(cert => cert.category === selectedCategory);

  return (
    <section id="certificates" className="min-h-[100dvh] pt-24 pb-12 bg-background flex flex-col justify-between overflow-hidden relative">
      <div className="text-center z-10 shrink-0 mb-8 max-w-7xl mx-auto w-full px-4">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t.title}
        </motion.h2>

        <motion.div
          className="flex flex-wrap gap-3 mt-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <LiquidButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              size="default"
              className={`pointer-events-auto cursor-pointer transition-all duration-300 ${selectedCategory === category
                ? 'bg-foreground text-background scale-[1.02]'
                : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
            >
              {((translations[language].certificates.categories as any)?.[category.toLowerCase().replace(/[\s/]/g, '_')]) || category}
            </LiquidButton>
          ))}
        </motion.div>
      </div>

      <VinylCarousel
        key={selectedCategory} // Forces remount when category changes to handle GSAP recalculations correctly
        reflectionType="mirror"
        textureMode="all"
        selectedTexture="/img/aa1.png"
        navRef={carouselNavRef}
        onSelectCert={(cert) => setSelectedCert(cert)}
        items={filteredCertificates}
      />

      {/* Navigation Arrows */}
      <div className="flex justify-center items-center gap-6 pb-8 z-20 pointer-events-auto shrink-0 relative mt-[-2rem]">
        <button
          onClick={() => carouselNavRef.current.prev()}
          className="w-14 h-14 rounded-full bg-background border border-border/50 shadow-md hover:bg-muted text-foreground transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
        <button
          onClick={() => carouselNavRef.current.next()}
          className="w-14 h-14 rounded-full bg-background border border-border/50 shadow-md hover:bg-muted text-foreground transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border">
          <DialogHeader className="p-4 border-b border-border shrink-0">
            <DialogTitle className="text-foreground">{selectedCert?.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{selectedCert?.issuer} - {selectedCert?.date}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 w-full h-full bg-muted/20 relative flex flex-col">
            {selectedCert?.filePath ? (
              <>
                <div className="md:hidden p-3 bg-muted/50 border-b border-border flex justify-center items-center shrink-0">
                  <a 
                    href={selectedCert.filePath} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    {t.click_to_open}
                  </a>
                </div>
                <iframe
                  src={`${selectedCert.filePath}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  className="w-full h-full flex-1 border-none"
                  title={selectedCert.title}
                />
              </>
            ) : selectedCert?.verificationUrl ? (
              <div className="flex w-full h-full items-center justify-center">
                <a href={selectedCert.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {t.verify_online}
                </a>
              </div>
            ) : (
              <div className="flex w-full h-full items-center justify-center text-muted-foreground">
                {t.no_document}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}