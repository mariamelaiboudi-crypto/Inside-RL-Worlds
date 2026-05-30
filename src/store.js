import { create } from 'zustand'

export const useStore = create((set) => ({
  currentWorld: 'hub',
  guideMessage: '',
  guideVisible: false,
  hudVisible: true,
  score: 0,
  exploredConcepts: new Set(),
  isTransitioning: false,
  transitionColor: '#22d3ee',

  setWorld: (world) => set({ currentWorld: world }),

  startTransition: (color = '#22d3ee') =>
    set({ isTransitioning: true, transitionColor: color }),

  endTransition: () => set({ isTransitioning: false }),

  setGuide: (msg) => set({ guideMessage: msg, guideVisible: !!msg }),
  hideGuide: () => set({ guideVisible: false }),

  addConcept: (concept) =>
    set((s) => {
      if (s.exploredConcepts.has(concept)) return {}
      return {
        exploredConcepts: new Set([...s.exploredConcepts, concept]),
        score: s.score + 10,
      }
    }),
}))
