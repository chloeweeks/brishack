"use client"

import { useRef, useEffect } from "react"

// Seeded RNG for deterministic stars
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface StarFieldStar {
  x: number
  y: number
  radius: number
  baseOpacity: number
  twinkleSpeed: number
  twinkleOffset: number
  color: { r: number; g: number; b: number }
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<StarFieldStar[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      generateStars()
    }

    const generateStars = () => {
      const rng = mulberry32(12345)
      const w = window.innerWidth
      const h = window.innerHeight
      const count = Math.floor((w * h) / 1200)
      const stars: StarFieldStar[] = []

      const colors = [
        { r: 200, g: 220, b: 255 },  // blue-white
        { r: 255, g: 245, b: 230 },  // warm white
        { r: 180, g: 200, b: 255 },  // blue
        { r: 255, g: 220, b: 180 },  // warm
        { r: 220, g: 230, b: 255 },  // cool white
      ]

      for (let i = 0; i < count; i++) {
        const isBright = rng() < 0.08
        stars.push({
          x: rng() * w,
          y: rng() * h,
          radius: isBright ? 0.8 + rng() * 1.5 : 0.3 + rng() * 0.7,
          baseOpacity: isBright ? 0.5 + rng() * 0.5 : 0.1 + rng() * 0.4,
          twinkleSpeed: 0.5 + rng() * 2.5,
          twinkleOffset: rng() * Math.PI * 2,
          color: colors[Math.floor(rng() * colors.length)],
        })
      }

      starsRef.current = stars
    }

    const render = (time: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const t = time / 1000

      ctx.clearRect(0, 0, w, h)

      // Deep space gradient
      const grad = ctx.createRadialGradient(
        w * 0.3, h * 0.2, 0,
        w * 0.5, h * 0.5, Math.max(w, h) * 0.8
      )
      grad.addColorStop(0, "rgba(15, 20, 50, 1)")
      grad.addColorStop(0.4, "rgba(8, 10, 30, 1)")
      grad.addColorStop(1, "rgba(4, 5, 18, 1)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Subtle nebula wash
      const nebula1 = ctx.createRadialGradient(
        w * 0.7, h * 0.3, 0,
        w * 0.7, h * 0.3, w * 0.4
      )
      nebula1.addColorStop(0, "rgba(40, 60, 120, 0.04)")
      nebula1.addColorStop(0.5, "rgba(30, 40, 90, 0.02)")
      nebula1.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = nebula1
      ctx.fillRect(0, 0, w, h)

      const nebula2 = ctx.createRadialGradient(
        w * 0.2, h * 0.7, 0,
        w * 0.2, h * 0.7, w * 0.35
      )
      nebula2.addColorStop(0, "rgba(60, 30, 80, 0.03)")
      nebula2.addColorStop(0.5, "rgba(40, 20, 60, 0.015)")
      nebula2.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = nebula2
      ctx.fillRect(0, 0, w, h)

      // Draw stars
      for (const star of starsRef.current) {
        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset)
        const opacity = star.baseOpacity * (0.6 + 0.4 * twinkle)
        const { r, g, b } = star.color

        if (star.radius > 1) {
          // Bright stars get a glow
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 4
          )
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`)
          glow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`)
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = glow
          ctx.fillRect(
            star.x - star.radius * 4,
            star.y - star.radius * 4,
            star.radius * 8,
            star.radius * 8
          )
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(render)
    }

    resize()
    animRef.current = requestAnimationFrame(render)
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}