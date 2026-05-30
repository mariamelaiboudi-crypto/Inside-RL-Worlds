import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function IntroScreen({ onStart }) {
  const [typed, setTyped] = useState('')
  const text = 'Enter the mind of an Artificial Intelligence. Explore how machines learn. Feel the algorithms from within.'
  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setTyped(text.slice(0, i + 1))
        i++
      } else clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-cyan-400 opacity-20"
            style={{ left: `${Math.random() * 100}%`, height: `${Math.random() * 200 + 50}px`, top: '-200px' }}
            animate={{ y: ['0vh', '120vh'] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Central content */}
      <div className="relative z-10 text-center max-w-3xl px-8">
        {/* Logo rings */}
        <div className="relative w-48 h-48 mx-auto mb-10">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: `${i * 24}px`,
                borderColor: ['rgba(34,211,238,0.6)', 'rgba(192,132,252,0.4)', 'rgba(244,114,182,0.3)'][i]
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="font-orbitron text-cyan-400 text-4xl font-black glow-cyan">RL</div>
              <div className="font-mono-tech text-cyan-600 text-xs">CORE</div>
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white mb-2 tracking-wider">
            INSIDE
          </h1>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black glow-cyan mb-1" style={{ color: '#22d3ee' }}>
            REINFORCEMENT
          </h1>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black text-purple-400 glow-purple">
            LEARNING
          </h1>
        </motion.div>

        {/* Typed description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 font-mono-tech text-cyan-300 text-lg leading-relaxed min-h-[60px] opacity-80"
        >
          {typed}<span className="animate-pulse">|</span>
        </motion.p>

        {/* Worlds preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex gap-4 justify-center mt-8 mb-10"
        >
          {[
            { name: 'DQN World', color: '#22d3ee', icon: '🧠' },
            { name: 'Policy World', color: '#c084fc', icon: '🌊' },
            { name: 'Actor-Critic', color: '#f472b6', icon: '⚖️' },
          ].map(w => (
            <div key={w.name} className="hud-border rounded px-4 py-2 text-xs" style={{ borderColor: w.color + '40' }}>
              <span className="mr-1">{w.icon}</span>
              <span className="font-mono-tech" style={{ color: w.color }}>{w.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 }}
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="portal-btn relative px-16 py-5 font-orbitron font-bold text-xl tracking-widest text-black uppercase rounded"
          style={{
            background: 'linear-gradient(135deg, #22d3ee, #c084fc)',
            boxShadow: '0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(192,132,252,0.3)'
          }}
        >
          ENTER THE CORE
        </motion.button>

        <p className="mt-4 font-mono-tech text-xs text-gray-500 tracking-widest">
          CLICK TO BEGIN YOUR JOURNEY
        </p>
      </div>

      {/* Corner decorations */}
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} className={`absolute w-16 h-16 border-cyan-400 opacity-30 ${
          pos === 'tl' ? 'top-4 left-4 border-t-2 border-l-2' :
          pos === 'tr' ? 'top-4 right-4 border-t-2 border-r-2' :
          pos === 'bl' ? 'bottom-4 left-4 border-b-2 border-l-2' :
          'bottom-4 right-4 border-b-2 border-r-2'
        }`} />
      ))}
    </div>
  )
}
