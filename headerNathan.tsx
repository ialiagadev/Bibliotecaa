"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import * as THREE from 'three'

export default function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef)
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
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
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    camera.position.z = 5

    // Adjust the sphere's position to be slightly lower
    sphere.position.y = -1

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
    }
  }, [])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <header ref={headerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-4">
        <div className="mt-16 text-center">
          <motion.h1 
            className="text-6xl sm:text-8xl font-bold mb-6"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Innovate
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl mb-12 max-w-2xl"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Push the boundaries of digital experiences
          </motion.p>
          
          <motion.div
            className="group relative inline-block"
            initial="hidden"
            animate={mainControls}
            variants={variants}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="relative z-10 block px-8 py-3 bg-white text-black font-bold rounded-full">
              Explore Now
            </span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full filter blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" 
                  style={{
                    transform: `translate(${(mousePosition.x - window.innerWidth / 2) / 50}px, ${(mousePosition.y - window.innerHeight / 2) / 50}px)`
                  }}
            />
          </motion.div>
        </div>
        
        <nav className="mb-8">
          <ul className="flex space-x-6">
            {['Home', 'About', 'Projects', 'Contact'].map((item, index) => (
              <motion.li key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={mainControls}
                variants={variants}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <a href="#" className="text-sm hover:text-gray-300 transition-colors duration-300">{item}</a>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
