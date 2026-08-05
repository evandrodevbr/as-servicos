import * as THREE from 'three'
import type { Quality } from '../engine'
import { addPart, edges, type Part, type SceneMaterials } from './helpers'

/**
 * Ator B da página de Engenharia Elétrica: a casa com instalação (ator A)
 * explode e se recompõe como diagrama unifilar — poste com transformador,
 * circuito em ângulos retos, quadro de distribuição e aterramento.
 */
export function buildEletricaDiagram(
  parts: Part[],
  group: THREE.Group,
  m: SceneMaterials,
  quality: Quality,
) {
  const P = (
    o: THREE.Object3D,
    base: [number, number, number],
    ex: [number, number, number],
    opt = {},
  ) => addPart(parts, group, o, base, ex, opt, quality)

  const line = (pts: THREE.Vector3[], mat: THREE.LineBasicMaterial) =>
    new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat)

  // Poste
  P(edges(new THREE.CylinderGeometry(0.07, 0.1, 3.0, 8), m.gray), [0, 1.5, 0], [0, 4.6, -1.4])
  // Braço com isoladores
  P(edges(new THREE.BoxGeometry(1.7, 0.07, 0.07), m.accent), [0.85, 2.85, 0], [3.4, 5.6, 0.4])
  P(edges(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 6), m.gray), [0.1, 2.98, 0], [0.6, 6.0, 0.6])
  P(edges(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 6), m.gray), [1.6, 2.98, 0], [2.9, 6.2, 0.3])

  // Transformador (caixa com aletas)
  P(edges(new THREE.BoxGeometry(0.95, 0.75, 0.7), m.accent), [0, 2.25, 0], [-1.6, 5.4, 0.6])
  for (const z of [-0.24, 0, 0.24]) {
    P(
      line([new THREE.Vector3(0.49, 1.95, z), new THREE.Vector3(0.49, 2.55, z)], m.gray),
      [0, 0, 0],
      [-1.6, 5.4, 0.6],
    )
  }

  // Cabo do braço ao transformador
  P(
    line(
      [
        new THREE.Vector3(0.1, 2.9, 0),
        new THREE.Vector3(0.1, 2.65, 0),
        new THREE.Vector3(0, 2.65, 0),
      ],
      m.accent,
    ),
    [0, 0, 0],
    [0.8, 5.0, 0.4],
  )

  // Circuito em ângulos retos: transformador → quadro
  P(
    line(
      [
        new THREE.Vector3(0, 1.85, 0),
        new THREE.Vector3(0, 0.45, 0),
        new THREE.Vector3(1.6, 0.45, 0),
        new THREE.Vector3(1.6, 0.45, -1.3),
        new THREE.Vector3(1.6, 1.1, -1.3),
      ],
      m.accent,
    ),
    [0, 0, 0],
    [-0.6, 2.8, -1.8],
  )

  // Quadro de distribuição com disjuntores
  P(edges(new THREE.BoxGeometry(0.65, 1.3, 0.16), m.gray), [1.6, 0.65, -1.3], [4.6, 2.2, -3.6])
  for (let i = 0; i < 4; i++) {
    P(
      line(
        [new THREE.Vector3(1.6, 0.3 + i * 0.28, -1.22), new THREE.Vector3(1.6, 0.3 + i * 0.28, -1.38)],
        m.accent,
      ),
      [0, 0, 0],
      [4.6, 2.2, -3.6],
    )
  }

  // Aterramento: haste + linhas radiais
  P(edges(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 6), m.gray), [0.5, 0.55, 1.7], [0.9, 1.8, 4.4])
  for (const [dx, dz] of [
    [0.7, 0],
    [0.35, 0.55],
    [0.35, -0.55],
  ] as const) {
    P(
      line(
        [new THREE.Vector3(0.5, 0.02, 1.7), new THREE.Vector3(0.5 + dx, 0.02, 1.7 + dz)],
        m.accent,
      ),
      [0, 0, 0],
      [0.9, 1.8, 4.4],
    )
  }

  // Nós energizados (glow)
  if (m.glow) {
    const nodeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.85, 0),
      new THREE.Vector3(1.6, 0.45, -1.3),
      new THREE.Vector3(0.5, 0.55, 1.7),
    ])
    P(new THREE.Points(nodeGeo, m.glow), [0, 0, 0], [0, 3.4, 0])
  }
}
