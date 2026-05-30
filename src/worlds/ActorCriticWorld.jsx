import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float, Box, Cylinder } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useStore } from '../store'
import { ParticleField, NeuralNetwork, CoreOrb } from '../components/Scene3D'
import PostFX from '../components/PostFX'

// Energy bridge between towers
function EnergyBridge({ from, to }) {
  const ref = useRef()
  const particlesRef = useRef([])

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
  const geo = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <group>
      <line geometry={geo}>
        <lineBasicMaterial ref={ref} color="#fbbf24" transparent opacity={0.5} linewidth={2} />
      </line>
      {/* Bridge particles */}
      {[...Array(8)].map((_, i) => (
        <BridgeParticle key={i} from={from} to={to} offset={i / 8} />
      ))}
      {/* Bridge label */}
      <Text position={[mid[0], mid[1] + 0.8, mid[2]]} fontSize={0.25} color="#fbbf24" anchorX="center">
        TD ERROR + GRADIENT
      </Text>
    </group>
  )
}

function BridgeParticle({ from, to, offset }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime * 0.5 + offset) % 1
      ref.current.position.x = from[0] + (to[0] - from[0]) * t
      ref.current.position.y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 0.5
      ref.current.position.z = from[2] + (to[2] - from[2]) * t
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
    </mesh>
  )
}

// Actor Tower
function ActorTower({ position }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })
  return (
    <group ref={ref} position={position}>
      {/* Tower base */}
      {[0, 1, 2, 3, 4].map(tier => (
        <mesh key={tier} position={[0, tier * 1.2 - 2, 0]}>
          <boxGeometry args={[2 - tier * 0.2, 1, 2 - tier * 0.2]} />
          <meshStandardMaterial
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={0.05 + tier * 0.08}
            transparent opacity={0.5}
          />
        </mesh>
      ))}
      {/* Neural network inside */}
      <Float speed={0.5} rotationIntensity={0.1}>
        <NeuralNetwork position={[0, 1, 0]} layers={[3, 4, 4, 3]} />
      </Float>
      {/* Tip glow */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} />
      </mesh>
      {/* Labels */}
      <Text position={[0, 6, 0]} fontSize={0.5} color="#f472b6" anchorX="center" fontWeight="bold">ACTOR</Text>
      <Text position={[0, 5.3, 0]} fontSize={0.25} color="#f472b6" anchorX="center">π(a|s;θ_actor)</Text>
      <Text position={[0, -3.5, 0]} fontSize={0.25} color="#f472b6" anchorX="center">Selects Actions</Text>
    </group>
  )
}

// Critic Tower
function CriticTower({ position }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })
  return (
    <group ref={ref} position={position}>
      {/* Tower base */}
      {[0, 1, 2, 3, 4].map(tier => (
        <mesh key={tier} position={[0, tier * 1.2 - 2, 0]}>
          <boxGeometry args={[2 - tier * 0.2, 1, 2 - tier * 0.2]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.05 + tier * 0.08}
            transparent opacity={0.5}
          />
        </mesh>
      ))}
      {/* Neural network inside */}
      <Float speed={0.5} rotationIntensity={0.1}>
        <NeuralNetwork position={[0, 1, 0]} layers={[3, 5, 3, 1]} />
      </Float>
      {/* Tip glow */}
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
      </mesh>
      {/* Labels */}
      <Text position={[0, 6, 0]} fontSize={0.5} color="#22d3ee" anchorX="center" fontWeight="bold">CRITIC</Text>
      <Text position={[0, 5.3, 0]} fontSize={0.25} color="#22d3ee" anchorX="center">V(s;θ_critic)</Text>
      <Text position={[0, -3.5, 0]} fontSize={0.25} color="#22d3ee" anchorX="center">Evaluates States</Text>
    </group>
  )
}

function ActorCriticScene() {
  return (
    <>
      <color attach="background" args={['#080010']} />
      <ambientLight intensity={0.05} />
      <pointLight position={[-6, 6, 0]} intensity={3} color="#f472b6" distance={20} />
      <pointLight position={[6, 6, 0]} intensity={3} color="#22d3ee" distance={20} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#fbbf24" distance={15} />

      <Stars radius={80} depth={40} count={5000} factor={3} saturation={0} fade />
      <ParticleField count={300} color="#f472b6" spread={25} />
      <ParticleField count={300} color="#22d3ee" spread={25} />

      {/* ACTOR tower */}
      <ActorTower position={[-6, 0, 0]} />

      {/* CRITIC tower */}
      <CriticTower position={[6, 0, 0]} />

      {/* Energy Bridge connecting them */}
      <EnergyBridge from={[-4.5, 2, 0]} to={[4.5, 2, 0]} />

      {/* Central floating equation */}
      <group position={[0, -3, 0]}>
        <Text fontSize={0.35} color="#fbbf24" anchorX="center">
          A(s,a) = Q(s,a) - V(s)
        </Text>
        <Text position={[0, -0.6, 0]} fontSize={0.22} color="#fbbf24" anchorX="center">
          Advantage Function
        </Text>
      </group>

      <OrbitControls enableZoom={true} enablePan={true} minDistance={5} maxDistance={35} />
      <PostFX intensity={1.6} />
    </>
  )
}

