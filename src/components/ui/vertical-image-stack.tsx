"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, type PanInfo } from "framer-motion"
import Image from "next/image"

export interface StackImage {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface VerticalImageStackProps {
  images: StackImage[];
}

export function VerticalImageStack({ images }: VerticalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const lastNavigationTime = useRef(0)
  const navigationCooldown = 400 // ms between navigations

  const navigate = useCallback((newDirection: number) => {
    const now = Date.now()
    if (now - lastNavigationTime.current < navigationCooldown) return
    lastNavigationTime.current = now

    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === images.length - 1 ? 0 : prev + 1
      }
      return prev === 0 ? images.length - 1 : prev - 1
    })
  }, [images.length])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.y < -threshold) {
      navigate(1)
    } else if (info.offset.y > threshold) {
      navigate(-1)
    }
  }

  const containerRef = useRef<HTMLDivElement>(null)

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) {
          navigate(1)
        } else {
          navigate(-1)
        }
      }
    },
    [navigate],
  )

  useEffect(() => {
    const currentContainer = containerRef.current

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent page scroll when swiping on the container
      e.preventDefault()
    }

    if (currentContainer) {
      currentContainer.addEventListener("wheel", handleWheel, { passive: false })
      currentContainer.addEventListener("touchmove", handleTouchMove, { passive: false })
      return () => {
        currentContainer.removeEventListener("wheel", handleWheel)
        currentContainer.removeEventListener("touchmove", handleTouchMove)
      }
    }
  }, [handleWheel])

  const getCardStyle = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    if (diff === 0) {
      return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 }
    } else if (diff === -1) {
      return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 }
    } else if (diff === -2) {
      return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 }
    } else if (diff === 1) {
      return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 }
    } else if (diff === 2) {
      return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 }
    } else {
      return { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 }
    }
  }

  const isVisible = (index: number) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return Math.abs(diff) <= 2
  }

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col w-full relative">
      <div id="stack-container" ref={containerRef} className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-background/50 rounded-2xl border border-border/10 touch-none">
        {/* Subtle ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.02] blur-3xl" />
        </div>

        {/* Card Stack */}
        <div className="relative flex h-[500px] w-[600px] max-w-[90vw] items-center justify-center" style={{ perspective: "1200px" }}>
          {images.map((image, index) => {
            if (!isVisible(index)) return null
            const style = getCardStyle(index)
            const isCurrent = index === currentIndex

            return (
              <motion.div
                key={image.id}
                className="absolute cursor-grab active:cursor-grabbing w-full max-w-[500px]"
                animate={{
                  y: style.y,
                  scale: style.scale,
                  opacity: style.opacity,
                  rotateX: style.rotateX,
                  zIndex: style.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                drag={isCurrent ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: style.zIndex,
                }}
              >
                <div
                  className="relative flex flex-col h-[480px] w-full overflow-hidden rounded-3xl bg-card ring-1 ring-border/20 shadow-2xl"
                  style={{
                    boxShadow: isCurrent
                      ? "0 25px 50px -12px hsl(var(--foreground) / 0.15), 0 0 0 1px hsl(var(--foreground) / 0.05)"
                      : "0 10px 30px -10px hsl(var(--foreground) / 0.1)",
                  }}
                >
                  {/* Card inner glow - uses foreground with low opacity */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-foreground/5 via-transparent to-transparent pointer-events-none z-10" />

                  <div className="relative flex-1 bg-white flex items-center justify-center p-4">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-contain w-full h-full p-4"
                      draggable={false}
                      priority={isCurrent}
                    />
                  </div>

                  {/* Description Area */}
                  {(image.title || image.description) && (
                    <div className="bg-card/90 backdrop-blur-md border-t border-border/10 p-6 z-20">
                      {image.title && <h3 className="text-xl font-semibold mb-2">{image.title}</h3>}
                      {image.description && <p className="text-sm text-muted-foreground">{image.description}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation dots (Desktop) */}
        <div className="hidden md:flex absolute right-36 lg:right-44 top-1/2 -translate-y-1/2 flex-col gap-2 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentIndex) {
                  setCurrentIndex(index)
                }
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentIndex ? "h-6 bg-foreground" : "bg-foreground/30 hover:bg-foreground/50"
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter (Desktop) */}
        <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-light text-foreground tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <div className="my-2 h-px w-8 bg-foreground/20" />
            <span className="text-sm text-muted-foreground tabular-nums">{String(images.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* --- Desktop Instruction Hint --- */}
      <motion.div
        className="hidden md:flex absolute md:bottom-12 md:right-48 lg:right-56 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground/70">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-foreground transition-colors p-2"
            aria-label="Previous image"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.div>
          </button>

          <span className="text-[10px] font-medium tracking-widest uppercase pointer-events-none px-2 text-center leading-tight"> Drag <br />or <br /> Click</span>

          <button
            onClick={() => navigate(1)}
            className="hover:text-foreground transition-colors p-2"
            aria-label="Next image"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* --- Mobile Controls (Hidden on Desktop) --- */}
      <div className="md:hidden mt-6 flex flex-col items-center gap-8 w-full px-4">

        {/* Mobile Stats & Dots Row */}
        <div className="flex flex-row items-center justify-between w-full max-w-[280px]">
          {/* Mobile Counter */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-light text-foreground tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground/30">/</span>
            <span className="text-sm text-muted-foreground tabular-nums">{String(images.length).padStart(2, "0")}</span>
          </div>

          {/* Mobile Dots */}
          <div className="flex flex-row gap-2">
            {images.map((_, index) => {
              // Limit to 4 dots on mobile view using a sliding window
              if (images.length > 4) {
                const startIndex = Math.min(Math.max(0, currentIndex - 1), images.length - 4);
                if (index < startIndex || index >= startIndex + 4) return null;
              }

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex) {
                      setCurrentIndex(index)
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-foreground" : "w-2 bg-foreground/30 hover:bg-foreground/50"
                    }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              )
            })}
          </div>
        </div>

        {/* Mobile Horizontal Arrows */}
        <motion.div
          className="flex flex-row items-center gap-6 text-muted-foreground/70 bg-muted/10 px-6 py-2 rounded-full border border-border/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors p-2" aria-label="Previous image">
            <motion.div animate={{ x: [-4, 0, -4] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.div>
          </button>

          <span className="text-[10px] font-medium tracking-widest uppercase pointer-events-none text-center leading-tight">Swipe or<br />Tap Arrows</span>

          <button onClick={() => navigate(1)} className="hover:text-foreground transition-colors p-2" aria-label="Next image">
            <motion.div animate={{ x: [4, 0, 4] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.div>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
