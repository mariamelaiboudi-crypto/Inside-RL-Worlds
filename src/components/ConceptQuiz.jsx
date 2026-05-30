import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const QUESTIONS = [
  { q:'What does the Q in Q-learning stand for?', opts:['Quality','Quantity','Queue','Quantum'], ans:0, concept:'Q-value',
    explain:'Q(s,a) stands for "Quality" — the expected total discounted reward from state s taking action a then following the optimal policy.' },
  { q:'Which equation is the Bellman equation?', opts:['V(s) = max R(s)','Q(s,a) = R + γ·max Q(s\',a\')','π(a|s) = softmax(Q)','A = Q - V'], ans:1, concept:'bellman',
    explain:'The Bellman equation decomposes the value of a state-action pair into the immediate reward plus the discounted best future value.' },
  { q:'What is ε in ε-greedy exploration?', opts:['Learning rate','Discount factor','Exploration probability','Entropy weight'], ans:2, concept:'exploration',
    explain:'ε is the probability of choosing a random action (exploration) rather than the greedy best action (exploitation).' },
  { q:'What does the Critic output in Actor-Critic?', opts:['Action probabilities','Q-values for all actions','State value V(s)','TD error directly'], ans:2, concept:'critic',
    explain:'The Critic estimates V(s), the expected return from state s. This baseline helps compute the Advantage A = Q - V.' },
  { q:'What is experience replay used for?', opts:['Speeding up training','Breaking temporal correlations','Estimating V(s)','Computing TD error'], ans:1, concept:'replay',
    explain:'Replay memory stores transitions and samples random mini-batches, breaking temporal correlations that would destabilize neural network training.' },
  { q:'What is the Advantage function A(s,a)?', opts:['A = r + γV(s\')','A = Q(s,a) - V(s)','A = logπ(a|s)','A = Σγᵗrₜ'], ans:1, concept:'advantage',
    explain:'A(s,a) = Q(s,a) - V(s) measures how much better action a is compared to the average action in state s. It guides the Actor update.' },
  { q:'In REINFORCE, gradients are scaled by…', opts:['TD error','Entropy','Episode return R','Q-value'], ans:2, concept:'gradient',
    explain:'REINFORCE scales ∇logπ(a|s) by the total episode return R. Actions in high-return episodes get reinforced; low-return ones get suppressed.' },
  { q:'What is bootstrapping in TD learning?', opts:['Sampling mini-batches','Using current estimate to update itself','Running full episodes','Copying weights'], ans:1, concept:'bootstrap',
    explain:'Bootstrapping means using the current estimate V(s\') to compute the update target r+γV(s\'), rather than waiting for the true return.' },
]

export default function ConceptQuiz({ onClose }) {
  const { addConcept } = useStore()
  const [qi, setQi]         = useState(0)
  const [chosen, setChosen] = useState(null)
  const [correct, setCorrect] = useState(null)
  const [score, setScore]   = useState(0)
  const [done, setDone]     = useState(false)
  const q = QUESTIONS[qi]

  const choose = (idx) => {
    if (chosen !== null) return
    setChosen(idx)
    const ok = idx === q.ans
    setCorrect(ok)
    if (ok) { setScore(s => s + 1); addConcept(q.concept) }
  }

  const next = () => {
    if (qi + 1 >= QUESTIONS.length) { setDone(true); return }
    setQi(qi + 1); setChosen(null); setCorrect(null)
  }

  return (
    <motion.div
      initial={{ opacity:0, scale:0.93 }}
      animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.93 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,5,16,0.92)' }}
    >
      <div className="hud-border rounded-xl p-6 max-w-lg w-full" style={{ borderColor:'rgba(34,211,238,0.25)' }}>
        {!done ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="font-orbitron text-xs text-cyan-500 tracking-widest">
                CONCEPT QUIZ — {qi+1}/{QUESTIONS.length}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-orbitron text-amber-400 text-sm">{score} ✓</span>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-sm">✕</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-gray-900 rounded-full mb-5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width:`${((qi+1)/QUESTIONS.length)*100}%` }} />
            </div>

            {/* Question */}
            <p className="font-mono-tech text-sm text-white mb-5 leading-relaxed">{q.q}</p>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {q.opts.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.03)', border = 'rgba(255,255,255,0.1)', color = '#9ca3af'
                if (chosen !== null) {
                  if (i === q.ans) { bg='rgba(74,222,128,0.15)'; border='rgba(74,222,128,0.5)'; color='#4ade80' }
                  else if (i === chosen && !correct) { bg='rgba(248,113,113,0.15)'; border='rgba(248,113,113,0.5)'; color='#f87171' }
                }
                return (
                  <button key={i} onClick={() => choose(i)}
                    className="w-full text-left px-4 py-2.5 rounded font-mono-tech text-xs transition-all duration-300"
                    style={{ background:bg, border:`1px solid ${border}`, color }}>
                    <span className="opacity-50 mr-2">{['A','B','C','D'][i]}.</span>{opt}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {chosen !== null && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  className="rounded p-3 mb-4"
                  style={{ background: correct ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                           border: `1px solid ${correct ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}` }}>
                  <div className="font-orbitron text-xs mb-1" style={{ color: correct ? '#4ade80' : '#f87171' }}>
                    {correct ? '✓ CORRECT' : '✗ INCORRECT'}
                  </div>
                  <p className="font-mono-tech text-xs text-gray-300 leading-relaxed opacity-80">{q.explain}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {chosen !== null && (
              <button onClick={next}
                className="w-full py-2.5 font-orbitron text-xs tracking-widest rounded transition-all"
                style={{ background:'rgba(34,211,238,0.15)', border:'1px solid rgba(34,211,238,0.4)', color:'#22d3ee' }}>
                {qi + 1 < QUESTIONS.length ? 'NEXT QUESTION →' : 'SEE RESULTS →'}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="font-orbitron text-3xl font-black text-white mb-2">{score}/{QUESTIONS.length}</div>
            <div className="font-mono-tech text-cyan-400 mb-2">
              {score >= 7 ? '🏆 MASTER AGENT' : score >= 5 ? '✨ LEARNING AGENT' : '🌱 NOVICE AGENT'}
            </div>
            <div className="font-mono-tech text-xs text-gray-500 mb-6">
              {score * 10} bonus XP earned · {QUESTIONS.length - score} concepts to review
            </div>
            <button onClick={onClose}
              className="px-8 py-3 font-orbitron text-xs tracking-widest rounded"
              style={{ background:'linear-gradient(135deg,#22d3ee,#c084fc)', color:'#000' }}>
              BACK TO RL CORE
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
