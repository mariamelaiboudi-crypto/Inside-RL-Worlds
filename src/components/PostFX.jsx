import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

export default function PostFX({ intensity = 1.5, vignetteStrength = 0.85 }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.06}
        luminanceSmoothing={0.9}
        intensity={intensity}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
      <Vignette
        offset={0.18}
        darkness={vignetteStrength}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
