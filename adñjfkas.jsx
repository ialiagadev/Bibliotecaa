'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import * as THREE from 'three'
import Link from 'next/link'
import { Raleway } from 'next/font/google'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['200', '400', '700'],  // 200 for Extra Light, 400 for Regular, 700 for Bold
})

export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef)
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)

    const geometry = new THREE.SphereGeometry(1.5, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    camera.position.z = 5
    sphere.position.y = -1
    sphere.position.x = 0

    const animate = () => {
      requestAnimationFrame(animate)
      sphere.rotation.x += 0.001
      sphere.rotation.y += 0.001
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <header ref={headerRef} className={`${raleway.className} relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-700 via-black to-black`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-400 via-orange-900 to-transparent opacity-50"></div>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex flex-col justify-between min-h-screen p-4">
        <div className="mt-8 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl mb-4 text-white font-extralight"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Building <span className="font-bold">your</span>
          </motion.h1>

          <motion.p 
            className="text-3xl sm:text-4xl md:text-5xl mb-4 text-white font-extralight"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            financial <span className="font-bold">future</span>
          </motion.p>

          <motion.p 
            className="text-3xl sm:text-4xl md:text-5xl mb-8 text-white font-extralight"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            decision by decision
          </motion.p>
        </div>
        
        <CenteredTextGlossyNavbar />
      </div>
    </header>
  )
}

function CenteredTextGlossyNavbar() {
  return (
    <div className="flex justify-center items-center w-full">
      <nav className="h-12 w-full max-w-[500px] flex items-center justify-between px-4 bg-black/30 rounded-xl border border-white/20 relative overflow-hidden backdrop-blur-md shadow-lg">
        <div className="flex flex-1 space-x-4 text-white text-sm font-light relative z-10">
          <NavItem href="/" isActive>Home</NavItem>
          <NavItem href="/about">About us</NavItem>
          <NavItem href="/partnership">Partnership</NavItem>
          <CallToAction href="/contact">Get in Touch</CallToAction>
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, children, isActive = false }) {
  return (
    <Link 
      href={href} 
      className={`flex-1 py-3 px-2 text-center relative group ${isActive ? 'text-gray-300' : 'hover:text-gray-300'} transition-colors duration-300 ease-in-out`}
    >
      {children}
      <span className="absolute top-1/2 -right-[1px] h-4 w-[1px] bg-gradient-to-b from-transparent via-gray-600 to-transparent"></span>
    </Link>
  )
}

function CallToAction({ href, children }) {
  return (
    <Link 
      href={href} 
      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full shadow-md hover:bg-white/30 transition-colors duration-300 flex items-center justify-center text-sm"
    >
      {children}
    </Link>
  )
}
