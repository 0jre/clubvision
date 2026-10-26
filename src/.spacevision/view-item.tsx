"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import styled, { keyframes } from "styled-components"
 

// Interface for component props
interface UltraSmoothParticleImageProps {
  src: string
  particleSize?: number
  particleDensity?: number
  className?: string
  onComplete?: () => void
  effect?: "grid" | "wave" | "explosion" | "spiral" | "matrix"
  maxParticles?: number
}

// Optimized Particle class with object pooling
class OptimizedParticle {
  x = 0
  y = 0
  targetX = 0
  targetY = 0
  startX = 0
  startY = 0
  r = 0
  g = 0
  b = 0
  size = 0
  progress = 0
  delay = 0
  intensity = 0
  active = false
  completed = false

  // Easing function for ultra-smooth animation
  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  // Easing function with bounce
  private easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  init(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    r: number,
    g: number,
    b: number,
    size: number,
    delay: number,
    intensity: number,
  ) {
    this.startX = startX
    this.startY = startY
    this.x = startX
    this.y = startY
    this.targetX = targetX
    this.targetY = targetY
    this.r = r
    this.g = g
    this.b = b
    this.size = size
    this.delay = delay
    this.intensity = intensity
    this.progress = 0
    this.active = false
    this.completed = false
  }

  update(deltaTime: number, currentTime: number) {
    if (!this.active || this.completed) return

    // Check if particle should start animating
    if (currentTime < this.delay) return

    // Update progress with smooth interpolation
    this.progress += deltaTime * 0.002 // Slower, smoother animation
    this.progress = Math.min(this.progress, 1)

    // Use elastic easing for more fluid movement
    const easedProgress = this.easeOutElastic(this.progress)

    // Interpolate position
    this.x = this.startX + (this.targetX - this.startX) * easedProgress
    this.y = this.startY + (this.targetY - this.startY) * easedProgress

    // Mark as completed
    if (this.progress >= 1) {
      this.completed = true
      this.x = this.targetX
      this.y = this.targetY
    }
  }

