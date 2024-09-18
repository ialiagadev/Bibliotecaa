"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import { Mesh, Vector3 } from "three"
import { Text3D, OrbitControls, useTexture } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

function ParticleField() {
  const particlesRef = useRef<Mesh>(null!)
  const count = 5000
  const [positions, setPositions] = useState(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  })

  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3 + 1] -= 0.01
      if (positions[i3 + 1] < -5) {
        positions[i3 + 1] = 5
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#4a90e2" sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function CoinModel() {
  const meshRef = useRef<Mesh>(null!)
  const texture = useTexture("/placeholder.svg?height=200&width=200")

  useFrame((state) => {
    meshRef.current.rotation.y += 0.005
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.2, 32]} />
      <meshStandardMaterial map={texture} color="#ffd700" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function AnimatedText() {
  const textRef = useRef<Mesh>(null!)

  useFrame((state) => {
    textRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1
  })

  return (
    <Text3D
      ref={textRef}
      font="/fonts/Inter_Bold.json"
      size={0.5}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.01}
      bevelSize={0.01}
      bevelOffset={0}
      bevelSegments={5}
      position={[-2.5, 0, 0]}
    >
      Finanzas Inteligentes
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
    </Text3D>
  )
}

function Scene() {
  return (
    <>
      <ParticleField />
      <CoinModel />
      <AnimatedText />
    </>
  )
}

export default function FinancialHero() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Scene />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold mb-4">Asesoramiento Financiero</h1>
        <p className="text-xl mb-8 max-w-2xl text-center">
          Optimiza tu futuro financiero con nuestros expertos asesores. Soluciones personalizadas para tus metas únicas.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
          Consulta Gratuita
        </button>
      </div>
    </div>
  )
}
