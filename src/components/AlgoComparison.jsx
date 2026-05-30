import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ALGOS = [
  { name: 'Q-Learning', type: 'Value-Based', policy: 'Off-policy', space: 'Discrete', stability: 4, efficiency: 3, scalability: 2, color: '#22d3ee',
    pros: ['Convergence guarantees', 'Simple to implement', 'Works well with discrete actions'],
    cons: ['Discrete action spaces only', 'Can overestimate Q-values', 'No direct policy output'] },
  { name: 'DQN', type: 'Value-Based', policy: 'Off-policy', space: 'Discrete', stability: 4, efficiency: 4, scalability: 4, color: '#22d3ee',
    pros: ['Works from raw pixels', 'Experience replay stability', 'Target network prevents divergence'],
    cons: ['Discrete actions only', 'Large replay buffer needed', 'Slow to train from scratch'] },
  { name: 'REINFORCE', type: 'Policy-Based', policy: 'On-policy', space: 'Both', stability: 2, efficiency: 2, scalability: 3, color: '#c084fc',
    pros: ['Continuous action spaces', 'Direct policy optimization', 'Simple gradient estimator'],
    cons: ['High variance gradients', 'Sample inefficient', 'Sensitive to learning rate'] },
  { name: 'A2C / A3C', type: 'Actor-Critic', policy: 'On-policy', space: 'Both', stability: 4, efficiency: 3, scalability: 5, color: '#f472b6',
    pros: ['Lower variance than REINFORCE', 'Parallel data collection', 'Continuous & discrete actions'],
    cons: ['Still on-policy (less efficient)', 'Sensitive to hyperparameters', 'Harder to tune than DQN'] },
  { name: 'PPO', type: 'Actor-Critic', policy: 'On-policy', space: 'Both', stability: 5, efficiency: 4, scalability: 5, color: '#fbbf24',
    pros: ['Very stable training', 'Simple clipping mechanism', 'Industry standard baseline'],
    cons: ['On-policy (needs fresh data)', 'Multiple epochs add overhead', 'Less sample efficient than SAC'] },
  { name: 'SAC', type: 'Actor-Critic', policy: 'Off-policy', space: 'Continuous', stability: 5, efficiency: 5, scalability: 4, color: '#4ade80',
    pros: ['Maximum entropy framework', 'Off-policy (replay buffer)', 'State-of-the-art sample efficiency'],
    cons: ['Continuous actions only', 'Complex implementation', 'Many hyperparameters'] },
]

const METRICS = ['stability', 'efficiency', 'scalability']

function RadarBar({ value, max = 5, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
      <span className="font-mono-tech text-xs w-4 text-right" style={{ color }}>{value}</span>
    </div>
  )
}

export default function AlgoComparison({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy] = useState('name')

  const sorted = [...ALGOS].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'stability') return b.stability - a.stability
    if (sortBy === 'efficiency') return b.efficiency - a.efficiency
    if (sortBy === 'scalability') return b.scalability - a.scalability
    return 0
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,5,16,0.96)' }}>
      <div className="max-w-5xl w-full max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <div className="font-orbitron text-xl font-black text-white tracking-widest">ALGORITHM ARENA</div>
            <div className="font-mono-tech text-xs text-cyan-500 opacity-60">Compare all major RL algorithms</div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-lg">✕</button>
        </div>

        {/* Sort controls */}
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <span className="font-mono-tech text-xs text-gray-600 self-center">Sort:</span>
          {['name', 'stability', 'efficiency', 'scalability'].map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className="font-mono-tech text-xs px-2.5 py-1 rounded transition-all capitalize"
              style={{
                background: sortBy === s ? 'rgba(34,211,238,0.15)' : 'transparent',
                border: `1px solid ${sortBy === s ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: sortBy === s ? '#22d3ee' : '#6b7280'
              }}>{s}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((algo) => (
              <motion.div key={algo.name} layout
                onClick={() => setSelected(selected?.name === algo.name ? null : algo)}
                className="rounded-lg p-4 cursor-pointer transition-all duration-300"
                style={{
                  background: selected?.name === algo.name ? algo.color + '10' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected?.name === algo.name ? algo.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: selected?.name === algo.name ? `0 0 20px ${algo.color}15` : 'none'
                }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-orbitron text-sm font-bold" style={{ color: algo.color }}>{algo.name}</div>
                    <div className="font-mono-tech text-xs text-gray-500">{algo.type} · {algo.policy}</div>
                  </div>
                  <span className="font-mono-tech text-xs px-2 py-0.5 rounded"
                    style={{ background: algo.color + '15', color: algo.color, border: `1px solid ${algo.color}25` }}>
                    {algo.space}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  {METRICS.map(m => (
                    <div key={m}>
                      <div className="font-mono-tech text-xs text-gray-600 mb-1 capitalize">{m}</div>
                      <RadarBar value={algo[m]} color={algo.color} />
                    </div>
                  ))}
                </div>

                {/* Expanded */}
                {selected?.name === algo.name && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-mono-tech text-xs text-green-400 mb-1">✓ PROS</div>
                        {algo.pros.map(p => (
                          <div key={p} className="font-mono-tech text-xs text-gray-400 mb-0.5 leading-relaxed">· {p}</div>
                        ))}
                      </div>
                      <div>
                        <div className="font-mono-tech text-xs text-red-400 mb-1">✗ CONS</div>
                        {algo.cons.map(c => (
                          <div key={c} className="font-mono-tech text-xs text-gray-400 mb-0.5 leading-relaxed">· {c}</div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
