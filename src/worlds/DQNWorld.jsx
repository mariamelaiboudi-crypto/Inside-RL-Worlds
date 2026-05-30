import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float, Box, Cylinder, Sphere } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { ParticleField, NeuralNetwork, QValueBars, CoreOrb } from '../components/Scene3D'
import PostFX from '../components/PostFX'

// Replay Memory floating capsules
function MemoryCapsule({ position, color, onClick }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
    }
  })
  return (
    <group ref={ref} position={position} scale={hovered ? 1.2 : 1}
      onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Cylinder args={[0.2, 0.2, 0.5, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.5 : 0.8} transparent opacity={0.8} />
      </Cylinder>
    </group>
  )
}

// DQN Scene
function DQNScene({ onZoneClick }) {
  const [qValues, setQValues] = useState([0.7, 0.3, 0.85, 0.45])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQValues(qValues.map(v => Math.max(0.1, Math.min(1, v + (Math.random() - 0.5) * 0.2))))
    }, 1500)
    return () => clearInterval(interval)
  }, [qValues])

  return (
    <>
      <color attach="background" args={['#000a10']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#22d3ee" distance={25} />
      <pointLight position={[-8, 0, 0]} intensity={1} color="#0ea5e9" distance={20} />
      <pointLight position={[8, -2, 0]} intensity={1} color="#4ade80" distance={20} />

      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
      <ParticleField count={400} color="#22d3ee" spread={30} />

      {/* === NEURAL NETWORK TUNNEL === */}
      <group position={[-6, 0, 0]}>
        <Float speed={0.5} rotationIntensity={0.1}>
          <NeuralNetwork position={[0, 0, 0]} layers={[4, 8, 8, 4]} />
        </Float>
        <Text position={[0, -4, 0]} fontSize={0.4} color="#22d3ee" anchorX="center">
          NEURAL NETWORK
        </Text>
        <Text position={[0, -4.6, 0]} fontSize={0.25} color="#22d3ee" anchorX="center">
          State → Q-Values
        </Text>
      </group>

      {/* === Q-VALUE REACTOR === */}
      <group position={[2, 0, 0]}>
        <QValueBars values={qValues} position={[0, 0, 0]} />
        <Text position={[0, -3, 0]} fontSize={0.35} color="#fbbf24" anchorX="center">
          Q-VALUE REACTOR
        </Text>
        <Text position={[0, -3.6, 0]} fontSize={0.22} color="#fbbf24" anchorX="center">
          Q(s,a) = R + γ·max Q(s',a')
        </Text>
      </group>

      {/* === REPLAY MEMORY === */}
      {[
        { pos: [6, 2, 0], color: '#22d3ee' },
        { pos: [7, 0, 0], color: '#c084fc' },
        { pos: [6, -2, 0], color: '#f472b6' },
        { pos: [8, 1.5, 0], color: '#fbbf24' },
        { pos: [8, -0.5, 0], color: '#4ade80' },
        { pos: [5, 0.5, 0], color: '#22d3ee' },
      ].map((m, i) => (
        <MemoryCapsule key={i} position={m.pos} color={m.color} onClick={() => onZoneClick('memory', i)} />
      ))}
      <Text position={[6.5, -3.5, 0]} fontSize={0.35} color="#c084fc" anchorX="center">
        REPLAY MEMORY
      </Text>
      <Text position={[6.5, -4.1, 0]} fontSize={0.22} color="#c084fc" anchorX="center">
        {'(s, a, r, s\') × N'}
      </Text>

      {/* === DATA FLOWS === */}
      {/* State arrow */}
      <group>
        <mesh position={[-3.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
        </mesh>
      </group>

      <OrbitControls enableZoom={true} enablePan={true} minDistance={3} maxDistance={30} />
      <PostFX intensity={1.4} />
    </>
  )
}

// Zone info panels
const ZONES = {
  overview: {
    title: '🧠 Deep Q-Network',
    color: '#22d3ee',
    content: `DQN combines Q-learning with deep neural networks. The agent observes a state s, passes it through the network to get Q-values for each action, then selects the action with the highest Q-value (exploitation) or a random action (exploration).`,
    equation: 'Q(s,a) = R + γ · max_a Q(s\',a\')',
    concepts: ['state', 'action', 'Q-value', 'exploitation']
  },
  nn: {
    title: '🔬 Neural Network Tunnel',
    color: '#22d3ee',
    content: `The neural network acts as the Q-function approximator. Each layer applies a linear transformation followed by a non-linear activation. Backpropagation adjusts weights to minimize the Bellman error.`,
    equation: 'Loss = E[(r + γ·max Q_target(s\') - Q(s,a))²]',
    concepts: ['neural networks', 'backpropagation', 'Q-value']
  },
  qvalue: {
    title: '⚡ Q-Value Reactor',
    color: '#fbbf24',
    content: `Q-values represent the expected cumulative future reward for taking action a in state s. The Bellman equation relates current Q-values to future ones: the agent should prefer actions leading to higher long-term rewards.`,
    equation: 'Q*(s,a) = E[R_t+1 + γ · max_a Q*(s_{t+1}, a)]',
    concepts: ['Q-value', 'reward', 'bellman']
  },
  memory: {
    title: '💾 Replay Memory',
    color: '#c084fc',
    content: `Experience replay breaks temporal correlations. Each experience (s, a, r, s') is stored as a memory capsule. During training, random mini-batches are sampled — this stabilizes learning and improves data efficiency.`,
    equation: 'B = {(s_i, a_i, r_i, s\'_i)} ← uniform sample',
    concepts: ['replay', 'state', 'action', 'reward']
  },
  explore: {
    title: '🎲 Exploration vs Exploitation',
    color: '#f472b6',
    content: `The ε-greedy policy balances exploration and exploitation. With probability ε the agent explores randomly; with probability 1-ε it exploits the best known action. ε decays over time as the agent gains confidence.`,
    equation: 'a = random if rand() < ε else argmax_a Q(s,a)',
    concepts: ['exploration', 'exploitation', 'policy']
  }
}

export default function DQNWorld() {
  const { setGuide, addConcept, setWorld } = useStore()
  const [activeZone, setActiveZone] = useState('overview')
  const [step, setStep] = useState(0)
  const zone = ZONES[activeZone]

  const steps = [
    { label: 'Observe State', icon: '👁️', zone: 'overview' },
    { label: 'Neural Network', icon: '🧠', zone: 'nn' },
    { label: 'Q-Values', icon: '⚡', zone: 'qvalue' },
    { label: 'Replay Memory', icon: '💾', zone: 'memory' },
    { label: 'Explore/Exploit', icon: '🎲', zone: 'explore' },
  ]

  const handleZoneClick = (zone, idx) => {
    setActiveZone('memory')
    setGuide('Experience capsule accessed. This memory tuple (s, a, r, s\') will be sampled during training to update the Q-network weights via backpropagation.')
    addConcept('replay')
  }

  const handleStep = (i) => {
    setStep(i)
    setActiveZone(steps[i].zone)
    const z = ZONES[steps[i].zone]
    z.concepts.forEach(c => addConcept(c))
    setGuide(`${z.title}: ${z.content.slice(0, 100)}...`)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 2, 12], fov: 65 }}>
        <Suspense fallback={null}>
          <DQNScene onZoneClick={handleZoneClick} />
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
          <div className="flex flex-wrap gap-1">
            {zone.concepts.map(c => (
              <span key={c} onClick={() => addConcept(c)} className="cursor-pointer text-xs font-mono-tech px-2 py-0.5 rounded hover:opacity-100 opacity-70 transition-all"
                style={{ background: zone.color + '20', color: zone.color, border: `1px solid ${zone.color}30` }}>
                +{c}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DQN Pipeline steps */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center px-4 z-20"
      >
        <div className="hud-border rounded p-3 flex gap-2 flex-wrap justify-center" style={{ borderColor: 'rgba(34,211,238,0.2)' }}>
          <div className="w-full text-center font-orbitron text-xs text-cyan-600 mb-2 tracking-widest">DQN LEARNING PIPELINE</div>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => handleStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 font-mono-tech text-xs"
              style={{
                background: step === i ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.05)',
                border: `1px solid ${step === i ? 'rgba(34,211,238,0.6)' : 'rgba(34,211,238,0.15)'}`,
                color: step === i ? '#22d3ee' : '#6b7280',
                boxShadow: step === i ? '0 0 10px rgba(34,211,238,0.2)' : 'none'
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Live Q-value monitor */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-6 z-20 hud-border rounded p-4 w-48"
        style={{ borderColor: 'rgba(251,191,36,0.3)' }}
      >
        <div className="font-orbitron text-xs text-amber-400 mb-3 tracking-widest">Q-VALUES LIVE</div>
        {['Left', 'Right', 'Up', 'Down'].map((action, i) => (
          <LiveQBar key={i} label={action} delay={i * 0.3} />
        ))}
        <div className="mt-2 font-mono-tech text-xs text-gray-600">argmax → selected action</div>
      </motion.div>

      {/* Back button */}
      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-cyan-700 hover:text-cyan-400 transition-colors">
        ← Return to RL Core
      </button>
    </div>
  )
}

function LiveQBar({ label, delay }) {
  const [value, setValues] = useState(Math.random())
  useEffect(() => {
    const interval = setInterval(() => setValues(Math.max(0.05, Math.min(1, value + (Math.random() - 0.5) * 0.3))), 800 + delay * 200)
    return () => clearInterval(interval)
  }, [value])
  return (
    <div className="mb-2">
      <div className="flex justify-between font-mono-tech text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className="text-amber-400">{value.toFixed(3)}</span>
      </div>
      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
        />
      </div>
    </div>
  )
}
