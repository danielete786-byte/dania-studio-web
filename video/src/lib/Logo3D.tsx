import React, { useEffect, useMemo, useState } from 'react'
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ease, sp, tween } from './motion'

const useGlb = (file: string) => {
  const [handle] = useState(() => delayRender('Cargando ' + file))
  const [scene, setScene] = useState<{ obj: THREE.Object3D; handle: number } | null>(null)
  useEffect(() => {
    const draco = new DRACOLoader().setDecoderPath(staticFile('draco/'))
    new GLTFLoader().setDRACOLoader(draco).load(staticFile(file), (g) => {
      const m = g.scene
      const box = new THREE.Box3().setFromObject(m)
      const size = box.getSize(new THREE.Vector3())
      m.position.sub(box.getCenter(new THREE.Vector3()))
      const wrap = new THREE.Group()
      wrap.add(m)
      wrap.scale.setScalar(2.6 / Math.max(size.x, size.y))
      setScene({ obj: wrap, handle })
    }, undefined, (e) => { console.error('Error cargando GLB', e); continueRender(handle) })
    return () => { draco.dispose() }
  }, [file, handle])
  return scene
}

const Env: React.FC = () => {
  const { gl, scene } = useThree()
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.15
  }, [gl, scene])
  return null
}

const Model: React.FC<{ delay: number; obj: THREE.Object3D; handle: number }> = ({ delay, obj, handle }) => {
  const advance = useThree((st) => st.advance)
  // El modelo llega de forma asíncrona: forzamos un redibujado y solo entonces liberamos el render.
  // (ThreeCanvas usa frameloop="never": hay que avanzar a mano).
  useEffect(() => {
    advance(performance.now())
    const id = requestAnimationFrame(() => continueRender(handle))
    return () => cancelAnimationFrame(id)
  }, [advance, handle])
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = sp(frame, fps, delay, 'heavy')
  const f = frame - delay
  // Entra girando desde atrás, se asienta y queda flotando suavemente.
  const rotY = (1 - s) * -Math.PI * 1.35 + Math.sin(f / 38) * 0.12
  const rotX = (1 - s) * 0.5 + Math.sin(f / 52) * 0.05
  const z = tween(frame, [delay, delay + 60], [-6, 0])
  const lightX = tween(frame, [delay + 20, delay + 90], [-4, 4], ease.inOutCubic)

  return (
    <>
      <Env />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff1d6" />
      <pointLight position={[lightX, 0.6, 2]} intensity={16 * s} distance={7} color="#f2c94c" />
      <group position={[0, Math.sin(f / 30) * 0.05, z]} rotation={[rotX, rotY, 0]} scale={0.7 + s * 0.3}>
        <primitive object={obj} />
      </group>
    </>
  )
}

/** Logo 3D real de DanIA (GLB) con entrada cinematográfica. */
export const Logo3D: React.FC<{ delay?: number; width?: number; height?: number }> = ({ delay = 0, width, height }) => {
  const cfg = useVideoConfig()
  // Se carga fuera del lienzo 3D para que delayRender() bloquee el render hasta tener el modelo.
  const glb = useGlb('logo/dania-logo-3d.glb')
  const w = width ?? cfg.width, h = height ?? cfg.height
  // En vertical alejamos la cámara para que el logo quepa a lo ancho (~85 %).
  const camZ = w >= h ? 6.2 : 3.1 / (2 * Math.tan((15 * Math.PI) / 180) * (w / h))
  return (
    <ThreeCanvas width={w} height={h} camera={{ fov: 30, position: [0, 0, camZ] }}
      gl={{ antialias: true, alpha: true }} linear={false} flat={false}>
      {glb && <Model delay={delay} obj={glb.obj} handle={glb.handle} />}
    </ThreeCanvas>
  )
}
