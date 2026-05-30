import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float, Torus } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useStore } from '../store'
import { ParticleField, NeuralNetwork, CoreOrb } from '../components/Scene3D'
import PostFX from '../components/PostFX'

// Probability River - flowing particles
function ProbabilityRiver({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  const particles = useRef([])
  const meshRef = useRef()

  const actions = [
    { label: 'LEFT', prob: 0.15, color: '#22d3ee', y: 1.5 },
    { label: 'FORWARD', prob: 0.55, color: '#4ade80', y: 0.5 },
    { label: 'RIGHT', prob: 0.20, color: '#c084fc', y: -0.5 },
    { label: 'BACK', prob: 0.10, color: '#f472b6', y: -1.5 },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.userData.flow) {
          child.position.x += child.userData.speed
          if (child.position.x > 5) child.position.x = -5
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {actions.map((action, ai) => (
        <group key={ai}>
          {/* River tube */}
          <mesh position={[0, action.y, 0]}>
            <cylinderGeometry args={[action.prob * 0.8, action.prob * 0.8, 8, 16]} />
            <meshStandardMaterial
              color={action.color}
              emissive={action.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Flowing particles */}
          {[...Array(Math.floor(action.prob * 20))].map((_, i) => (
            <FlowParticle
              key={i}
              startX={(Math.random() - 0.5) * 8}
              y={action.y + (Math.random() - 0.5) * action.prob * 0.5}
              speed={0.02 + Math.random() * 0.02}
              color={action.color}
              size={0.06}
            />
          ))}
          {/* Label */}
          <Text position={[5.5, action.y, 0]} fontSize={0.3} color={action.color} anchorX="left">
            {`${action.label} ${(action.prob * 100).toFixed(0)}%`}
          </Text>
        </group>
      ))}
      {/* Title */}
      <Text position={[0, 3, 0]} fontSize={0.45} color="#c084fc" anchorX="center">PROBABILITY RIVER</Text>
      <Text position={[0, 2.4, 0]} fontSize={0.25} color="#c084fc" anchorX="center">π(a|s)</Text>
    </group>
  )
}

function FlowParticle({ startX, y, speed, color, size }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += speed
      if (ref.current.position.x > 5) ref.current.position.x = -5
    }
  })
  return (
    <mesh ref={ref} position={[startX, y, 0]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  )
}

// Gradient Mountain
function GradientMountain({ position = [0, 0, 0] }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })
  return (
    <group ref={ref} position={position}>
      {/* Mountain tiers */}
      {[0, 1, 2, 3, 4].map(tier => (
        <mesh key={tier} position={[0, tier * 0.8 - 1.6, 0]}>
          <cylinderGeometry args={[(5 - tier) * 0.4, (5 - tier + 1) * 0.4, 0.7, 32]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#c084fc"
            emissiveIntensity={0.1 + tier * 0.1}
            transparent
            opacity={0.4 + tier * 0.1}
          />
        </mesh>
      ))}
      {/* Peak */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.3, 1, 32]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>
      {/* Climbing indicator */}
      <ClimbingDot />
      <Text position={[0, 4.2, 0]} fontSize={0.35} color="#c084fc" anchorX="center">GRADIENT ASCENT</Text>
      <Text position={[0, 3.7, 0]} fontSize={0.22} color="#c084fc" anchorX="center">∇θ J(θ)</Text>
    </group>
  )
}

function ClimbingDot() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime % 4) / 4
      ref.current.position.y = t * 3.5 - 1.8
      ref.current.position.x = Math.sin(t * Math.PI * 4) * 0.3
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
    </mesh>
  )
}

