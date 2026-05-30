import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { useAudio, playPortalEnter } from '../components/AudioSystem'
import { ParticleField, Portal, CoreOrb, NeuralNetwork } from '../components/Scene3D'
import PostFX from '../components/PostFX'

function HubScene({ onPortal }) {
  const ringRef = useRef()
  useFrame((s) => { if (ringRef.current) ringRef.current.rotation.y = s.clock.elapsedTime * 0.05 })

  return (
    <>
      <color attach="background" args={['#000510']} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 0]}    intensity={2.5} color="#22d3ee" distance={30} />
      <pointLight position={[10, 5, -10]} intensity={1.2} color="#c084fc" distance={22} />
      <pointLight position={[-10,-5, 10]} intensity={1.0} color="#f472b6" distance={22} />
      <pointLight position={[0, -8,  0]}  intensity={0.8} color="#fbbf24" distance={18} />

      <Stars radius={100} depth={50} count={5500} factor={4} saturation={0} fade speed={1} />
      <ParticleField count={700} color="#22d3ee" spread={45} />

      <CoreOrb position={[0, 0, 0]} color="#22d3ee" size={1.5} />

      {/* Orbital rings */}
      <group ref={ringRef}>
        {[
          [4,   0.022, '#22d3ee', 0.45],
          [5.2, 0.016, '#c084fc', 0.32],
          [6.4, 0.011, '#f472b6', 0.22],
        ].map(([r, t, c, o], i) => (
          <mesh key={i} rotation={i === 1 ? [Math.PI/3,0,0] : i === 2 ? [-Math.PI/4,Math.PI/6,0] : [0,0,0]}>
            <torusGeometry args={[r, t, 8, 200]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.2} transparent opacity={o} />
          </mesh>
        ))}
      </group>

      {/* 6 portals */}
      <Portal position={[-7,   2,  -4]} color="#22d3ee" scale={1.1} label="DQN WORLD"       onClick={() => onPortal('dqn')} />
      <Portal position={[ 7,   1,  -4]} color="#c084fc" scale={1.1} label="POLICY NETWORK"  onClick={() => onPortal('policy')} />
      <Portal position={[ 0,  -3,  -9]} color="#f472b6" scale={1.1} label="ACTOR-CRITIC"    onClick={() => onPortal('actor-critic')} />
      <Portal position={[-5,  -2,  -7]} color="#fbbf24" scale={0.9} label="TD LEARNING"     onClick={() => onPortal('td')} />
      <Portal position={[ 5,  -2,  -7]} color="#4ade80" scale={0.9} label="ENVIRONMENT"     onClick={() => onPortal('environment')} />
      <Portal position={[ 0,   4,  -6]} color="#fb923c" scale={0.95} label="PPO WORLD"      onClick={() => onPortal('ppo')} />

      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        <NeuralNetwork position={[0, 0, 3]} layers={[3, 4, 4, 3]} />
      </Float>

      <Text position={[0, 5.8, 0]} fontSize={0.72} color="#22d3ee" anchorX="center" letterSpacing={0.3}>
        THE RL CORE
      </Text>

      <OrbitControls enableZoom enablePan={false} minDistance={5} maxDistance={28}
        autoRotate autoRotateSpeed={0.3} target={[0, 0, 0]} />

      <PostFX intensity={1.8} />
    </>
  )
}

const PORTALS = [
  { id: 'dqn',          label: 'WORLD 1', name: 'Deep Q-Network',  color: '#22d3ee', icon: '🧠',
    chips: ['Q-values', 'replay memory', 'bellman'] },
  { id: 'policy',       label: 'WORLD 2', name: 'Policy Network',  color: '#c084fc', icon: '🌊',
    chips: ['π(a|s)', 'gradient ascent', 'entropy'] },
  { id: 'actor-critic', label: 'WORLD 3', name: 'Actor-Critic',    color: '#f472b6', icon: '⚖️',
    chips: ['advantage', 'TD error', 'V(s)'] },
  { id: 'td',           label: 'WORLD 4', name: 'TD Learning',     color: '#fbbf24', icon: '⚡',
    chips: ['bootstrapping', 'bellman', 'SARSA'] },
  { id: 'environment',  label: 'WORLD 5', name: 'Environment MDP', color: '#4ade80', icon: '🌍',
    chips: ['MDP', 'state space', 'reward'] },
  { id: 'ppo',          label: 'WORLD 6', name: 'PPO',             color: '#fb923c', icon: '🔄',
    chips: ['clipping', 'trust region', 'policy ratio'] },
]

export default function HubWorld() {
  const { setWorld, setGuide, addConcept, startTransition, endTransition } = useStore()
  const { audioCtx } = useAudio()

  const handlePortal = (id) => {
    const p = PORTALS.find(x => x.id === id)
    playPortalEnter(audioCtx)
    startTransition(p.color)
    setGuide(`Entering ${p.name}… Prepare to explore ${p.chips.join(', ')}.`)
    setTimeout(() => {
      setWorld(id)
      setTimeout(endTransition, 420)
    }, 650)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <HubScene onPortal={handlePortal} />
        </Suspense>
      </Canvas>

      {/* 2-D overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 right-0 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-orbitron text-xl font-black text-white glow-cyan tracking-widest">THE RL CORE</h2>
            <p className="font-mono-tech text-cyan-500 text-xs opacity-50 mt-1 tracking-widest">6 DIMENSIONS — SELECT YOUR PORTAL</p>
          </motion.div>
        </div>

        <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-2 px-4 flex-wrap">
          {PORTALS.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 260 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePortal(p.id)}
              className="pointer-events-auto portal-btn rounded p-3 text-left"
              style={{
                border: `1px solid ${p.color}25`,
                background: 'rgba(0,5,16,0.85)',
                backdropFilter: 'blur(12px)',
                minWidth: '130px',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{p.icon}</span>
                <div>
                  <div className="font-mono-tech text-xs opacity-40" style={{ color: p.color }}>{p.label}</div>
                  <div className="font-orbitron text-xs font-bold" style={{ color: p.color }}>{p.name}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.chips.map(c => (
                  <span key={c} className="text-xs font-mono-tech px-1 py-0.5 rounded"
                    style={{ background: p.color + '12', color: p.color + 'bb', border: `1px solid ${p.color}18` }}>
                    {c}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Status sidebar */}
      <div className="absolute top-20 left-4 pointer-events-none">
        <div className="font-mono-tech text-xs text-cyan-900 space-y-0.5">
          <div>STATUS: <span className="text-cyan-500">ONLINE</span></div>
          <div>WORLDS: <span className="text-amber-400">6 ACTIVE</span></div>
          <div>EPOCH: <span className="text-purple-500">∞</span></div>
        </div>
      </div>
    </div>
  )
}
