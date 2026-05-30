import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { ParticleField, CoreOrb } from '../components/Scene3D'
import PostFX from '../components/PostFX'
import * as THREE from 'three'

function StateNode({ position, label, value, active, color='#fbbf24' }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = active
        ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5
        : 0.3
    }
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1 : 0.3} />
      </mesh>
      <Text position={[0, -0.7, 0]} fontSize={0.22} color={color} anchorX="center">{label}</Text>
      <Text position={[0, -1.0, 0]} fontSize={0.16} color={color} anchorX="center">
        V={value.toFixed(2)}
      </Text>
    </group>
  )
}

function TDScene({ activeState }) {
  const states = [
    { pos: [-4, 0, 0], label: 'S0' },
    { pos: [-2, 0, 0], label: 'S1' },
    { pos: [0, 0, 0], label: 'S2' },
    { pos: [2, 0, 0], label: 'S3' },
    { pos: [4, 0, 0], label: 'GOAL' },
  ]
  const [values, setValues] = useState([0, 0, 0, 0, 1])

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(v => {
        const newV = [...v]
        for (let i = newV.length - 2; i >= 0; i--) {
          const td = 0 + 0.99 * newV[i + 1] - newV[i]
          newV[i] = Math.max(0, newV[i] + 0.1 * td)
        }
        return newV
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <color attach="background" args={['#050a00']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#fbbf24" distance={20} />
      <Stars radius={80} depth={40} count={4000} factor={3} saturation={0} fade />
      <ParticleField count={300} color="#fbbf24" spread={25} />

      {states.map((s, i) => (
        <StateNode
          key={i}
          position={s.pos}
          label={s.label}
          value={values[i]}
          active={i === activeState}
          color={i === states.length - 1 ? '#4ade80' : '#fbbf24'}
        />
      ))}

      {/* Connection arrows */}
      {states.slice(0, -1).map((s, i) => {
        const pts = [new THREE.Vector3(...s.pos), new THREE.Vector3(...states[i+1].pos)]
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        return <line key={i} geometry={geo}>
          <lineBasicMaterial color="#fbbf24" transparent opacity={0.3} />
        </line>
      })}

      {/* Bellman equation */}
      <Text position={[0, -3, 0]} fontSize={0.3} color="#fbbf24" anchorX="center">
        V(s) ← V(s) + α[r + γV(s') - V(s)]
      </Text>

      <OrbitControls enableZoom={true} enablePan={true} minDistance={3} maxDistance={25} />
      <PostFX intensity={1.3} />
    </>
  )
}

export default function TDWorld() {
  const { setGuide, addConcept, setWorld } = useStore()
  const [activeState, setActiveState] = useState(0)
  const [zone, setZone] = useState('td0')

  useEffect(() => {
    const interval = setInterval(() => setActiveState(s => (s + 1) % 5), 1200)
    return () => clearInterval(interval)
  }, [])

  const zones = {
    td0: { title: '⚡ TD(0) Update', eq: 'V(s) ← V(s) + α[r + γV(s\') - V(s)]', desc: 'TD(0) updates after every single step using bootstrapped estimates from the next state.', concepts: ['TD-error', 'bellman'] },
    bellman: { title: '🔮 Bellman Equation', eq: 'V*(s) = max_a Σ P(s\'|s,a)[r + γV*(s\')]', desc: 'The Bellman equation is the recursive definition of optimal value. TD learning iteratively solves it.', concepts: ['bellman', 'state'] },
  }
  const z = zones[zone] || zones.td0

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 3, 10], fov: 65 }}>
        <Suspense fallback={null}>
          <TDScene activeState={activeState} />
        </Suspense>
      </Canvas>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 left-6 z-20 max-w-xs hud-border rounded p-4"
        style={{ borderColor: 'rgba(251,191,36,0.4)' }}>
        <h3 className="font-orbitron text-sm font-bold mb-2 text-amber-400">{z.title}</h3>
        <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-3 opacity-80">{z.desc}</p>
        <div className="rounded p-2" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="font-mono-tech text-xs text-amber-400">{z.eq}</div>
        </div>
      </motion.div>
      <button onClick={() => setWorld('hub')} className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 font-mono-tech text-xs text-amber-800 hover:text-amber-400 transition-colors">← Return to RL Core</button>
    </div>
  )
}
