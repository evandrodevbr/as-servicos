import * as THREE from 'three'
import type { Quality } from '../engine'

/**
 * Helpers compartilhados do motor 3D — extraídos do `SceneEngine` para que
 * as cenas por área (`lib/three/scenes/*.ts`) montem atores com a mesma
 * mecânica de scatter/explode dirigida por scroll.
 */

export type Part = {
  obj: THREE.Object3D
  base: THREE.Vector3
  explode: THREE.Vector3
  scatter: THREE.Vector3
  baseRot: THREE.Euler
  explodeRot: THREE.Euler
  scatterRot: THREE.Euler
  delay: number
}

/** Wireframe das arestas de uma geometria (o material define a cor). */
export function edges(
  geo: THREE.BufferGeometry,
  mat: THREE.LineBasicMaterial,
  threshold = 1,
) {
  const e = new THREE.EdgesGeometry(geo, threshold)
  geo.dispose()
  return new THREE.LineSegments(e, mat)
}

export function addPart(
  list: Part[],
  group: THREE.Group,
  obj: THREE.Object3D,
  base: [number, number, number],
  explode: [number, number, number],
  opts: {
    explodeRot?: [number, number, number]
    baseRot?: [number, number, number]
    delay?: number
  } = {},
  quality: Quality = 'high',
) {
  const scatterRadius = quality === 'low' ? 8 : 14
  const scatter = new THREE.Vector3(
    (Math.random() - 0.5) * scatterRadius * 2,
    (Math.random() - 0.5) * scatterRadius,
    (Math.random() - 0.5) * scatterRadius - 4,
  )
  const baseRot = new THREE.Euler(...(opts.baseRot ?? [0, 0, 0]))
  const part: Part = {
    obj,
    base: new THREE.Vector3(...base),
    explode: new THREE.Vector3(...explode),
    scatter,
    baseRot,
    explodeRot: new THREE.Euler(...(opts.explodeRot ?? [0, 0, 0])).set(
      baseRot.x + (opts.explodeRot?.[0] ?? 0),
      baseRot.y + (opts.explodeRot?.[1] ?? 0),
      baseRot.z + (opts.explodeRot?.[2] ?? 0),
    ),
    scatterRot: new THREE.Euler(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
    ),
    delay: opts.delay ?? Math.random() * 0.35,
  }
  obj.position.copy(part.scatter)
  group.add(obj)
  list.push(part)
}

/** Materiais que as cenas usam — criados pelo engine a partir da paleta. */
export type SceneMaterials = {
  gray: THREE.LineBasicMaterial
  accent: THREE.LineBasicMaterial
  /** Pontos luminosos (nós energizados); ausente quando a cena não tem glow. */
  glow?: THREE.PointsMaterial
}
