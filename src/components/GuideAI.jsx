import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const worldIntros = {
  hub: "Welcome to the RL Core — the pulsing heart of Artificial Intelligence. Three worlds await you: DQN, Policy Networks, and Actor-Critic. Choose your portal to begin exploring.",
  dqn: "You've entered the Deep Q-Network realm. Here, an agent learns optimal actions by estimating future reward values. Watch as the neural network processes states and outputs Q-values for every possible action.",
  policy: "The Policy Network world. Unlike DQN, here the AI directly learns a probability distribution over actions. The policy π(a|s) tells the agent how likely each action is given the current state.",
  'actor-critic': "Welcome to the Actor-Critic dimension — the most powerful architecture. Two neural networks collaborate: the Actor selects actions, the Critic evaluates them. Together they achieve remarkable learning efficiency."
}

export default function GuideAI() {
  const { guideMessage, guideVisible, hideGuide, currentWorld } = useStore()
  const [worldMsg, setWorldMsg] = useState('')
  const [showWorldMsg, setShowWorldMsg] = useState(false)

  useEffect(() => {
    setShowWorldMsg(false)
    const t1 = setTimeout(() => {
      setWorldMsg(worldIntros[currentWorld] || '')
      setShowWorldMsg(true)
    }, 800)
    const t2 = setTimeout(() => setShowWorldMsg(false), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [currentWorld])

  const message = guideVisible ? guideMessage : (showWorldMsg ? worldMsg : null)
  const visible = guideVisible || showWorldMsg

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, x: 60, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute bottom-24 right-6 z-40 max-w-xs"
        >
          <div className="hud-border rounded p-4 relative" style={{ borderColor: 'rgba(192,132,252,0.4)' }}>
            {/* AI avatar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-8 h-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border border-purple-400 rounded-full opacity-50"
                />
                <div className="absolute inset-1 bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-300 text-xs">AI</span>
                </div>
              </div>
              <div>
                <div className="font-orbitron text-purple-400 text-xs tracking-widest">ARIA</div>
                <div className="font-mono-tech text-gray-500 text-xs">AI Guide System</div>
              </div>
              <button
                onClick={() => { hideGuide(); setShowWorldMsg(false) }}
                className="ml-auto text-gray-600 hover:text-gray-400 text-xs"
              >✕</button>
            </div>

            {/* Message */}
            <TypedText text={message} />

            {/* Decorative bottom line */}
            <div className="mt-3 h-px bg-gradient-to-r from-purple-500 to-transparent opacity-40" />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded pointer-events-none" style={{
            boxShadow: '0 0 20px rgba(192,132,252,0.15)'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TypedText({ text }) {
  const [displayed, setDisplayed] = useState('')
  
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else clearInterval(interval)
    }, 20)
    return () => clearInterval(interval)
  }, [text])

  return (
    <p className="font-mono-tech text-xs text-cyan-200 leading-relaxed opacity-90">
      {displayed}<span className="animate-pulse opacity-70">|</span>
    </p>
  )
}