const AC_ZONES = {
  overview: {
    title: '⚖️ Actor-Critic Architecture',
    color: '#f472b6',
    content: 'Actor-Critic combines policy-based and value-based methods. The Actor learns a policy to select actions. The Critic learns a value function to evaluate how good the current state is. Together they achieve better stability and sample efficiency than either alone.',
    equation: 'Actor: π(a|s;θ_a) | Critic: V(s;θ_c)',
    concepts: ['actor', 'critic', 'policy']
  },
  actor: {
    title: '🎭 Actor Tower',
    color: '#f472b6',
    content: 'The Actor is a neural network that maps states to action probabilities — just like the policy network. However, instead of learning from raw returns, it receives guidance from the Critic in the form of the advantage estimate, making updates more stable.',
    equation: 'θ_a ← θ_a + α · ∇log π(a|s) · A(s,a)',
    concepts: ['actor', 'policy', 'gradient']
  },
  critic: {
    title: '⚖️ Critic Tower',
    color: '#22d3ee',
    content: 'The Critic estimates V(s) — the expected cumulative reward from state s. It computes the Temporal Difference (TD) error: the difference between the estimated value and the actual observed reward plus discounted next-state value.',
    equation: 'δ = r + γV(s\') - V(s) ← TD error',
    concepts: ['critic', 'Q-value', 'bellman']
  },
  bridge: {
    title: '🔄 Sync Bridge',
    color: '#fbbf24',
    content: 'The Advantage A(s,a) = Q(s,a) - V(s) flows from Critic to Actor. It tells whether the chosen action was better or worse than expected. Positive advantage reinforces the action; negative advantage discourages it. This signal guides the Actor\'s gradient updates.',
    equation: 'A(s,a) = r + γV(s\') - V(s)',
    concepts: ['actor', 'critic', 'gradient', 'reward']
  }
}

export default function ActorCriticWorld() {
  const { setGuide, addConcept, setWorld } = useStore()
  const [activeZone, setActiveZone] = useState('overview')
  const [tdError, setTdError] = useState(0.42)
  const [actorLoss, setActorLoss] = useState(0.85)
  const [criticLoss, setCriticLoss] = useState(0.67)
  const zone = AC_ZONES[activeZone]

  useEffect(() => {
    const interval = setInterval(() => {
      setTdError(v => Math.max(0, v - 0.008 + Math.random() * 0.01))
      setActorLoss(v => Math.max(0.01, v - 0.005 + Math.random() * 0.008))
      setCriticLoss(v => Math.max(0.01, v - 0.006 + Math.random() * 0.009))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleZone = (zoneId) => {
    setActiveZone(zoneId)
    const z = AC_ZONES[zoneId]
    z.concepts.forEach(c => addConcept(c))
    setGuide(`${z.title}: ${z.content.slice(0, 130)}...`)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 4, 18], fov: 65 }}>
        <Suspense fallback={null}>
          <ActorCriticScene />
        </Suspense>
      </Canvas>

      {/* Zone info */}
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
          <div className="rounded p-2" style={{ background: zone.color + '10', border: `1px solid ${zone.color}20` }}>
            <div className="font-mono-tech text-xs" style={{ color: zone.color }}>{zone.equation}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Live metrics */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-6 z-20 hud-border rounded p-4 w-52"
        style={{ borderColor: 'rgba(251,191,36,0.3)' }}
      >
        <div className="font-orbitron text-xs text-amber-400 mb-3 tracking-widest">LIVE TRAINING</div>

        <div className="mb-3">
          <div className="flex justify-between font-mono-tech text-xs mb-1">
            <span className="text-pink-400">Actor Loss</span>
            <span className="text-pink-400">{actorLoss.toFixed(4)}</span>
          </div>
          <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${actorLoss * 100}%` }} transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-pink-500" />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between font-mono-tech text-xs mb-1">
            <span className="text-cyan-400">Critic Loss</span>
            <span className="text-cyan-400">{criticLoss.toFixed(4)}</span>
          </div>
          <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${criticLoss * 100}%` }} transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-cyan-500" />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-mono-tech text-xs mb-1">
            <span className="text-amber-400">TD Error δ</span>
            <span className="text-amber-400">{tdError.toFixed(4)}</span>
          </div>
          <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${tdError * 100}%` }} transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-amber-500" />
          </div>
        </div>

        <div className="mt-3 font-mono-tech text-xs text-gray-600">
          {tdError < 0.15 ? '✓ Converging' : '⟳ Training...'}
        </div>
      </motion.div>

      {/* Zone nav */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-24 left-0 right-0 flex justify-center px-4 z-20"
      >
        <div className="hud-border rounded p-3 flex gap-2 flex-wrap justify-center" style={{ borderColor: 'rgba(244,114,182,0.2)' }}>
          <div className="w-full text-center font-orbitron text-xs text-pink-600 mb-2 tracking-widest">ACTOR-CRITIC ZONES</div>
          {[
            { id: 'overview', label: 'Overview', icon: '⚖️', color: '#f472b6' },
            { id: 'actor', label: 'Actor Tower', icon: '🎭', color: '#f472b6' },
            { id: 'critic', label: 'Critic Tower', icon: '🔬', color: '#22d3ee' },
            { id: 'bridge', label: 'Sync Bridge', icon: '🔄', color: '#fbbf24' },
          ].map(z => (
            <button
              key={z.id}
              onClick={() => handleZone(z.id)}
              className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 font-mono-tech text-xs"
              style={{
                background: activeZone === z.id ? z.color + '25' : z.color + '08',
                border: `1px solid ${activeZone === z.id ? z.color + '80' : z.color + '20'}`,
                color: activeZone === z.id ? z.color : '#6b7280',
              }}
            >
              <span>{z.icon}</span>
              <span>{z.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-pink-800 hover:text-pink-400 transition-colors">
        ← Return to RL Core
      </button>
    </div>
  )
}
