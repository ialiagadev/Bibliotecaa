"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef, useState, useMemo } from "react"
import { Mesh, Vector3, Color } from "three"
import { Text, OrbitControls, useTexture, Stars } from "@react-three/drei"
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing"

function Planet({ position, name, description, color, size }: { position: [number, number, number], name: string, description: string, color: string, size: number }) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const { camera } = useThree()

  useFrame((state) => {
    meshRef.current.rotation.y += 0.01
    if (active) {
      const targetPosition = new Vector3(...position).add(new Vector3(0, 0, size + 2))
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(...position)
    }
  })

  return (
    <group>
      <mesh
        position={position}
        ref={meshRef}
        scale={active ? 1.2 : 1}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : color} />
      </mesh>
      <Text
        position={[position[0], position[1] + size + 0.5, position[2]]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      {active && (
        <Text
          position={[position[0], position[1] - size - 0.5, position[2]]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {description}
        </Text>
      )}
    </group>
  )
}

function FinancialUniverse() {
  const planets = useMemo(() => [
    { name: "Ahorro", description: "La base de tu salud financiera. Aprende a guardar para el futuro.", color: "#4CAF50", size: 1, position: [0, 0, 0] },
    { name: "Inversión", description: "Haz crecer tu dinero. Descubre diferentes estrategias de inversión.", color: "#FFC107", size: 0.8, position: [3, 1, -2] },
    { name: "Presupuesto", description: "Controla tus gastos. La clave para alcanzar tus metas financieras.", color: "#2196F3", size: 0.7, position: [-2.5, -1, -1] },
    { name: "Deuda", description: "Maneja tus deudas sabiamente. Aprende estrategias para reducirlas.", color: "#F44336", size: 0.6, position: [1.5, -2, 1] },
    { name: "Retiro", description: "Planifica para tu futuro. Asegura un retiro cómodo y seguro.", color: "#9C27B0", size: 0.9, position: [-1, 2, -3] },
  ], [])

  return (
    <group>
      {planets.map((planet, index) => (
        <Planet key={index} {...planet} position={planet.position as [number, number, number]} />
      ))}
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<Mesh>(null!)
  const count = 500
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = Math.random()
    }
    return [positions, colors]
  }, [])

  useFrame(() => {
    particlesRef.current.rotation.x += 0.0005
    particlesRef.current.rotation.y += 0.0005
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} vertexColors />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingParticles />
      <FinancialUniverse />
    </>
  )
}

export default function FinancialUniverseHero() {
  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Scene />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        </EffectComposer>
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white pointer-events-none">
        <h1 className="text-5xl font-bold mb-4">Universo Financiero</h1>
        <p className="text-xl mb-8 max-w-2xl text-center">
          Explora los planetas de las finanzas personales y descubre cómo construir un futuro financiero sólido.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 pointer-events-auto">
          Inicia Tu Viaje Financiero
        </button>
      </div>
    </div>
  )
}
