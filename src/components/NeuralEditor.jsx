import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const ACTIVATIONS = ['ReLU', 'Tanh', 'Sigmoid', 'ELU', 'LeakyReLU']
const COLORS = ['#22d3ee', '#c084fc', '#f472b6', '#4ade80', '#fbbf24']

function ActivationCurve({ fn, color, width = 120, height = 60 }) {
  const points = []
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * width
    const t = (i / 40) * 6 - 3
    let y
    switch (fn) {
      case 'ReLU':    y = Math.max(0, t); break
      case 'Tanh':    y = Math.tanh(t); break
      case 'Sigmoid': y = 1 / (1 + Math.exp(-t)); break
      case 'ELU':     y = t >= 0 ? t : Math.exp(t) - 1; break
      case 'LeakyReLU': y = t >= 0 ? t : 0.1 * t; break
      default:        y = t
    }
    const ny = height / 2 - (y / 3) * (height / 2 - 4)
    points.push(`${x},${Math.max(2, Math.min(height - 2, ny))}`)
  }
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <line x1={width/2} y1="0" x2={width/2} y2={height} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function LayerCard({ layer, index, onUpdate, onDelete, color }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded p-3 mb-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="font-orbitron text-xs" style={{ color }}> L{index + 1}</div>
        <div className="flex-1 flex items-center gap-2">
          <label className="font-mono-tech text-xs text-gray-500">Neurons</label>
          <input type="range" min="1" max="32" value={layer.neurons}
            onChange={e => onUpdate(index, 'neurons', parseInt(e.target.value))}
            className="flex-1" style={{ accentColor: color }} />
          <span className="font-mono-tech text-xs w-6 text-right" style={{ color }}>{layer.neurons}</span>
        </div>
        <button onClick={() => onDelete(index)}
          className="text-gray-600 hover:text-red-400 font-mono-tech text-xs transition-colors">✕</button>
      </div>
      <div className="flex items-center gap-2">
        <label className="font-mono-tech text-xs text-gray-500">Activation</label>
        <select value={layer.activation}
          onChange={e => onUpdate(index, 'activation', e.target.value)}
          className="flex-1 font-mono-tech text-xs rounded px-2 py-1"
          style={{ background: 'rgba(0,5,16,0.8)', border: `1px solid ${color}30`, color }}>
          {ACTIVATIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <ActivationCurve fn={layer.activation} color={color} width={80} height={36} />
      </div>
    </motion.div>
  )
}

function NetworkCanvas({ layers }) {
  const canvasRef = useRef()
  const draw = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    c.width = c.offsetWidth; c.height = c.offsetHeight
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)

    const xGap = W / (layers.length + 1)
    const allNodes = []

    layers.forEach((layer, li) => {
      const nodes = []
      const maxN = Math.min(layer.neurons, 10)
      for (let ni = 0; ni < maxN; ni++) {
        const x = (li + 1) * xGap
        const y = H / 2 + (ni - maxN / 2 + 0.5) * 28
        nodes.push({ x, y })
      }
      if (layer.neurons > 10) {
        nodes.push({ x: (li + 1) * xGap, y: H / 2 + 11 * 14, dots: true })
      }
      allNodes.push(nodes)
    })

    // Connections
    for (let li = 0; li < allNodes.length - 1; li++) {
      allNodes[li].forEach(from => {
        allNodes[li + 1].forEach(to => {
          if (from.dots || to.dots) return
          ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y)
          ctx.strokeStyle = COLORS[li % COLORS.length]; ctx.globalAlpha = 0.07; ctx.lineWidth = 0.5; ctx.stroke()
        })
      })
    }
    ctx.globalAlpha = 1

    // Nodes
    allNodes.forEach((nodes, li) => {
      const color = COLORS[li % COLORS.length]
      nodes.forEach(n => {
        if (n.dots) {
          ctx.fillStyle = color; ctx.font = '12px Courier New'; ctx.textAlign = 'center'
          ctx.fillText('...', n.x, n.y); return
        }
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 10)
        g.addColorStop(0, color + '88'); g.addColorStop(1, color + '00')
        ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = color; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1
      })
    })

    // Layer labels
    layers.forEach((layer, li) => {
      const x = (li + 1) * xGap
      ctx.fillStyle = COLORS[li % COLORS.length]; ctx.font = '8px Courier New'; ctx.textAlign = 'center'
      ctx.globalAlpha = 0.6
      ctx.fillText(`L${li + 1}: ${layer.neurons}n`, x, H - 14)
      ctx.fillText(layer.activation, x, H - 4)
      ctx.globalAlpha = 1
    })
  }, [layers])

  React.useEffect(() => { draw() }, [draw])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '200px', display: 'block' }} />
}

