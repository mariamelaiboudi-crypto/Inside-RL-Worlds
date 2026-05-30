import React, { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store'
import { AudioProvider } from './components/AudioSystem'
import PortalTransition from './components/PortalTransition'
import HubWorld from './worlds/HubWorld'
import DQNWorld from './worlds/DQNWorld'
import PolicyWorld from './worlds/PolicyWorld'
import ActorCriticWorld from './worlds/ActorCriticWorld'
import TDWorld from './worlds/TDWorld'
import EnvironmentWorld from './worlds/EnvironmentWorld'
import PPOWorld from './worlds/PPOWorld'
import HUD from './components/HUD'
import GuideAI from './components/GuideAI'
import IntroScreen from './components/IntroScreen'
import LoadingScreen from './components/LoadingScreen'
import TrainingSimulator from './components/TrainingSimulator'
import ConceptQuiz from './components/ConceptQuiz'
import MathHolo from './components/MathHolo'
import NeuralEditor from './components/NeuralEditor'
import RLTimeline from './components/RLTimeline'
import AlgoComparison from './components/AlgoComparison'

function FloatingBar({ world }) {
  const [showSim,      setShowSim]      = useState(false)
  const [showQuiz,     setShowQuiz]     = useState(false)
  const [showMath,     setShowMath]     = useState(false)
  const [showEditor,   setShowEditor]   = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showArena,    setShowArena]    = useState(false)

  const tools = [
    { label: '📊', title: 'Training Simulator', action: () => setShowSim(s => !s) },
    { label: '📐', title: 'Math Equations',     action: () => setShowMath(true) },
    { label: '❓', title: 'Concept Quiz',       action: () => setShowQuiz(true) },
    { label: '🧠', title: 'Neural Architect',   action: () => setShowEditor(true) },
    { label: '📅', title: 'RL History',         action: () => setShowTimeline(true) },
    { label: '⚔️', title: 'Algo Arena',         action: () => setShowArena(true) },
  ]

  return (
    <>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-40 flex gap-1.5">
        {tools.map(b => (
          <button key={b.label} onClick={b.action} title={b.title}
            className="font-orbitron text-base w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center"
            style={{ background: 'rgba(0,5,16,0.92)', border: '1px solid rgba(34,211,238,0.2)',
                     backdropFilter: 'blur(12px)' }}>
            {b.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showSim && world !== 'hub' && (
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:30 }}
            className="absolute top-20 right-5 z-40">
            <TrainingSimulator world={world} />
            <button onClick={() => setShowSim(false)}
              className="mt-1 w-full font-mono-tech text-xs text-gray-600 hover:text-gray-400 transition-colors text-center">
              hide
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showQuiz     && <ConceptQuiz    onClose={() => setShowQuiz(false)}    />}</AnimatePresence>
      <AnimatePresence>{showMath     && <MathHolo       onClose={() => setShowMath(false)}    />}</AnimatePresence>
      <AnimatePresence>{showEditor   && <NeuralEditor   onClose={() => setShowEditor(false)}  />}</AnimatePresence>
      <AnimatePresence>{showTimeline && <RLTimeline     onClose={() => setShowTimeline(false)}/>}</AnimatePresence>
      <AnimatePresence>{showArena    && <AlgoComparison onClose={() => setShowArena(false)}   />}</AnimatePresence>
    </>
  )
}

function WorldContainer() {
  const { currentWorld, isTransitioning, transitionColor } = useStore()
  const [loading,   setLoading]   = useState(true)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  if (loading)   return <LoadingScreen />
  if (showIntro) return <IntroScreen onStart={() => setShowIntro(false)} />

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWorld}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {currentWorld === 'hub'          && <HubWorld />}
          {currentWorld === 'dqn'          && <DQNWorld />}
          {currentWorld === 'policy'       && <PolicyWorld />}
          {currentWorld === 'actor-critic' && <ActorCriticWorld />}
          {currentWorld === 'td'           && <TDWorld />}
          {currentWorld === 'environment'  && <EnvironmentWorld />}
          {currentWorld === 'ppo'          && <PPOWorld />}
        </motion.div>
      </AnimatePresence>

      <HUD />
      <GuideAI />
      <FloatingBar world={currentWorld} />

      <PortalTransition isTransitioning={isTransitioning} color={transitionColor} />
    </div>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <WorldContainer />
    </AudioProvider>
  )
}
