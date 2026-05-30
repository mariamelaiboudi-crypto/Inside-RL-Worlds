import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EVENTS = [
  { year: 1957, title: 'Dynamic Programming', author: 'Bellman', color: '#fbbf24',
    desc: 'Richard Bellman introduces Dynamic Programming and the Bellman equation — the mathematical foundation of all modern RL.',
    algo: 'V*(s) = max_a Σ P(s\'|s,a)[r + γV*(s\')]', tag: 'Foundation' },
  { year: 1988, title: 'TD Learning', author: 'Sutton', color: '#22d3ee',
    desc: 'Sutton formalizes Temporal Difference learning — the first algorithm that can learn online from incomplete episodes via bootstrapping.',
    algo: 'V(s) ← V(s) + α[r + γV(s\') - V(s)]', tag: 'Core Algorithm' },
  { year: 1989, title: 'Q-Learning', author: 'Watkins', color: '#22d3ee',
    desc: 'Watkins introduces Q-Learning — the first off-policy TD algorithm that can learn Q(s,a) directly from environment interaction.',
    algo: 'Q(s,a) ← Q + α[r + γ max_a\' Q(s\',a\') - Q(s,a)]', tag: 'Milestone' },
  { year: 1992, title: 'REINFORCE', author: 'Williams', color: '#c084fc',
    desc: 'Williams derives the policy gradient theorem and REINFORCE algorithm — directly optimizing the policy via gradient ascent on expected return.',
    algo: '∇θ J(θ) = E[∇θ log π(a|s;θ) · G]', tag: 'Policy Gradient' },
  { year: 1994, title: 'TD-Gammon', author: 'Tesauro', color: '#4ade80',
    desc: 'TD-Gammon uses TD learning to reach world-class backgammon performance — first demonstration that RL can master complex games.',
    algo: 'TD(λ) + neural network function approximation', tag: 'Breakthrough' },
  { year: 2013, title: 'DQN', author: 'DeepMind', color: '#22d3ee',
    desc: 'Deep Q-Networks combines Q-learning with deep CNNs, experience replay, and target networks. Masters 49 Atari games from raw pixels.',
    algo: 'Q(s,a;θ) via CNN + Replay Buffer + Target Net', tag: 'Deep RL' },
  { year: 2015, title: 'A3C', author: 'DeepMind', color: '#f472b6',
    desc: 'Asynchronous Advantage Actor-Critic uses parallel agents to decorrelate experience. Faster and more stable than DQN on continuous tasks.',
    algo: '∇θ log π(aₜ|sₜ;θ) · A(sₜ,aₜ) — parallel workers', tag: 'Actor-Critic' },
  { year: 2015, title: 'TRPO', author: 'Schulman et al.', color: '#fbbf24',
    desc: 'Trust Region Policy Optimization guarantees monotonic policy improvement by constraining the KL divergence between old and new policies.',
    algo: 'max E[π/π_old · A] s.t. KL[π_old||π] ≤ δ', tag: 'Stable PG' },
  { year: 2016, title: 'AlphaGo', author: 'DeepMind', color: '#4ade80',
    desc: 'AlphaGo defeats world champion Lee Sedol at Go — a game with more positions than atoms in the universe. Uses MCTS + policy/value networks.',
    algo: 'MCTS + Policy Net + Value Net + self-play RL', tag: 'Legendary' },
  { year: 2017, title: 'PPO', author: 'Schulman et al.', color: '#fbbf24',
    desc: 'Proximal Policy Optimization — a simpler, more robust alternative to TRPO using a clipped surrogate objective. Becomes the industry standard.',
    algo: 'L_CLIP = E[min(r·A, clip(r,1-ε,1+ε)·A)]', tag: 'Industry Standard' },
  { year: 2018, title: 'SAC', author: 'Haarnoja et al.', color: '#c084fc',
    desc: 'Soft Actor-Critic maximizes both return and entropy: the agent is rewarded for acting randomly. State-of-the-art sample efficiency for continuous control.',
    algo: 'J(π) = Σ E[r(s,a) + α·H(π(·|s))]', tag: 'Entropy RL' },
  { year: 2019, title: 'AlphaStar', author: 'DeepMind', color: '#4ade80',
    desc: 'AlphaStar masters StarCraft II at Grandmaster level — a game requiring long-term planning, imperfect information, and 84 APM real-time decisions.',
    algo: 'League training + IMPALA + V-trace + self-play', tag: 'Superhuman' },
  { year: 2022, title: 'ChatGPT (RLHF)', author: 'OpenAI', color: '#f472b6',
    desc: 'Reinforcement Learning from Human Feedback aligns large language models with human preferences. RL moves from games to language and beyond.',
    algo: 'PPO + Reward Model from human comparisons', tag: 'RL×LLM' },
  { year: 2024, title: 'AlphaFold / World Models', author: 'Various', color: '#fbbf24',
    desc: 'RL applied to protein folding, robotics world models, and scientific discovery. RL is becoming a universal learning framework.',
    algo: 'Model-based RL + latent space planning', tag: 'Frontier' },
]

export default function RLTimeline({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const tags = ['All', ...new Set(EVENTS.map(e => e.tag))]
  const filtered = filter === 'All' ? EVENTS : EVENTS.filter(e => e.tag === filter)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,5,16,0.96)' }}>
      <div className="max-w-4xl w-full max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <div className="font-orbitron text-xl font-black text-white tracking-widest">RL HISTORY</div>
            <div className="font-mono-tech text-xs text-cyan-500 opacity-60">From Bellman 1957 to Today</div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-lg">✕</button>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
          {tags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)}
              className="font-mono-tech text-xs px-2.5 py-1 rounded transition-all"
              style={{
                background: filter === tag ? 'rgba(34,211,238,0.2)' : 'transparent',
                border: `1px solid ${filter === tag ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.1)'}`,
                color: filter === tag ? '#22d3ee' : '#6b7280'
              }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-14 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-30" />

            {filtered.map((event, i) => (
              <motion.div key={event.year + event.title}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(selected?.year === event.year && selected?.title === event.title ? null : event)}
                className="relative flex gap-4 mb-3 cursor-pointer group">
                {/* Year */}
                <div className="w-12 flex-shrink-0 text-right">
                  <span className="font-orbitron text-xs font-bold" style={{ color: event.color }}>{event.year}</span>
                </div>

                {/* Dot */}
                <div className="flex-shrink-0 w-5 flex items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-150"
                    style={{ background: event.color, boxShadow: `0 0 8px ${event.color}` }} />
                </div>

                {/* Content */}
                <div className="flex-1 rounded p-3 transition-all duration-300"
                  style={{ background: selected?.title === event.title ? event.color + '12' : 'rgba(255,255,255,0.03)',
                           border: `1px solid ${selected?.title === event.title ? event.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-orbitron text-sm font-bold" style={{ color: event.color }}>{event.title}</span>
                      <span className="font-mono-tech text-xs text-gray-500 ml-2">— {event.author}</span>
                    </div>
                    <span className="font-mono-tech text-xs px-2 py-0.5 rounded"
                      style={{ background: event.color + '15', color: event.color, border: `1px solid ${event.color}30` }}>
                      {event.tag}
                    </span>
                  </div>

                  <AnimatePresence>
                    {selected?.title === event.title && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}>
                        <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mt-2 mb-2 opacity-80">{event.desc}</p>
                        <div className="rounded p-2" style={{ background: event.color + '08', border: `1px solid ${event.color}20` }}>
                          <div className="font-mono-tech text-xs" style={{ color: event.color }}>{event.algo}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
