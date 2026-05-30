import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float, Box, Cylinder } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useStore } from '../store'
import { ParticleField, NeuralNetwork, CoreOrb } from '../components/Scene3D'
import PostFX from '../components/PostFX'

// Clip ratio visualizer
function ClipRatioViz({ position = [0, 0, 0] }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })
  return (
    <group ref={ref} position={position}>
      {/* Clip region box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 1.5, 0.1]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.1} transparent opacity={0.15} />
      </mesh>
      {/* Clip bounds */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 1.2, 0, 0]}>
          <boxGeometry args={[0.04, 1.6, 0.2]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
        </mesh>
      ))}
      <Text position={[0, -1.2, 0]} fontSize={0.25} color="#fbbf24" anchorX="center">
        CLIP(r, 1-ε, 1+ε)  ε=0.2
      </Text>
      <Text position={[-1.2, 1.0, 0]} fontSize={0.18} color="#f472b6" anchorX="center">1-ε</Text>
      <Text position={[1.2, 1.0, 0]} fontSize={0.18} color="#f472b6" anchorX="center">1+ε</Text>
    </group>
  )
}

// Old vs New policy spheres
function PolicyComparison({ position = [0, 0, 0] }) {
  const oldRef = useRef()
  const newRef = useRef()
  const [ratio, setRatio] = useState(1.0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRatio(r => {
        const nr = Math.max(0.8, Math.min(1.3, r + (Math.random() - 0.5) * 0.1))
        return nr
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    if (oldRef.current) oldRef.current.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    if (newRef.current) newRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.15
  })

  const clipped = Math.max(0.8, Math.min(1.2, ratio))
  const inClip = Math.abs(ratio - 1.0) <= 0.2

  return (
    <group position={position}>
      {/* Old policy */}
      <mesh ref={oldRef} position={[-2.5, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#6b7280" emissive="#6b7280" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
      <Text position={[-2.5, -1.2, 0]} fontSize={0.2} color="#9ca3af" anchorX="center">π_old</Text>

      {/* New policy */}
      <mesh ref={newRef} position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.6 * ratio, 32, 32]} />
        <meshStandardMaterial color={inClip ? '#4ade80' : '#f87171'} emissive={inClip ? '#4ade80' : '#f87171'} emissiveIntensity={0.8} />
      </mesh>
      <Text position={[2.5, -1.5, 0]} fontSize={0.2} color={inClip ? '#4ade80' : '#f87171'} anchorX="center">
        π_new  r={ratio.toFixed(2)}
      </Text>
      <Text position={[2.5, -1.8, 0]} fontSize={0.16} color={inClip ? '#4ade80' : '#f87171'} anchorX="center">
        {inClip ? '✓ IN CLIP REGION' : '✗ CLIPPED'}
      </Text>

      {/* Ratio arrow */}
      <Text position={[0, 0.8, 0]} fontSize={0.22} color="#fbbf24" anchorX="center">
        r(θ) = π_new / π_old = {ratio.toFixed(3)}
      </Text>
    </group>
  )
}

function PPOScene() {
  return (
    <>
      <color attach="background" args={['#080005']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#fbbf24" distance={20} />
      <pointLight position={[-8, 0, 0]} intensity={1} color="#c084fc" distance={15} />
      <pointLight position={[8, 0, 0]} intensity={1} color="#4ade80" distance={15} />
      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
      <ParticleField count={350} color="#fbbf24" spread={28} />

      <Float speed={0.5} floatIntensity={0.3}>
        <NeuralNetwork position={[-6, 0, 0]} layers={[3, 5, 5, 3]} />
      </Float>

      <ClipRatioViz position={[1, 1, 0]} />
      <PolicyComparison position={[0, -2, 0]} />

      <Text position={[0, 4, 0]} fontSize={0.55} color="#fbbf24" anchorX="center" letterSpacing={0.2}>
        PPO WORLD
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.22} color="#fbbf24" anchorX="center">
        PROXIMAL POLICY OPTIMIZATION
      </Text>

      <OrbitControls enableZoom enablePan minDistance={4} maxDistance={28} />
      <PostFX intensity={1.4} />
    </>
  )
}

const PPO_ZONES = {
  overview: {
    title: '🛡️ PPO Overview',
    color: '#fbbf24',
    content: 'PPO (Proximal Policy Optimization) constrains policy updates using a clipped surrogate objective. This prevents catastrophically large updates that destabilize training — the key flaw of vanilla policy gradients.',
    eq: 'L_CLIP = E[min(r·A, clip(r,1-ε,1+ε)·A)]',
    concepts: ['policy', 'gradient', 'advantage']
  },
  clip: {
    title: '✂️ Clipping Mechanism',
    color: '#f472b6',
    content: 'The ratio r(θ) = π_new(a|s) / π_old(a|s) measures how much the policy changed. PPO clips this ratio into [1-ε, 1+ε] (typically ε=0.2), preventing over-optimistic gradient steps.',
    eq: 'r(θ) = π_θ(a|s) / π_θ_old(a|s)',
    concepts: ['policy', 'gradient']
  },
  trust: {
    title: '🔒 Trust Region',
    color: '#4ade80',
    content: 'PPO approximates TRPO\'s trust region constraint efficiently. Rather than solving a constrained optimization problem (TRPO), PPO clips the objective — achieving similar stability with much less computation.',
    eq: 'KL[π_old || π_new] ≤ δ (TRPO) vs CLIP (PPO)',
    concepts: ['policy', 'gradient', 'exploitation']
  },
  entropy: {
    title: '🌀 Entropy Regularization',
    color: '#c084fc',
    content: 'PPO adds an entropy bonus to prevent premature convergence. The combined loss: L = L_CLIP - c1·L_VF + c2·H(π), where L_VF is value function loss and H(π) encourages exploration.',
    eq: 'L_total = L_CLIP - c₁·L_VF + c₂·H(π)',
    concepts: ['entropy', 'exploration', 'critic']
  },
  epochs: {
    title: '🔁 Multiple Epochs',
    color: '#fbbf24',
    content: 'Unlike A2C (1 update per batch), PPO performs K epochs of minibatch updates on the same data. The clip ratio prevents the policy from drifting too far, making multiple epochs safe.',
    eq: 'K epochs × M minibatches per rollout',
    concepts: ['policy', 'gradient', 'replay']
  }
}

export default function PPOWorld() {
  const { setGuide, addConcept, setWorld } = useStore()
  const [activeZone, setActiveZone] = useState('overview')
  const [ratio, setRatio] = useState(1.0)
  const zone = PPO_ZONES[activeZone]

  useEffect(() => {
    const interval = setInterval(() => {
      setRatio(r => Math.max(0.75, Math.min(1.35, r + (Math.random() - 0.5) * 0.08)))
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const handleZone = (zId) => {
    setActiveZone(zId)
    const z = PPO_ZONES[zId]
    z.concepts.forEach(c => addConcept(c))
    setGuide(`${z.title}: ${z.content.slice(0, 130)}...`)
  }

  const inClip = Math.abs(ratio - 1.0) <= 0.2

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 3, 14], fov: 65 }}>
        <Suspense fallback={null}>
          <PPOScene />
        </Suspense>
      </Canvas>

      {/* Info panel */}
      <AnimatePresence mode="wait">
        <motion.div key={activeZone}
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          className="absolute top-20 left-5 z-20 max-w-xs hud-border rounded p-4"
          style={{ borderColor: zone.color + '40' }}>
          <h3 className="font-orbitron text-sm font-bold mb-2" style={{ color: zone.color }}>{zone.title}</h3>
          <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-3 opacity-80">{zone.content}</p>
          <div className="rounded p-2" style={{ background: zone.color + '10', border: `1px solid ${zone.color}20` }}>
            <div className="font-mono-tech text-xs" style={{ color: zone.color }}>{zone.eq}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Live ratio monitor */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-5 z-20 hud-border rounded p-4 w-52"
        style={{ borderColor: 'rgba(251,191,36,0.3)' }}>
        <div className="font-orbitron text-xs text-amber-400 mb-3 tracking-widest">LIVE PPO RATIO</div>

        {/* Ratio gauge */}
        <div className="mb-3">
          <div className="flex justify-between font-mono-tech text-xs mb-1">
            <span className="text-gray-400">r(θ) = π_new/π_old</span>
            <span style={{ color: inClip ? '#4ade80' : '#f87171' }}>{ratio.toFixed(3)}</span>
          </div>
          <div className="h-3 bg-gray-900 rounded-full overflow-hidden relative">
            {/* Clip region highlight */}
            <div className="absolute inset-y-0 bg-green-900 opacity-30"
              style={{ left: '30%', width: '40%' }} />
            {/* Ratio indicator */}
            <div className="h-full w-1 rounded transition-all duration-500"
              style={{ marginLeft: `${Math.max(0, Math.min(100, (ratio - 0.5) * 100))}%`,
                       background: inClip ? '#4ade80' : '#f87171' }} />
          </div>
          <div className="flex justify-between font-mono-tech text-xs mt-1 opacity-40">
            <span>0.5</span><span className="text-green-400">0.8—1.2</span><span>1.5</span>
          </div>
        </div>

        <div className={`rounded p-2 font-mono-tech text-xs text-center ${inClip ? 'text-green-400' : 'text-red-400'}`}
          style={{ background: inClip ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                   border: `1px solid ${inClip ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
          {inClip ? '✓ IN TRUST REGION' : '✗ UPDATE CLIPPED'}
        </div>

        <div className="mt-3 space-y-1">
          {['Actor Loss', 'Value Loss', 'Entropy'].map((label, i) => (
            <div key={label} className="flex justify-between font-mono-tech text-xs">
              <span className="text-gray-500">{label}</span>
              <span style={{ color: ['#f472b6', '#22d3ee', '#4ade80'][i] }}>
                {(Math.random() * 0.5 + 0.1).toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Zone navigation */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center px-4 z-20">
        <div className="hud-border rounded p-3 flex gap-2 flex-wrap justify-center"
          style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
          <div className="w-full text-center font-orbitron text-xs text-amber-600 mb-2 tracking-widest">PPO ZONES</div>
          {[
            { id: 'overview', label: '🛡️ Overview' },
            { id: 'clip', label: '✂️ Clipping' },
            { id: 'trust', label: '🔒 Trust Region' },
            { id: 'entropy', label: '🌀 Entropy Reg.' },
            { id: 'epochs', label: '🔁 Multi-Epoch' },
          ].map(z => (
            <button key={z.id} onClick={() => handleZone(z.id)}
              className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 font-mono-tech text-xs"
              style={{
                background: activeZone === z.id ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.05)',
                border: `1px solid ${activeZone === z.id ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.15)'}`,
                color: activeZone === z.id ? '#fbbf24' : '#6b7280'
              }}>
              {z.label}
            </button>
          ))}
        </div>
      </motion.div>

      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-amber-800 hover:text-amber-400 transition-colors">
        ← Return to RL Core
      </button>
    </div>
  )
}
