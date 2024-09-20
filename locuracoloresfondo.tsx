import React, { useRef, useEffect, useState } from 'react'

interface Tile {
  x: number
  y: number
  size: number
  color: string
  targetColor: string
  rotation: number
  targetRotation: number
}

const FluidMosaicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let tiles: Tile[] = []
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initTiles()
    }

    const initTiles = () => {
      tiles = []
      const tileSize = 100
      const columns = Math.ceil(canvas.width / tileSize)
      const rows = Math.ceil(canvas.height / tileSize)

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          tiles.push({
            x: i * tileSize,
            y: j * tileSize,
            size: tileSize,
            color: getRandomColor(),
            targetColor: getRandomColor(),
            rotation: 0,
            targetRotation: Math.random() * Math.PI * 2
          })
        }
      }
    }

    const getRandomColor = () => {
      const hue = Math.random() * 360
      return `hsl(${hue}, 70%, ${isDarkMode ? '30%' : '70%'})`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawTile = (tile: Tile) => {
      ctx.save()
      ctx.translate(tile.x + tile.size / 2, tile.y + tile.size / 2)
      ctx.rotate(tile.rotation)
      ctx.beginPath()
      ctx.rect(-tile.size / 2, -tile.size / 2, tile.size, tile.size)
      ctx.fillStyle = tile.color
      ctx.fill()
      ctx.restore()
    }

    const updateTile = (tile: Tile) => {
      // Interpolate color
      const currentColor = tile.color.match(/\d+/g)?.map(Number) || []
      const targetColor = tile.targetColor.match(/\d+/g)?.map(Number) || []
      const newColor = currentColor.map((c, i) => {
        return Math.round(c + (targetColor[i] - c) * 0.05)
      })
      tile.color = `hsl(${newColor[0]}, ${newColor[1]}%, ${newColor[2]}%)`

      // Interpolate rotation
      tile.rotation += (tile.targetRotation - tile.rotation) * 0.05

      // Update target values periodically
      if (Math.random() < 0.01) {
        tile.targetColor = getRandomColor()
        tile.targetRotation = Math.random() * Math.PI * 2
      }
    }

    const animate = () => {
      ctx.fillStyle = isDarkMode ? '#1a1a2e' : '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      tiles.forEach(tile => {
        updateTile(tile)
        drawTile(tile)
      })

      time += 0.01
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

export default FluidMosaicBackground
