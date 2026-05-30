import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EQUATIONS = [
  { title:'Bellman Optimality',   eq:'Q*(s,a) = R + γ · max_a\' Q*(s\',a\')',  color:'#fbbf24',
    breakdown:[{sym:'Q*(s,a)',def:'Optimal Q-value'},{sym:'R',def:'Immediate reward'},{sym:'γ',def:'Discount factor (0–1)'},{sym:'max Q*',def:'Best future value'}] },
  { title:'Policy Gradient',      eq:'∇θ J(θ) = E[ ∇θ log π(a|s;θ) · G ]',   color:'#c084fc',
    breakdown:[{sym:'∇θ J',def:'Gradient of expected return'},{sym:'log π',def:'Log-probability of action'},{sym:'G',def:'Episode return'}] },
  { title:'Advantage Function',   eq:'A(s,a) = Q(s,a) − V(s)',                  color:'#f472b6',
    breakdown:[{sym:'A(s,a)',def:'Advantage'},{sym:'Q(s,a)',def:'State-action value'},{sym:'V(s)',def:'State value baseline'}] },
  { title:'TD Error',             eq:'δ = r + γ V(s\') − V(s)',                 color:'#22d3ee',
    breakdown:[{sym:'δ',def:'TD error (surprise)'},{sym:'r+γV(s\')',def:'Bootstrap target'},{sym:'V(s)',def:'Current estimate'}] },
  { title:'Entropy Bonus',        eq:'H(π) = −Σ_a π(a|s) log π(a|s)',           color:'#4ade80',
    breakdown:[{sym:'H(π)',def:'Policy entropy'},{sym:'Σ π log π',def:'Information content'},{sym:'−',def:'Negate → maximise diversity'}] },
  { title:'n-Step Return',        eq:'Gₜⁿ = Σᵢ₌₀ⁿ⁻¹ γⁱ rₜ₊ᵢ + γⁿ V(sₜ₊ₙ)', color:'#fbbf24',
    breakdown:[{sym:'Gₜⁿ',def:'n-step return'},{sym:'Σγⁱrₜ₊ᵢ',def:'Discounted rewards'},{sym:'γⁿV',def:'Bootstrap tail'}] },
]

export default function MathHolo({ onClose }) {
  const [idx, setIdx] = useState(0)
  const eq = EQUATIONS[idx]

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,5,16,0.95)' }}>

      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="font-orbitron text-xs text-cyan-500 tracking-widest">HOLOGRAPHIC EQUATIONS</div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400">✕</button>
        </div>

        {/* Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {EQUATIONS.map((e, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="font-mono-tech text-xs px-2.5 py-1 rounded transition-all"
              style={{ border:`1px solid ${i===idx ? e.color+'80' : 'rgba(255,255,255,0.08)'}`,
                       background: i===idx ? e.color+'15' : 'transparent',
                       color: i===idx ? e.color : '#6b7280' }}>
              {e.title}
            </button>
          ))}
        </div>

        {/* Equation display */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}>
            <div className="rounded-xl p-8 text-center mb-6"
              style={{ background:`${eq.color}08`, border:`1px solid ${eq.color}30`,
                       boxShadow:`0 0 30px ${eq.color}15` }}>
              <div className="font-orbitron text-xs mb-4 opacity-40 tracking-widest" style={{ color:eq.color }}>
                {eq.title}
              </div>
              <div className="font-mono-tech text-xl md:text-2xl leading-relaxed" style={{
                color: eq.color,
                textShadow: `0 0 10px ${eq.color}, 0 0 30px ${eq.color}66`,
              }}>
                {eq.eq}
              </div>
            </div>

            {/* Symbol breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {eq.breakdown.map((b, i) => (
                <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded p-3"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="font-mono-tech text-sm mb-1" style={{ color:eq.color }}>{b.sym}</div>
                  <div className="font-mono-tech text-xs text-gray-500">{b.def}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button onClick={() => setIdx((idx+1) % EQUATIONS.length)}
            className="font-mono-tech text-xs px-6 py-2 rounded transition-all"
            style={{ border:`1px solid ${eq.color}40`, color:eq.color, background:`${eq.color}08` }}>
            NEXT EQUATION →
          </button>
        </div>
      </div>
    </motion.div>
  )
}
