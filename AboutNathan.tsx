import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Sparkles, TrendingUp, Bitcoin, Users, Award, Sun, Moon } from 'lucide-react'

const StarField = ({ isDarkMode }) => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const stars = Array(200).fill().map(() => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }))

    let animationFrameId

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      ctx.fillStyle = isDarkMode ? 'white' : '#333'
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        star.y += star.speed
        if (star.y > dimensions.height) {
          star.y = 0
          star.x = Math.random() * dimensions.width
        }
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, isDarkMode])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 pointer-events-none"
      style={{ transform: 'translateZ(0)' }}
    />
  )
}

export default function Component() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const controls = useAnimation()
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    controls.start({
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: 'loop',
      },
    })
  }, [controls])

  const stats = [
    { icon: TrendingUp, value: '6+', label: 'Años de Trayectoria' },
    { icon: Bitcoin, value: '4', label: 'Años en Criptoactivos' },
    { icon: Users, value: '10k+', label: 'Inversores Satisfechos' },
    { icon: Award, value: '100+', label: 'Estrategias Exitosas' },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}>
      <StarField isDarkMode={isDarkMode} />
      <motion.div
        className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-90'} backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl relative z-10`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="h-64 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 p-8 flex items-end relative"
          animate={controls}
          style={{ backgroundSize: '200% 200%' }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white font-serif relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
            Visionario en Finanzas y Criptoactivos
          </h1>
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors duration-200"
            aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </motion.div>
        <div className={`p-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          <p className="text-xl mb-6">
            Como experto en finanzas corporativas y análisis financiero avanzado, he forjado mi carrera en la vanguardia 
            de la innovación financiera. Mi especialización en inversiones de alto rendimiento y criptoactivos me ha 
            permitido navegar con éxito incluso en los mercados más volátiles, generando retornos consistentes.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`flex items-center space-x-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} bg-opacity-50 rounded-lg p-4 cursor-pointer relative overflow-hidden`}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="z-10 flex items-center space-x-4">
                  <stat.icon size={24} className={isDarkMode ? "text-orange-400" : "text-orange-600"} />
                  <div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-75"
                  initial={{ x: '-100%' }}
                  animate={hoveredIndex === index ? { x: 0 } : { x: '-100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-lg mb-6">
            A lo largo de los últimos años, he compartido mis insights y estrategias de inversión de vanguardia, 
            construyendo una comunidad basada en la transparencia y los resultados tangibles. Mi misión es empoderar 
            a inversores ambiciosos con conocimientos de élite y estrategias probadas, permitiéndoles alcanzar la 
            libertad financiera en la era digital.
          </p>
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-6 rounded-full 
                       shadow-lg hover:shadow-xl transition duration-300 flex items-center space-x-2 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Sparkles size={20} />
              <span>Inicia tu Transformación Financiera</span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </motion.div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  )
}
