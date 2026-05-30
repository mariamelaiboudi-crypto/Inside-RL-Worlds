import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Text, Stars, Float, MeshDistortMaterial, Sphere, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ---------- Hologram shader material ----------
const HologramMaterialImpl = shaderMaterial(
  { time: 0, color: new THREE.Color('#22d3ee'), opacity: 0.85 },
  /* vertex */
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  /* fragment */
  `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      float fresnel = 1.0 - abs(dot(vNormal, vViewDir));
      fresnel = pow(fresnel, 1.8);

      float scan = sin(vUv.y * 90.0 + time * 3.5) * 0.5 + 0.5;
      scan = smoothstep(0.35, 0.65, scan);

      float flicker = 0.93 + 0.07 * sin(time * 53.1 + vUv.x * 17.3);

      float gridX = step(0.93, fract(vUv.x * 14.0));
      float gridY = step(0.93, fract(vUv.y * 14.0));
      float grid = max(gridX, gridY);

      float alpha = (fresnel * 0.65 + scan * 0.18 + grid * 0.17) * flicker * opacity;
      gl_FragColor = vec4(color + grid * 0.25, alpha);
    }
  `
)
extend({ HologramMaterialImpl })

export function HologramMesh({ children, color = '#22d3ee', opacity = 0.85, ...props }) {
  const matRef = useRef()
  useFrame((s) => {
    if (matRef.current) matRef.current.time = s.clock.elapsedTime
  })
  return (
    <mesh {...props}>
      {children}
      <hologramMaterialImpl
        ref={matRef}
        color={new THREE.Color(color)}
        opacity={opacity}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ---------- Flowing energy tube ----------
export function EnergyTube({ from, to, color = '#22d3ee', speed = 1 }) {
  const ref = useRef()
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const mid = start.clone().lerp(end, 0.5)
    mid.y += (end.distanceTo(start)) * 0.25
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    return curve.getPoints(40)
  }, [from, to])

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((s) => {
    if (ref.current) ref.current.material.dashOffset = -s.clock.elapsedTime * speed * 0.8
  })

  return (
    <line ref={ref} geometry={geo}>
      <lineDashedMaterial color={color} dashSize={0.4} gapSize={0.15} transparent opacity={0.7} />
    </line>
  )
}

// ---------- Floating data label ----------
export function DataLabel({ position, text, subtext, color = '#22d3ee' }) {
  const groupRef = useRef()
  useFrame((s) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.7 + position[0]) * 0.15
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <Text fontSize={0.28} color={color} anchorX="center" anchorY="middle">{text}</Text>
      {subtext && (
        <Text position={[0, -0.42, 0]} fontSize={0.18} color={color} anchorX="center" anchorY="middle" fillOpacity={0.55}>
          {subtext}
        </Text>
      )}
    </group>
  )
}

// Animated floating particles
export function ParticleField({ count = 500, color = '#22d3ee', spread = 30 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return pos
  }, [count, spread])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      ref.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.05} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Neural network visualization
export function NeuralNetwork({ position = [0, 0, 0], layers = [4, 6, 6, 4] }) {
  const groupRef = useRef()
  const time = useRef(0)

  useFrame((state) => {
    time.current = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  const nodes = useMemo(() => {
    const result = []
    layers.forEach((count, li) => {
      const x = (li - layers.length / 2 + 0.5) * 2.5
      for (let ni = 0; ni < count; ni++) {
        const y = (ni - count / 2 + 0.5) * 1.2
        result.push({ x, y, layer: li, node: ni })
      }
    })
    return result
  }, [layers])

  return (
    <group ref={groupRef} position={position}>
      {nodes.map((n, i) => (
        <AnimatedNode key={i} position={[n.x, n.y, 0]} layer={n.layer} />
      ))}
      {/* Connections */}
      {layers.slice(0, -1).map((count, li) =>
        Array.from({ length: count }).map((_, ni) =>
          Array.from({ length: layers[li + 1] }).map((_, nj) => (
            <Connection
              key={`${li}-${ni}-${nj}`}
              start={[(li - layers.length / 2 + 0.5) * 2.5, (ni - count / 2 + 0.5) * 1.2, 0]}
              end={[(li + 1 - layers.length / 2 + 0.5) * 2.5, (nj - layers[li + 1] / 2 + 0.5) * 1.2, 0]}
              layerIdx={li}
            />
          ))
        )
      )}
    </group>
  )
}

function AnimatedNode({ position, layer }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(t * 2 + layer * 0.7) * 0.2
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
    </mesh>
  )
}

function Connection({ start, end, layerIdx }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.1 + Math.abs(Math.sin(state.clock.elapsedTime * 1.5 + layerIdx)) * 0.15
    }
  })
  
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [])

  return (
    <line ref={ref} geometry={lineGeometry}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.15} />
    </line>
  )
}

// Floating holographic equation
export function HologramEquation({ text, position, color = '#22d3ee', scale = 1 }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={0.3 * scale}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.ttf"
      >
        {text}
      </Text>
    </group>
  )
}

// Animated ring portal
export function Portal({ position, color, scale = 1, onClick, label }) {
  const outerRef = useRef()
  const innerRef = useRef()
  const [hovered, setHovered] = React.useState(false)

  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z += 0.005
    if (innerRef.current) innerRef.current.rotation.z -= 0.008
  })

  return (
    <group position={position} scale={hovered ? 1.05 : 1} onClick={onClick}
      onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      
      {/* Outer ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[1.5 * scale, 0.06, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={innerRef}>
        <torusGeometry args={[1.1 * scale, 0.04, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.5 : 0.8} transparent opacity={0.7} />
      </mesh>

      {/* Portal disk */}
      <mesh>
        <circleGeometry args={[1 * scale, 64]} />
        <meshStandardMaterial color={color} transparent opacity={hovered ? 0.25 : 0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -2 * scale, 0]}
        fontSize={0.3 * scale}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

// Data stream flowing between points
export function DataStream({ from, to, color = '#22d3ee' }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.dashOffset = -state.clock.elapsedTime * 0.5
    }
  })

  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [])

  return (
    <line ref={ref} geometry={geo}>
      <lineDashedMaterial color={color} dashSize={0.3} gapSize={0.1} transparent opacity={0.6} />
    </line>
  )
}

// Q-value bar visualization
export function QValueBars({ values = [0.8, 0.3, 0.6, 0.9], position = [0, 0, 0] }) {
  const colors = ['#22d3ee', '#c084fc', '#f472b6', '#fbbf24']
  return (
    <group position={position}>
      {values.map((v, i) => (
        <AnimatedBar key={i} height={v * 2} x={(i - values.length / 2 + 0.5) * 0.6} color={colors[i % colors.length]} />
      ))}
    </group>
  )
}

function AnimatedBar({ height, x, color }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      ref.current.scale.y = pulse
    }
  })
  return (
    <mesh ref={ref} position={[x, height / 2, 0]}>
      <boxGeometry args={[0.3, height, 0.3]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.85} />
    </mesh>
  )
}

// Glowing sphere core
export function CoreOrb({ position = [0, 0, 0], color = '#22d3ee', size = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.distort = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          ref={ref}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  )
}