function PolicyScene() {
  return (
    <>
      <color attach="background" args={['#050010']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#c084fc" distance={25} />
      <pointLight position={[-8, 0, 0]} intensity={1} color="#7e22ce" distance={20} />
      <pointLight position={[8, 0, 0]} intensity={1} color="#f472b6" distance={20} />

      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
      <ParticleField count={400} color="#c084fc" spread={30} />

      {/* Policy Generator - Neural Network */}
      <group position={[-7, 0, 0]}>
        <Float speed={0.5}>
          <NeuralNetwork position={[0, 0, 0]} layers={[3, 5, 5, 4]} />
        </Float>
        <Text position={[0, -4, 0]} fontSize={0.4} color="#c084fc" anchorX="center">POLICY GENERATOR</Text>
        <Text position={[0, -4.6, 0]} fontSize={0.25} color="#c084fc" anchorX="center">π(a|s) — outputs probabilities</Text>
      </group>

      {/* Probability River */}
      <ProbabilityRiver position={[1, 0, 0]} />

      {/* Gradient Mountain */}
      <GradientMountain position={[10, -1, -2]} />

      <OrbitControls enableZoom={true} enablePan={true} minDistance={3} maxDistance={30} />
      <PostFX intensity={1.4} />
    </>
  )
}

const POLICY_ZONES = {
  overview: {
    title: '🌊 Policy Network',
    color: '#c084fc',
    content: 'Instead of estimating Q-values, the policy network directly outputs a probability distribution over actions. Given state s, it learns π(a|s) — the probability of each action. This enables continuous action spaces and more natural exploration.',
    equation: 'π(a|s;θ) = softmax(f_θ(s))',
    concepts: ['policy', 'state', 'action']
  },
  river: {
    title: '🌊 Probability River',
    color: '#22d3ee',
    content: 'Each stream represents one possible action. The width and flow density encode probability. The policy samples from this distribution — thicker streams get selected more often. Entropy measures the spread of the distribution.',
    equation: 'a ~ π(·|s) : sample from distribution',
    concepts: ['policy', 'exploration', 'action']
  },
  temple: {
    title: '🎭 Policy Generator',
    color: '#c084fc',
    content: 'The neural network takes the state as input and outputs logits for each action. A softmax layer converts logits to probabilities summing to 1. Stochastic sampling enables natural exploration without an explicit ε parameter.',
    equation: 'p(a) = exp(z_a) / Σ exp(z_i)',
    concepts: ['policy', 'neural networks', 'state']
  },
  gradient: {
    title: '📈 Policy Gradient',
    color: '#f472b6',
    content: 'The policy improves by gradient ascent on expected return. Actions that led to high rewards get higher probability. REINFORCE algorithm: multiply the log probability of each action by the received return and take gradient steps.',
    equation: '∇θ J(θ) = E[∇θ log π(a|s) · R]',
    concepts: ['gradient', 'reward', 'policy']
  }
}

export default function PolicyWorld() {
  const { setGuide, addConcept, setWorld } = useStore()
  const [activeZone, setActiveZone] = useState('overview')
  const [probs, setProbs] = useState([0.15, 0.55, 0.20, 0.10])
  const zone = POLICY_ZONES[activeZone]

  // Animate probabilities
  useEffect(() => {
    const interval = setInterval(() => {
      const raw = probs.map(p => Math.max(0.05, p + (Math.random() - 0.5) * 0.1))
      const sum = raw.reduce((a, b) => a + b, 0)
      setProbs(raw.map(p => p / sum))
    }, 1200)
    return () => clearInterval(interval)
  }, [probs])

  const handleZone = (zoneId) => {
    setActiveZone(zoneId)
    const z = POLICY_ZONES[zoneId]
    z.concepts.forEach(c => addConcept(c))
    setGuide(`${z.title}: ${z.content.slice(0, 120)}...`)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 2, 14], fov: 65 }}>
        <Suspense fallback={null}>
          <PolicyScene />
        </Suspense>
      </Canvas>

      {/* Zone info panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="absolute top-20 left-6 z-20 max-w-xs hud-border rounded p-4"
          style={{ borderColor: zone.color + '40' }}
        >
          <h3 className="font-orbitron text-sm font-bold mb-2" style={{ color: zone.color }}>{zone.title}</h3>
          <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-3 opacity-80">{zone.content}</p>
          <div className="rounded p-2 mb-2" style={{ background: zone.color + '10', border: `1px solid ${zone.color}20` }}>
            <div className="font-mono-tech text-xs" style={{ color: zone.color }}>{zone.equation}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Live policy distribution */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-6 z-20 hud-border rounded p-4 w-52"
        style={{ borderColor: 'rgba(192,132,252,0.3)' }}
      >
        <div className="font-orbitron text-xs text-purple-400 mb-3 tracking-widest">POLICY LIVE π(a|s)</div>
        {['Left', 'Forward', 'Right', 'Back'].map((action, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between font-mono-tech text-xs mb-0.5">
              <span className="text-gray-400">{action}</span>
              <span className="text-purple-400">{(probs[i] * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${probs[i] * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #c084fc, #7e22ce)` }}
              />
            </div>
          </div>
        ))}
        <div className="mt-2 font-mono-tech text-xs text-gray-600">
          Entropy: {(-probs.reduce((acc, p) => acc + (p > 0 ? p * Math.log(p) : 0), 0)).toFixed(3)}
        </div>
      </motion.div>

      {/* Zone navigation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center px-4 z-20"
      >
        <div className="hud-border rounded p-3 flex gap-2 flex-wrap justify-center" style={{ borderColor: 'rgba(192,132,252,0.2)' }}>
          <div className="w-full text-center font-orbitron text-xs text-purple-600 mb-2 tracking-widest">POLICY NETWORK ZONES</div>
          {[
            { id: 'overview', label: 'Overview', icon: '🌊' },
            { id: 'river', label: 'Prob River', icon: '🌀' },
            { id: 'temple', label: 'Policy Generator', icon: '🎭' },
            { id: 'gradient', label: 'Gradient Ascent', icon: '📈' },
          ].map(z => (
            <button
              key={z.id}
              onClick={() => handleZone(z.id)}
              className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 font-mono-tech text-xs"
              style={{
                background: activeZone === z.id ? 'rgba(192,132,252,0.2)' : 'rgba(192,132,252,0.05)',
                border: `1px solid ${activeZone === z.id ? 'rgba(192,132,252,0.6)' : 'rgba(192,132,252,0.15)'}`,
                color: activeZone === z.id ? '#c084fc' : '#6b7280',
              }}
            >
              <span>{z.icon}</span>
              <span>{z.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-purple-700 hover:text-purple-400 transition-colors">
        ← Return to RL Core
      </button>
    </div>
  )
}
