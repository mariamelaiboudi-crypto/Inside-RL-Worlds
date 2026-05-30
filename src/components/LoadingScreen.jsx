import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const steps = [
  'Initializing Neural Substrate...',
  'Loading Q-Value Reactors...',
  'Calibrating Policy Networks...',
  'Spawning Actor-Critic Towers...',
  'Entering the RL Core...',
]

export default function LoadingScreen() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100))
      setStep(s => s < steps.length - 1 ? s + 1 : s)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Central orb */}
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 border-2 border-cyan-400 rounded-full opacity-30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 border-2 border-purple-400 rounded-full opacity-50"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-10 bg-cyan-400 rounded-full opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-cyan-400 font-orbitron text-xs glow-cyan">RL</span>
        </div>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-orbitron text-3xl font-black text-white glow-cyan mb-2 tracking-widest"
      >
        INSIDE RL
      </motion.h1>
      <p className="text-cyan-400 font-mono-tech text-sm mb-8 opacity-70 tracking-wider">
        REINFORCEMENT LEARNING DIMENSION
      </p>

      {/* Progress bar */}
      <div className="w-80 h-1 bg-gray-900 rounded-full overflow-hidden mb-4">
        <motion.div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step text */}
      <motion.p
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono-tech text-cyan-400 text-xs tracking-widest"
      >
        {steps[step]}
      </motion.p>
    </div>
  )
}
