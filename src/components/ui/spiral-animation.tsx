'use client'

import { useEffect, useRef } from 'react'

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Animation parameters
    let time = 0
    const particles: Array<{
      angle: number
      radius: number
      speed: number
      size: number
    }> = []

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 300,
        speed: 0.001 + Math.random() * 0.002,
        size: 1 + Math.random() * 2
      })
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      time += 0.01

      // Draw spiral
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let i = 0; i < 360; i += 2) {
        const angle = (i * Math.PI) / 180
        const radius = 50 + i * 0.8 + Math.sin(time + i * 0.1) * 20
        const x = centerX + Math.cos(angle + time) * radius
        const y = centerY + Math.sin(angle + time) * radius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Draw particles
      particles.forEach((particle) => {
        particle.angle += particle.speed
        const x = centerX + Math.cos(particle.angle + time) * particle.radius
        const y = centerY + Math.sin(particle.angle + time) * particle.radius

        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time * 2) * 0.2})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw center glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(centerX - 150, centerY - 150, 300, 300)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