export default function NeuralEditor({ onClose }) {
  const { addConcept } = useStore()
  const [layers, setLayers] = useState([
    { neurons: 4, activation: 'ReLU' },
    { neurons: 8, activation: 'ReLU' },
    { neurons: 8, activation: 'Tanh' },
    { neurons: 4, activation: 'Sigmoid' },
  ])
  const [worldType, setWorldType] = useState('dqn')

  const addLayer = () => {
    if (layers.length >= 8) return
    setLayers(l => [...l, { neurons: 4, activation: 'ReLU' }])
    addConcept('backprop')
  }

  const updateLayer = (index, field, value) => {
    setLayers(l => l.map((layer, i) => i === index ? { ...layer, [field]: value } : layer))
  }

  const deleteLayer = (index) => {
    if (layers.length <= 2) return
    setLayers(l => l.filter((_, i) => i !== index))
  }

  const totalParams = layers.reduce((acc, l, i) => {
    if (i === 0) return acc
    return acc + layers[i - 1].neurons * l.neurons + l.neurons
  }, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,5,16,0.95)' }}>
      <div className="max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="hud-border rounded-xl p-5" style={{ borderColor: 'rgba(34,211,238,0.25)' }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-orbitron text-lg font-black text-white tracking-widest">NEURAL ARCHITECT</div>
              <div className="font-mono-tech text-xs text-cyan-500 opacity-60">Build & visualize your own RL network</div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-lg">✕</button>
          </div>

          {/* World type selector */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'dqn', label: 'DQN', color: '#22d3ee' },
              { id: 'policy', label: 'Policy', color: '#c084fc' },
              { id: 'actor', label: 'Actor', color: '#f472b6' },
              { id: 'critic', label: 'Critic', color: '#22d3ee' },
              { id: 'ppo', label: 'PPO', color: '#fbbf24' },
            ].map(w => (
              <button key={w.id} onClick={() => setWorldType(w.id)}
                className="font-mono-tech text-xs px-3 py-1.5 rounded transition-all"
                style={{
                  background: worldType === w.id ? w.color + '20' : 'transparent',
                  border: `1px solid ${worldType === w.id ? w.color + '80' : 'rgba(255,255,255,0.1)'}`,
                  color: worldType === w.id ? w.color : '#6b7280'
                }}>
                {w.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Left: Layer editor */}
            <div>
              <div className="font-orbitron text-xs text-cyan-500 mb-3 tracking-widest">LAYER CONFIGURATION</div>
              <div className="max-h-64 overflow-y-auto pr-1">
                <AnimatePresence>
                  {layers.map((layer, i) => (
                    <LayerCard key={i} layer={layer} index={i}
                      onUpdate={updateLayer} onDelete={deleteLayer}
                      color={COLORS[i % COLORS.length]} />
                  ))}
                </AnimatePresence>
              </div>
              <button onClick={addLayer}
                disabled={layers.length >= 8}
                className="w-full mt-2 py-2 font-mono-tech text-xs rounded transition-all"
                style={{ border: '1px dashed rgba(34,211,238,0.3)', color: '#22d3ee', opacity: layers.length >= 8 ? 0.4 : 1 }}>
                + ADD LAYER
              </button>
            </div>

            {/* Right: Network visualization */}
            <div>
              <div className="font-orbitron text-xs text-cyan-500 mb-3 tracking-widest">NETWORK VISUALIZATION</div>
              <div className="rounded mb-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(34,211,238,0.1)' }}>
                <NetworkCanvas layers={layers} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Layers', value: layers.length, color: '#22d3ee' },
                  { label: 'Parameters', value: totalParams.toLocaleString(), color: '#c084fc' },
                  { label: 'Max Width', value: Math.max(...layers.map(l => l.neurons)), color: '#f472b6' },
                  { label: 'Activations', value: new Set(layers.map(l => l.activation)).size, color: '#fbbf24' },
                ].map(stat => (
                  <div key={stat.label} className="rounded p-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.color}20` }}>
                    <div className="font-orbitron text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="font-mono-tech text-xs opacity-40">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Activation gallery */}
              <div className="mt-3">
                <div className="font-mono-tech text-xs text-gray-600 mb-2">ACTIVATION GALLERY</div>
                <div className="flex flex-wrap gap-2">
                  {ACTIVATIONS.map((fn, i) => (
                    <div key={fn} className="text-center">
                      <ActivationCurve fn={fn} color={COLORS[i]} width={70} height={42} />
                      <div className="font-mono-tech text-xs opacity-50" style={{ color: COLORS[i], fontSize: '8px' }}>{fn}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded" style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)' }}>
            <div className="font-mono-tech text-xs text-cyan-400 opacity-70 leading-relaxed">
              💡 <strong>Tip:</strong> For {worldType === 'dqn' ? 'DQN, use ReLU hidden layers and linear output (one per action)' :
              worldType === 'policy' ? 'Policy networks, use ReLU hidden layers and Sigmoid/Softmax output' :
              worldType === 'critic' ? 'Critic (V-function), use Tanh or ReLU hidden layers with linear scalar output' :
              'Actor-Critic, build two separate networks: Actor outputs action probs, Critic outputs V(s)'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
