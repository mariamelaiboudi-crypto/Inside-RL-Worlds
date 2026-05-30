import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float, Box } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useStore } from '../store'
import { ParticleField } from '../components/Scene3D'
import PostFX from '../components/PostFX'

function GridWorld({ position = [0, 0, 0] }) {
  const [agentPos, setAgentPos] = useState([0, 0])
  const grid = 5
  const goal = [4, 4]
  const obstacles = [[1,1],[2,3],[3,1]]

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentPos(p => {
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
        const d = dirs[Math.floor(Math.random() * 4)]
        const nx = Math.max(0, Math.min(grid-1, p[0]+d[0]))
        const ny = Math.max(0, Math.min(grid-1, p[1]+d[1]))
        return [nx, ny]
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const cells = []
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      const isGoal = x === goal[0] && y === goal[1]
      const isObs = obstacles.some(o => o[0]===x && o[1]===y)
      const isAgent = x === agentPos[0] && y === agentPos[1]
      const cx = position[0] + (x - grid/2 + 0.5) * 1.2
      const cy = position[1]
      const cz = position[2] + (y - grid/2 + 0.5) * 1.2

      let color = '#1f2937'
      if (isObs) color = '#dc2626'
      if (isGoal) color = '#4ade80'

      cells.push(
        <group key={`${x}-${y}`} position={[cx, cy, cz]}>
          <Box args={[1, 0.1, 1]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isGoal ? 0.5 : 0.1} />
          </Box>
          {isAgent && (
            <Float speed={3} floatIntensity={0.3}>
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
              </mesh>
            </Float>
          )}
        </group>
      )
    }
  }

  return (
    <group>
      {cells}
      <Text position={[0, -4, 0]} fontSize={0.3} color="#4ade80" anchorX="center">
        GRIDWORLD — MDP Environment
      </Text>
    </group>
  )
}

function EnvScene() {
  return (
    <>
      <color attach="background" args={['#001500']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#4ade80" distance={20} />
      <pointLight position={[5, 2, 5]} intensity={1} color="#22d3ee" distance={15} />
      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
      <ParticleField count={300} color="#4ade80" spread={25} />
      <GridWorld position={[0, 0, 0]} />
      <OrbitControls enableZoom={true} enablePan={true} minDistance={5} maxDistance={25} />
      <PostFX intensity={1.2} />
    </>
  )
}

export default function EnvironmentWorld() {
  const { setGuide, addConcept, setWorld } = useStore()

  useEffect(() => {
    addConcept('state')
    addConcept('reward')
    addConcept('MDP')
  }, [])

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 8, 8], fov: 65 }}>
        <Suspense fallback={null}>
          <EnvScene />
        </Suspense>
      </Canvas>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 left-6 z-20 max-w-xs hud-border rounded p-4"
        style={{ borderColor: 'rgba(74,222,128,0.4)' }}>
        <h3 className="font-orbitron text-sm font-bold mb-2 text-green-400">🌍 GridWorld Environment</h3>
        <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-3 opacity-80">
          The environment is a Markov Decision Process. The yellow agent navigates the grid, avoiding red obstacles and seeking the green goal. Each step yields a reward signal.
        </p>
        <div className="rounded p-2" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <div className="font-mono-tech text-xs text-green-400">MDP = (S, A, P, R, γ)</div>
        </div>
        <div className="mt-3 space-y-1">
          {[
            { label: '🟡 Agent', desc: 'Exploring environment' },
            { label: '🟢 Goal', desc: 'r = +1.0' },
            { label: '🔴 Obstacle', desc: 'r = −1.0' },
            { label: '⬛ Free', desc: 'r = −0.01' },
          ].map(i => (
            <div key={i.label} className="flex justify-between font-mono-tech text-xs">
              <span className="text-gray-400">{i.label}</span>
              <span className="text-green-400">{i.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-green-800 hover:text-green-400 transition-colors">← Return to RL Core</button>
    </div>
  )
}
