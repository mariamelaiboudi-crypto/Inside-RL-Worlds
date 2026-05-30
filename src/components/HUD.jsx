import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'

const WORLD_LABELS = {
  hub:            'THE RL CORE — HUB',
  dqn:            'WORLD 1 — DEEP Q-NETWORK',
  policy:         'WORLD 2 — POLICY NETWORK',
  'actor-critic': 'WORLD 3 — ACTOR-CRITIC',
  td:             'WORLD 4 — TD LEARNING',
  environment:    'WORLD 5 — ENVIRONMENT (MDP)',
  ppo:            'WORLD 6 — PPO',
}

const CONCEPTS = [
  'state','action','reward','policy','Q-value',
  'exploration','exploitation','replay','gradient',
  'actor','critic','bellman','TD-error','advantage',
  'entropy','V(s)','backprop','MDP','bootstrap','SARSA',
]

const WORLDS = [
  { id: 'hub',            label: 'HUB', color: '#22d3ee' },
  { id: 'dqn',            label: 'DQN', color: '#22d3ee' },
  { id: 'policy',         label: 'POL', color: '#c084fc' },
  { id: 'actor-critic',   label: 'A-C', color: '#f472b6' },
  { id: 'td',             label: 'TD',  color: '#fbbf24' },
  { id: 'environment',    label: 'ENV', color: '#4ade80' },
  { id: 'ppo',            label: 'PPO', color: '#fbbf24' },
]

export default function HUD() {
  const { currentWorld, hudVisible, score, exploredConcepts, setWorld } = useStore()
  if (!hudVisible) return null

  const pct = Math.round((exploredConcepts.size / CONCEPTS.length) * 100)

  return (
    <>
      {/* Top bar */}
      <motion.div initial={{ y: -60 }} animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 h-14 border-b flex items-center px-4 z-30"
        style={{ background: 'rgba(0,5,16,0.96)', borderColor: 'rgba(34,211,238,0.14)' }}>
        <div className="font-orbitron text-cyan-400 text-sm font-bold tracking-widest" style={{ textShadow: '0 0 8px #22d3ee' }}>
          INSIDE RL
        </div>
        <div className="mx-3 w-px h-5 bg-cyan-900" />
        <div className="font-mono-tech text-cyan-300 text-xs tracking-widest opacity-55 truncate max-w-xs hidden sm:block">
          {WORLD_LABELS[currentWorld]}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono-tech text-xs text-cyan-700">{exploredConcepts.size}/{CONCEPTS.length}</span>
          </div>

          <div className="text-right hidden sm:block">
            <div className="font-orbitron text-amber-400 text-sm font-bold">{score}</div>
            <div className="font-mono-tech text-amber-700" style={{ fontSize: '8px', letterSpacing: '2px' }}>SCORE</div>
          </div>

          <div className="flex gap-1 flex-wrap">
            {WORLDS.map(w => (
              <button key={w.id} onClick={() => setWorld(w.id)}
                className="px-2 py-0.5 font-orbitron text-xs rounded transition-all duration-300"
                style={{
                  color:      currentWorld === w.id ? '#000' : w.color,
                  background: currentWorld === w.id ? w.color : 'transparent',
                  border:     `1px solid ${w.color}35`,
                  boxShadow:  currentWorld === w.id ? `0 0 8px ${w.color}` : 'none',
                  fontSize:   '9px',
                }}>
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Concept tracker */}
      <motion.div initial={{ x: -200 }} animate={{ x: 0 }} transition={{ delay: 0.5 }}
        className="absolute bottom-20 left-4 z-30 rounded p-3 w-52"
        style={{ background: 'rgba(0,5,16,0.9)', border: '1px solid rgba(34,211,238,0.12)' }}>
        <div className="font-orbitron text-cyan-600 mb-2 tracking-widest" style={{ fontSize: '7px' }}>CONCEPTS UNLOCKED</div>
        <div className="flex flex-wrap gap-1">
          {CONCEPTS.map(c => (
            <div key={c} className="font-mono-tech rounded transition-all duration-500"
              style={{
                fontSize: '7px', padding: '1px 5px',
                background: exploredConcepts.has(c) ? 'rgba(34,211,238,0.14)' : 'rgba(34,211,238,0.03)',
                border:     `1px solid ${exploredConcepts.has(c) ? 'rgba(34,211,238,0.45)' : 'rgba(34,211,238,0.07)'}`,
                color:      exploredConcepts.has(c) ? '#22d3ee' : '#374151',
              }}>
              {c}
            </div>
          ))}
        </div>
      </motion.div>

      {/* World dots */}
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex flex-col gap-2 z-30">
        {WORLDS.map(w => (
          <button key={w.id} onClick={() => setWorld(w.id)} title={w.label}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: currentWorld === w.id ? w.color : 'rgba(255,255,255,0.12)',
              boxShadow:  currentWorld === w.id ? `0 0 6px ${w.color}` : 'none',
              transform:  currentWorld === w.id ? 'scale(1.8)' : 'scale(1)',
            }} />
        ))}
      </div>
    </>
  )
}