 draw(ctx: CanvasRenderingContext2D, scale = 1) {
  if (!this.active || this.progress <= 0) return

  const alpha = Math.min(this.progress * 2, 1) // Fade in effect
  const glowSize = this.intensity * 8 * scale

  // Set emerald green glow effect
  ctx.shadowBlur = glowSize
  ctx.shadowColor = `rgba(80, 200, 120, ${alpha * 0.6})`

  // Draw particle
  ctx.globalAlpha = alpha 
  ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`

  const size = this.size * scale
  ctx.fillRect(Math.round(this.x * scale), Math.round(this.y * scale), Math.ceil(size), Math.ceil(size))

  // Reset for next particle
  ctx.shadowBlur = 0
  ctx.globalAlpha = 1
}

}

// Particle pool for memory optimization
class ParticlePool {
  private pool: OptimizedParticle[] = []
  private activeParticles: OptimizedParticle[] = []

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      this.pool.push(new OptimizedParticle())
    }
  }

  getParticle(): OptimizedParticle | null {
    const particle = this.pool.pop()
    if (particle) {
      this.activeParticles.push(particle)
      return particle
    }
    return null
  }

  releaseParticle(particle: OptimizedParticle) {
    const index = this.activeParticles.indexOf(particle)
    if (index > -1) {
      this.activeParticles.splice(index, 1)
      this.pool.push(particle)
    }
  }

  getActiveParticles(): OptimizedParticle[] {
    return this.activeParticles
  }

  clear() {
    this.pool.push(...this.activeParticles)
    this.activeParticles.length = 0
  }
}

export const UltraSmoothParticleImage: React.FC<UltraSmoothParticleImageProps> = ({
  src,
  particleSize = 3,
  particleDensity = 1.2,
  className,
  onComplete,
  effect = "wave",
  maxParticles = 8000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationRef = useRef<number>(0)
  const particlePoolRef = useRef<ParticlePool>(new ParticlePool(maxParticles))
  const lastTimeRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Calculate initial position based on effect type with more fluid patterns
  const calculateInitialPosition = useCallback(
    (targetX: number, targetY: number, width: number, height: number, effect: string, index: number) => {
      const centerX = width / 2
      const centerY = height / 2

      switch (effect) {
        case "wave":
          const waveDistance = Math.sqrt(Math.pow(targetX - centerX, 2) + Math.pow(targetY - centerY, 2))
          const waveAngle = Math.atan2(targetY - centerY, targetX - centerX)
          return {
            x: centerX + Math.cos(waveAngle) * (waveDistance + 200 + Math.random() * 100),
            y: centerY + Math.sin(waveAngle) * (waveDistance + 200 + Math.random() * 100),
          }

        case "explosion":
          return {
            x: centerX + (Math.random() - 0.5) * 50,
            y: centerY + (Math.random() - 0.5) * 50,
          }

        case "spiral":
          const spiralAngle = (index * 0.1) % (Math.PI * 2)
          const spiralRadius = 300 + Math.sin(index * 0.05) * 100
          return {
            x: centerX + Math.cos(spiralAngle) * spiralRadius,
            y: centerY + Math.sin(spiralAngle) * spiralRadius,
          }

        case "matrix":
          return {
            x: targetX + (Math.random() - 0.5) * 100,
            y: -100 - Math.random() * 200,
          }

        case "grid":
        default:
          const gridOffset = Math.sin(targetX * 0.01) * 50
          return {
            x: targetX + gridOffset,
            y: -100 - Math.random() * 150,
          }
      }
    },
    [],
  )

  // Calculate delay for smoother wave effects
  const calculateDelay = useCallback(
    (x: number, y: number, width: number, height: number, effect: string, index: number) => {
      const centerX = width / 2
      const centerY = height / 2

      switch (effect) {
        case "wave":
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          return (distance / Math.max(width, height)) * 2000 + Math.random() * 200

        case "explosion":
          const explosionDistance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          return (1 - explosionDistance / Math.max(width, height)) * 1500 + Math.random() * 300

        case "spiral":
          const angle = Math.atan2(y - centerY, x - centerX)
          const spiralDistance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          return ((angle + Math.PI) / (2 * Math.PI)) * 1000 + (spiralDistance / Math.max(width, height)) * 1000

        case "matrix":
          return (x / width) * 500 + Math.random() * 1000

        case "grid":
        default:
          return (y / height) * 1000 + (x / width) * 200 + Math.random() * 300
      }
    },
    [],
  )

  // Process image with optimizations
  const processImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return

    const img = imageRef.current
    const canvas = canvasRef.current
  const ctx = canvas.getContext("2d")


    if (!ctx) return

    // Set fixed dimensions
    const width = 150
    const height = 110

    canvas.width = width
    canvas.height = height

    // Set display canvas dimensions
    if (displayCanvasRef.current) {
      displayCanvasRef.current.width = width
      displayCanvasRef.current.height = height
    }

    setDimensions({ width, height })

  // Calculate aspect ratios
const imgAspect = img.naturalWidth / img.naturalHeight
const canvasAspect = width / height

let drawWidth, drawHeight, offsetX = 0, offsetY = 0

if (imgAspect > canvasAspect) {
  // Image is wider - fit by width
  drawWidth = width
  drawHeight = width / imgAspect 
  offsetY = (height - drawHeight) / 5 
} else {
  // Image is taller - fit by height  
  drawHeight = height
  drawWidth = height * imgAspect
  offsetX = (width - drawWidth) / 2
}

 
   ctx.clearRect(0, 0, canvas.width, canvas.height)
 
   
// Draw image maintaining aspect ratio
ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    // Clear existing particles
    particlePoolRef.current.clear()

    // Sample pixels with adaptive density
    const step = Math.max(2, Math.floor(particleSize / particleDensity))
    let particleCount = 0
    let index = 0

    for (let y = 0; y < height && particleCount < maxParticles; y += step) {
      for (let x = 0; x < width && particleCount < maxParticles; x += step) {
        const pixelData = ctx.getImageData(x, y, 1, 1).data

        // Skip transparent or very dark pixels
        if (pixelData[3] < 100 || pixelData[0] + pixelData[1] + pixelData[2] < 50) continue

        // Get particle from pool
        const particle = particlePoolRef.current.getParticle()
        if (!particle) break

        // Calculate brightness for intensity
        const brightness = (pixelData[0] + pixelData[1] + pixelData[2]) / (255 * 3)

        // Calculate positions and delay
        const initialPos = calculateInitialPosition(x, y, width, height, effect, index)
        const delay = calculateDelay(x, y, width, height, effect, index)

        // Initialize particle
        particle.init(
          initialPos.x,
          initialPos.y,
          x,
          y,
          pixelData[0],
          pixelData[1],
          pixelData[2],
          particleSize,
          delay,
          brightness,
        )

        particleCount++
        index++
      }
    }

    // Start animation
    startTimeRef.current = performance.now()
    lastTimeRef.current = startTimeRef.current
    startAnimation()
  }, [effect, particleSize, particleDensity, maxParticles, calculateInitialPosition, calculateDelay])

  
  // Ultra-smooth animation loop with adaptive frame rate
  const animate = useCallback(
    (currentTime: number) => {
      if (!displayCanvasRef.current) return

      const canvas = displayCanvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      // Calculate delta time and frame rate
      const deltaTime = currentTime - lastTimeRef.current
      const animationTime = currentTime - startTimeRef.current

      // Skip frame if running too fast (maintain 60fps max)
      if (deltaTime < 16.67) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastTimeRef.current = currentTime

     ctx.clearRect(0, 0, canvas.width, canvas.height)
 
      // Get active particles
      const particles = particlePoolRef.current.getActiveParticles()
      let activeCount = 0
      let completedCount = 0

      
      // Calculate scale for responsive rendering
      const containerWidth = containerRef.current?.clientWidth || canvas.width
      const scale = Math.min(containerWidth / canvas.width, 1)

      // Batch particle updates and rendering
      const batchSize = Math.min(particles.length, 200) // Process in batches for smooth performance

      particles.forEach((particle, index) => {
        // Activate particles progressively
        if (!particle.active && animationTime >= particle.delay) {
          particle.active = true
        }

        if (particle.active) {
          activeCount++
          particle.update(deltaTime, animationTime)
          particle.draw(ctx, scale)

          if (particle.completed) {
            completedCount++
          }
        }
      })

      // Update progress
      const progressPercent = particles.length > 0 ? Math.floor((completedCount / particles.length) * 100) : 0
      setProgress(progressPercent)



      // Check completion
if (progressPercent === 100 && !isComplete && particles.length > 0) {
  setIsComplete(true)
  if (onComplete) {
    setTimeout(() => onComplete(), 300)
  }
  
  // ADICIONE ESTAS LINHAS:
  // Fade out particles and show original image
  setTimeout(() => {
    // Clear all particles
    particlePoolRef.current.clear()
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw the original image
    if (imageRef.current) {
      const img = imageRef.current
      const imgAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = canvas.width / canvas.height
      
      let drawWidth, drawHeight, offsetX = 0, offsetY = 0
      
      if (imgAspect > canvasAspect) {
        drawWidth = canvas.width
        drawHeight = canvas.width / imgAspect
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        drawHeight = canvas.height
        drawWidth = canvas.height * imgAspect
        offsetX = (canvas.width - drawWidth) / 2
      }
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }
    
    // Stop animation loop 
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, 0)
}

      // Check completion
      if (progressPercent === 100 && !isComplete && particles.length > 0) {
        setIsComplete(true)
        if (onComplete) {
          setTimeout(() => onComplete(), 300)
        }
      }


      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    },
    [src,isComplete, onComplete],
  )

  // Start animation
  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [animate])

  // Handle image load
  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure DOM is ready
      setTimeout(processImage, 100)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [src,isLoaded, processImage])


  return (
    <Container ref={containerRef} className={className}>
      <OriginalImage ref={imageRef} src={src} onLoad={() => setIsLoaded(true)} crossOrigin="anonymous" />
      <HiddenCanvas ref={canvasRef} />
      <ParticleCanvas ref={displayCanvasRef} />
     
    </Container>
  )
}


 
const Container = styled.div`
  
  width: 70vw;  
  height: 70vh;  
  
`

 
const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
   background: transparent;
  will-change: transform;
  image-rendering: pixelated;
`

 
 
const HiddenCanvas = styled.canvas`
  display: none;
  background: transparent;
  
`

 
const OriginalImage = styled.img`
  display: none;
  
  background: transparent;
`