import React, { useRef, useEffect, useState } from 'react'

const GeometricWavesBackground: React.FC = () => {
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

    const drawWave = (yOffset: number, amplitude: number, frequency: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)

      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin((x + time) * frequency) * amplitude + yOffset
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      ctx.fillStyle = color
      ctx.fill()
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? '#1a1a2e' : '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const baseColor = isDarkMode ? '255, 255, 255' : '0, 0, 0'

      drawWave(canvas.height * 0.8, 30, 0.02, `rgba(${baseColor}, 0.1)`)
      drawWave(canvas.height * 0.7, 40, 0.015, `rgba(${baseColor}, 0.15)`)
      drawWave(canvas.height * 0.6, 50, 0.01, `rgba(${baseColor}, 0.2)`)

      time += 0.05
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

export default GeometricWavesBackground
