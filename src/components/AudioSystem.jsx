import { createContext, useContext, useRef, useState, useCallback } from 'react'

const AudioCtx = createContext(null)
export const useAudio = () => useContext(AudioCtx)

// --- Procedural sound generators ---

function buildDrone(ctx) {
  const master = ctx.createGain()
  master.gain.value = 0.0
  master.connect(ctx.destination)

  // Deep sub bass (40 Hz)
  const sub = ctx.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = 40
  const subGain = ctx.createGain()
  subGain.gain.value = 0.35
  sub.connect(subGain)
  subGain.connect(master)
  sub.start()

  // Mid pad (220 Hz) + slight detune for beating effect
  const mid = ctx.createOscillator()
  mid.type = 'triangle'
  mid.frequency.value = 220
  const mid2 = ctx.createOscillator()
  mid2.type = 'triangle'
  mid2.frequency.value = 221.8
  const midGain = ctx.createGain()
  midGain.gain.value = 0.18
  mid.connect(midGain)
  mid2.connect(midGain)

  // Short feedback delay for spaciousness
  const delay = ctx.createDelay(1.0)
  delay.delayTime.value = 0.38
  const delayFb = ctx.createGain()
  delayFb.gain.value = 0.28
  midGain.connect(master)
  midGain.connect(delay)
  delay.connect(delayFb)
  delayFb.connect(delay)
  delayFb.connect(master)
  mid.start()
  mid2.start()

  // High shimmer (1760 Hz A6)
  const hi = ctx.createOscillator()
  hi.type = 'sine'
  hi.frequency.value = 1760
  const hiGain = ctx.createGain()
  hiGain.gain.value = 0.025
  hi.connect(hiGain)
  hiGain.connect(master)
  hi.start()

  // LFO slow wobble on mid
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.07
  const lfoAmt = ctx.createGain()
  lfoAmt.gain.value = 6
  lfo.connect(lfoAmt)
  lfoAmt.connect(mid.frequency)
  lfo.start()

  return { master, oscillators: [sub, mid, mid2, hi, lfo] }
}

export function playUIClick(ctx) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.09)
  gain.gain.setValueAtTime(0.22, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.1)
}

export function playPortalEnter(ctx) {
  if (!ctx) return
  ;[0, 100, 200].forEach((delayMs, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      const base = 150 * Math.pow(2, i * 0.6)
      osc.frequency.setValueAtTime(base, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(base * 5, ctx.currentTime + 0.65)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.65)
    }, delayMs)
  })
}

export function playConceptUnlock(ctx) {
  if (!ctx) return
  const freqs = [523, 659, 784, 1047]
  freqs.forEach((f, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    }, i * 80)
  })
}

// --- Provider ---

export function AudioProvider({ children }) {
  const [audioCtx, setAudioCtx] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const droneRef = useRef(null)

  const initialize = useCallback(() => {
    if (audioCtx) return audioCtx
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const drone = buildDrone(ctx)
    droneRef.current = drone
    drone.master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5)
    setAudioCtx(ctx)
    setEnabled(true)
    return ctx
  }, [audioCtx])

  const toggle = useCallback(() => {
    if (!audioCtx) {
      initialize()
      return
    }
    if (enabled) {
      droneRef.current?.master.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4)
      setEnabled(false)
    } else {
      droneRef.current?.master.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.6)
      setEnabled(true)
    }
  }, [audioCtx, enabled, initialize])

  return (
    <AudioCtx.Provider value={{ audioCtx, enabled, initialize }}>
      {children}
      <button
        onClick={toggle}
        title={enabled ? 'Mute ambient audio' : 'Enable ambient audio'}
        className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(0,5,16,0.92)',
          border: `1px solid rgba(34,211,238,${enabled ? '0.55' : '0.15'})`,
          backdropFilter: 'blur(12px)',
          boxShadow: enabled ? '0 0 12px rgba(34,211,238,0.18)' : 'none',
        }}
      >
        <span style={{ fontSize: '14px' }}>{enabled ? '🔊' : '🔇'}</span>
      </button>
    </AudioCtx.Provider>
  )
}
