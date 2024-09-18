"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['200', '400', '700'],
})

const FinancialNetwork = () => {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const nodesRef = useRef([])

  const createNodes = useCallback((width, height) => {
    const nodeCount = 100
    return Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))
  }, [])

  const drawNodes = useCallback((ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(255, 165, 0, 0.5)'
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.2)'

    const maxDistance = 100

    nodesRef.current.forEach((node, i) => {
      node.x += node.vx
      node.y += node.vy

      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1

      ctx.beginPath()
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
      ctx.fill()

      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const otherNode = nodesRef.current[j]
        const dx = otherNode.x - node.x
        const dy = otherNode.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(otherNode.x, otherNode.y)
          ctx.stroke()
        }
      }

      const dx = mousePosition.x - node.x
      const dy = mousePosition.y - node.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance * 2) {
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(mousePosition.x, mousePosition.y)
        ctx.stroke()
      }
    })
  }, [mousePosition])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setDimensions({ width: canvas.width, height: canvas.height })
      nodesRef.current = createNodes(canvas.width, canvas.height)
    }

    resizeCanvas()

    let animationFrameId

    const animate = () => {
      drawNodes(ctx, canvas.width, canvas.height)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [createNodes, drawNodes])

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

const HeaderContent = ({ isMobile }) => {
  const headerRef = useRef(null)
  const isInView = useInView(headerRef)
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div ref={headerRef} className={`mt-8 text-center ${isMobile ? 'pt-16' : ''}`}>
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 text-white font-extralight"
        initial="hidden"
        animate={mainControls}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connecting <span className="font-bold">your</span>
      </motion.h1>

      <motion.p 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 text-white font-extralight"
        initial="hidden"
        animate={mainControls}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        financial <span className="font-bold">network</span>
      </motion.p>

      <motion.p 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 text-white font-extralight"
        initial="hidden"
        animate={mainControls}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        node by node
      </motion.p>

      <motion.div
        initial="hidden"
        animate={mainControls}
        variants={variants}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Link 
          href="/contact" 
          className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/30 transition-colors duration-300 text-white text-lg font-medium"
        >
          Join the Network
        </Link>
      </motion.div>
    </div>
  )
}

const NavItem = ({ href, children, isActive = false }) => (
  <Link 
    href={href} 
    className={`flex-1 py-3 px-2 text-center relative group ${isActive ? 'text-gray-300' : 'hover:text-gray-300'} transition-colors duration-300 ease-in-out`}
  >
    {children}
    <span className="absolute top-1/2 -right-[1px] h-4 w-[1px] bg-gradient-to-b from-transparent via-gray-600 to-transparent"></span>
  </Link>
)

const CallToAction = ({ href, children }) => (
  <Link 
    href={href} 
    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/30 transition-colors duration-300 flex items-center justify-center text-sm"
  >
    {children}
  </Link>
)

const CenteredTextGlossyNavbar = () => {
  const pathname = usePathname()

  return (
    <div className="flex justify-center items-center w-full">
      <nav className="h-12 w-full max-w-[500px] flex items-center justify-between px-4 bg-black/30 rounded-xl border border-white/20 relative overflow-hidden backdrop-blur-md shadow-lg">
        <div className="flex flex-1 space-x-4 text-white text-sm font-light relative z-10">
          <NavItem href="/" isActive={pathname === '/'}>Home</NavItem>
          <NavItem href="/about" isActive={pathname === '/about'}>About us</NavItem>
          <NavItem href="/partnership" isActive={pathname === '/partnership'}>Partnership</NavItem>
          <CallToAction href="/contact">Get in Touch</CallToAction>
        </div>
      </nav>
    </div>
  )
}

export default function Component() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className={`${raleway.className} relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-700 via-black to-black`}>
      <FinancialNetwork />
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      <div className="relative z-20 flex flex-col justify-between min-h-screen p-4">
        <HeaderContent isMobile={isMobile} />
        <CenteredTextGlossyNavbar />
      </div>
    </header>
  )
}
