import { useState } from 'react'
import { Zap, Star, Sparkles } from 'lucide-react'

export default function Component() {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 p-8 bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen">
      {/* Enhanced LED Outline Button */}
      <button className="relative px-6 py-3 bg-gray-800 text-white font-bold rounded-lg overflow-hidden group">
        <span className="relative z-10">Enhanced LED</span>
        <span className="absolute inset-0 border-2 border-blue-400 rounded-lg"></span>
        <span className="absolute w-4 h-4 bg-blue-400 rounded-full blur-sm animate-led-movement"></span>
        <span className="absolute w-4 h-4 bg-blue-400 rounded-full blur-sm animate-led-movement-delay"></span>
        <span className="absolute w-4 h-4 bg-blue-400 rounded-full blur-sm animate-led-movement-delay-2"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      </button>

      {/* Other buttons remain unchanged */}
      {/* Neon Pulse Button */}
      <button
        className="relative px-6 py-3 font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 overflow-hidden group"
        onMouseEnter={() => setHoveredButton(1)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span className="relative z-10">Neon Pulse</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Zap className="w-6 h-6 text-yellow-300" />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-75 animate-pulse transition-opacity duration-300"></span>
      </button>

      {/* Morphing Shape Button */}
      <button
        className={`relative w-40 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold overflow-hidden transition-all duration-500 ease-in-out ${
          hoveredButton === 2 ? 'rounded-[28%_72%_70%_30%/30%_30%_70%_70%]' : 'rounded-lg'
        }`}
        onMouseEnter={() => setHoveredButton(2)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span className="relative z-10">Morphing Shape</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Star className="w-6 h-6 text-yellow-300" />
        </span>
      </button>

      {/* 3D Flip Button */}
      <button
        className="group perspective"
        onMouseEnter={() => setHoveredButton(3)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <div className={`relative w-40 h-16 transition-all duration-500 ${
          hoveredButton === 3 ? '[transform:rotateX(180deg)]' : ''
        }`}>
          <div className="absolute inset-0 bg-orange-400 text-white font-bold flex items-center justify-center rounded-lg [backface-visibility:hidden]">
            3D Flip
          </div>
          <div className="absolute inset-0 bg-red-500 text-white font-bold flex items-center justify-center rounded-lg [transform:rotateX(180deg)] [backface-visibility:hidden]">
            Flipped!
          </div>
        </div>
      </button>

      {/* Particle Explosion Button */}
      <button
        className="relative px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg overflow-hidden group"
        onMouseEnter={() => setHoveredButton(4)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <span className="relative z-10">Particle Burst</span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </span>
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className={`absolute w-1 h-1 bg-yellow-300 rounded-full transition-all duration-700 ${
              hoveredButton === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: hoveredButton === 4 ? `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)` : 'none'
            }}
          ></span>
        ))}
      </button>
    </div>
  )
}
