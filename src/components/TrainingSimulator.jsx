import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const MAX_POINTS = 80

function sparkLine(vals, color, H = 60) {
  if (vals.length < 2) return null
  const W = 200
  const min = Math.min(...vals), max = Math.max(...vals) + 0.001
  const pts = vals.map((v, i) => {
    const x = (i / (MAX_POINTS - 1)) * W
    const y = H - ((v - min) / (max - min)) * (H - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} style={{ display:'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
      <circle cx={(vals.length-1)/(MAX_POINTS-1)*W} cy={H-((vals[vals.length-1]-min)/(max-min))*(H-4)-2}
        r="3" fill={color} />
    </svg>
  )
}

export default function TrainingSimulator({ world }) {
  const { addConcept } = useStore()
  const [running, setRunning] = useState(false)
  const [episode, setEpisode] = useState(0)
  const [step, setStep]       = useState(0)
  const [epsilon, setEpsilon] = useState(1.0)
  const [loss, setLoss]       = useState([])
  const [returns, setReturns] = useState([])
  const [tdErr, setTdErr]     = useState([])
  const tickRef = useRef(null)

  const worldColor = {
    dqn: '#22d3ee', policy: '#c084fc', 'actor-critic': '#f472b6',
    td: '#fbbf24', environment: '#4ade80',
  }[world] || '#22d3ee'

  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => {
        setStep(s => {
          const ns = s + 1
          if (ns % 200 === 0) {
            setEpisode(e => e + 1)
            setReturns(r => [...r.slice(-MAX_POINTS + 1), Math.random() * 2 - 0.2 + (episode * 0.05)])
          }
          return ns
        })
        setEpsilon(e => Math.max(0.05, e - 0.0008))
        setLoss(l => [...l.slice(-MAX_POINTS + 1), Math.max(0.01, (Math.random() * 0.3 + 0.05) * Math.exp(-step * 0.0004))])
        setTdErr(t => [...t.slice(-MAX_POINTS + 1), Math.abs(Math.random() * 0.4 * Math.exp(-step * 0.0003))])
        if (step % 50 === 0) addConcept('TD-error')
        if (step % 100 === 0) addConcept('backprop')
      }, 80)
    } else {
      clearInterval(tickRef.current)
    }
    return () => clearInterval(tickRef.current)
  }, [running, step, episode])

  const reset = () => {
    setRunning(false); setEpisode(0); setStep(0); setEpsilon(1.0)
    setLoss([]); setReturns([]); setTdErr([])
  }

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      className="hud-border rounded p-3 w-56"
      style={{ borderColor: worldColor + '35' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-orbitron text-xs tracking-widest" style={{ color: worldColor }}>
          TRAINING SIM
        </div>
        <div className="flex gap-1">
          <button onClick={() => setRunning(r => !r)}
            className="font-mono-tech text-xs px-2 py-0.5 rounded transition-all"
            style={{ background: running ? worldColor + '25' : 'transparent',
                     border: `1px solid ${worldColor}40`, color: worldColor }}>
            {running ? '⏸ PAUSE' : '▶ RUN'}
          </button>
          <button onClick={reset}
            className="font-mono-tech text-xs px-2 py-0.5 rounded"
            style={{ border:'1px solid rgba(255,255,255,0.1)', color:'#6b7280' }}>
            ↺
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1 mb-2 text-center">
        {[
          { label:'EP',    val: episode,         color: worldColor },
          { label:'STEP',  val: step,            color: '#94a3b8' },
          { label:'ε',     val: epsilon.toFixed(2), color: '#f472b6' },
        ].map(s => (
          <div key={s.label} className="rounded px-1 py-1" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-orbitron text-xs font-bold" style={{ color:s.color }}>{s.val}</div>
            <div className="font-mono-tech text-xs opacity-40" style={{ fontSize:'8px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sparklines */}
      <div className="space-y-2">
        {[
          { label:'Loss',   data: loss,    color:'#f472b6' },
          { label:'Return', data: returns, color: worldColor },
          { label:'TD-err', data: tdErr,   color:'#fbbf24' },
        ].map(chart => (
          <div key={chart.label}>
            <div className="font-mono-tech text-xs mb-0.5 opacity-50" style={{ color:chart.color }}>
              {chart.label} {chart.data.length > 0 ? chart.data[chart.data.length-1].toFixed(3) : '—'}
            </div>
            <div style={{ borderRadius:3, overflow:'hidden' }}>
              {sparkLine(chart.data, chart.color)}
            </div>
          </div>
        ))}
      </div>

      {running && (
        <div className="mt-2 font-mono-tech text-xs opacity-40 text-center animate-pulse"
          style={{ color: worldColor }}>
          ● TRAINING IN PROGRESS
        </div>
      )}
    </motion.div>
  )
}
