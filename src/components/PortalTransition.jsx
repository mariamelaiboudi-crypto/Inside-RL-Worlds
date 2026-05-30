import { motion, AnimatePresence } from 'framer-motion'

const RINGS = [1.0, 0.82, 0.64, 0.48, 0.34, 0.20]

export default function PortalTransition({ isTransitioning, color = '#22d3ee' }) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.15 }}
        >
          {/* Background radial dark wash */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,3,10,0.96) 65%)`,
            }}
          />

          {/* Expanding wormhole rings */}
          {RINGS.map((scale, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, scale * 3.5],
                opacity: [0, 0.9, 0],
                rotate: i % 2 === 0 ? 270 : -270,
              }}
              transition={{
                duration: 0.75,
                delay: i * 0.06,
                ease: 'easeOut',
              }}
              style={{
                width: 180,
                height: 180,
                border: `2px solid ${color}`,
                boxShadow: `0 0 ${14 + i * 4}px ${color}80, inset 0 0 ${8 + i * 2}px ${color}30`,
              }}
            />
          ))}

          {/* Central energy burst */}
          <motion.div
            className="absolute rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.2, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeInOut' }}
            style={{
              width: 90,
              height: 90,
              background: `radial-gradient(circle, white 0%, ${color} 35%, transparent 70%)`,
              boxShadow: `0 0 50px ${color}, 0 0 100px ${color}60`,
            }}
          />

          {/* Inner core flash */}
          <motion.div
            className="absolute rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0.8, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.3, delay: 0.18 }}
            style={{
              width: 30,
              height: 30,
              background: 'white',
              boxShadow: '0 0 30px white, 0 0 60px white',
            }}
          />

          {/* Dimensional text */}
          <motion.div
            className="absolute font-orbitron text-xs tracking-[0.35em] select-none"
            style={{ bottom: '36%', color }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
            transition={{ duration: 0.75, times: [0, 0.2, 0.7, 1] }}
          >
            ENTERING NEW DIMENSION
          </motion.div>

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
