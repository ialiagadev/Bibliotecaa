import React, { useRef, useEffect, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speed: number
}

const DNAParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let hue = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particlesCount = Math.floor(canvas.width / 10)
      for (let i = 0; i < particlesCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 60}, 100%, 50%)`,
          speed: Math.random() * 0.2 + 0.1
        })
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()
    }

    const updateParticle = (particle: Particle) => {
      particle.y += particle.speed
      if (particle.y > canvas.height) {
        particle.y = 0
        particle.x = Math.random() * canvas.width
      }
    }

    const drawDNAStrand = () => {
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1

      for (let i = 0; i < canvas.height; i += 10) {
        const x1 = Math.sin(i * 0.02) * 100 + canvas.width / 2
        const x2 = Math.sin(i * 0.02 + Math.PI) * 100 + canvas.width / 2
        ctx.moveTo(x1, i)
        ctx.lineTo(x2, i)
      }

      ctx.stroke()
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawDNAStrand()

      particles.forEach(particle => {
        drawParticle(particle)
        updateParticle(particle)
      })

      hue = (hue + 0.5) % 360
      
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 z-10"
        aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </div>
  )
}

export default DNAParticlesBackground
