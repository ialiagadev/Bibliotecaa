import React, { useRef, useEffect, useState } from 'react'

interface Wave {
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
  color: string
  opacity: number
}

const SlowEnergyWavesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let waves: Wave[] = []
    let hue = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createWave = (): Wave => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0,
      maxRadius: Math.random() * 200 + 100,
      speed: Math.random() * 0.5 + 0.1, // Reduced speed
      color: `hsla(${hue}, 100%, ${isDarkMode ? 70 : 50}%, 1)`,
      opacity: 1
    })

    const initWaves = () => {
      waves = []
      for (let i = 0; i < 3; i++) { // Reduced initial number of waves
        waves.push(createWave())
      }
    }

    resizeCanvas()
    initWaves()
    window.addEventListener('resize', () => {
      resizeCanvas()
      initWaves()
    })

    const drawWave = (wave: Wave) => {
      ctx.beginPath()
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
      ctx.strokeStyle = wave.color.replace('1)', `${wave.opacity})`)
      ctx.lineWidth = 2
      ctx.stroke()
    }

    const updateWave = (wave: Wave) => {
      wave.radius += wave.speed
      wave.opacity = Math.max(0, 1 - (wave.radius / wave.maxRadius))
      if (wave.radius > wave.maxRadius) {
        Object.assign(wave, createWave())
      }
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? 'rgba(10, 20, 30, 0.1)' : 'rgba(240, 250, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      waves.forEach(wave => {
        drawWave(wave)
        updateWave(wave)
      })

      // Occasionally add new waves, but less frequently
      if (Math.random() < 0.005 && waves.length < 10) {
        waves.push(createWave())
      }

      hue = (hue + 0.1) % 360 // Slower color change
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
        {isDarkMode ? "🌙" : "☀️"}
      </button>
    </div>
  )
}

export default SlowEnergyWavesBackground
