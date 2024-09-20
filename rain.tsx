import React, { useRef, useEffect, useState } from 'react'

interface Raindrop {
  x: number
  y: number
  length: number
  speed: number
}

interface Puddle {
  x: number
  y: number
  radius: number
  ripples: number[]
}

const RainyDayBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let raindrops: Raindrop[] = []
    let puddles: Puddle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initRaindrops()
      initPuddles()
    }

    const initRaindrops = () => {
      raindrops = []
      const raindropCount = Math.floor(canvas.width / 5)
      for (let i = 0; i < raindropCount; i++) {
        raindrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 10 + 5
        })
      }
    }

    const initPuddles = () => {
      puddles = []
      const puddleCount = Math.floor(canvas.width / 100)
      for (let i = 0; i < puddleCount; i++) {
        puddles.push({
          x: Math.random() * canvas.width,
          y: canvas.height - Math.random() * 100,
          radius: Math.random() * 30 + 20,
          ripples: []
        })
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawRaindrop = (raindrop: Raindrop) => {
      ctx.beginPath()
      ctx.moveTo(raindrop.x, raindrop.y)
      ctx.lineTo(raindrop.x, raindrop.y + raindrop.length)
      ctx.strokeStyle = isDarkMode ? 'rgba(200, 200, 255, 0.5)' : 'rgba(100, 100, 200, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    const updateRaindrop = (raindrop: Raindrop) => {
      raindrop.y += raindrop.speed
      if (raindrop.y > canvas.height) {
        raindrop.y = -raindrop.length
        raindrop.x = Math.random() * canvas.width
      }
    }

    const drawPuddle = (puddle: Puddle) => {
      ctx.beginPath()
      ctx.arc(puddle.x, puddle.y, puddle.radius, 0, Math.PI * 2)
      ctx.fillStyle = isDarkMode ? 'rgba(100, 100, 200, 0.3)' : 'rgba(200, 200, 255, 0.3)'
      ctx.fill()

      puddle.ripples.forEach((ripple, index) => {
        ctx.beginPath()
        ctx.arc(puddle.x, puddle.y, ripple, 0, Math.PI * 2)
        ctx.strokeStyle = isDarkMode ? 'rgba(200, 200, 255, 0.5)' : 'rgba(100, 100, 200, 0.5)'
        ctx.lineWidth = 1
        ctx.stroke()

        puddle.ripples[index] += 0.5
        if (puddle.ripples[index] > puddle.radius) {
          puddle.ripples.splice(index, 1)
        }
      })

      if (Math.random() < 0.1) {
        puddle.ripples.push(0)
      }
    }

    const drawClouds = () => {
      ctx.fillStyle = isDarkMode ? 'rgba(50, 50, 70, 0.5)' : 'rgba(200, 200, 220, 0.5)'
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(canvas.width * (i / 5 + 0.1), 100, 50, 0, Math.PI * 2)
        ctx.arc(canvas.width * (i / 5), 120, 70, 0, Math.PI * 2)
        ctx.arc(canvas.width * (i / 5 + 0.2), 110, 60, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 20, 0.1)' : 'rgba(240, 240, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawClouds()

      raindrops.forEach(raindrop => {
        drawRaindrop(raindrop)
        updateRaindrop(raindrop)
      })

      puddles.forEach(puddle => {
        drawPuddle(puddle)
      })

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

export default RainyDayBackground
