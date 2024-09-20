import React, { useRef, useEffect, useState } from 'react'

const GenerativeLandscapeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawStar = (x: number, y: number, size: number) => {
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawMountain = (x: number, height: number, width: number) => {
      ctx.beginPath()
      ctx.moveTo(x, canvas.height)
      ctx.lineTo(x + width / 2, canvas.height - height)
      ctx.lineTo(x + width, canvas.height)
      ctx.closePath()
      ctx.fill()
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? '#0f172a' : '#f0f9ff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      if (isDarkMode) {
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height * 0.7
          const size = Math.random() * 2
          drawStar(x, y, size)
        }
      }

      // Draw sun/moon
      const celestialBodyY = canvas.height * 0.2
      const celestialBodyRadius = canvas.width * 0.05
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.8, celestialBodyY, 0,
        canvas.width * 0.8, celestialBodyY, celestialBodyRadius
      )
      gradient.addColorStop(0, isDarkMode ? '#ffffff' : '#ffd700')
      gradient.addColorStop(1, isDarkMode ? '#ffffff00' : '#ffd70000')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(canvas.width * 0.8, celestialBodyY, celestialBodyRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw mountains
      for (let i = 0; i < 5; i++) {
        const mountainWidth = canvas.width / 2
        const mountainHeight = canvas.height * (0.3 + i * 0.1)
        const x = (i * mountainWidth / 2) + Math.sin(time * 0.001 + i) * 50
        ctx.fillStyle = isDarkMode 
          ? `hsl(220, 50%, ${10 + i * 5}%)`
          : `hsl(200, 60%, ${70 - i * 10}%)`
        drawMountain(x, mountainHeight, mountainWidth)
      }

      // Draw foreground
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#bae6fd'
      ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2)

      time++
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

export default GenerativeLandscapeBackground
