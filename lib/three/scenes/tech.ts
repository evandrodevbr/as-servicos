import * as THREE from 'three'
import type { Quality } from '../engine'
import { addPart, edges, type Part, type SceneMaterials } from './helpers'

/**
 * Ator B da página de Tecnologia: a placa-mãe (ator A) explode e se recompõe
 * como "nuvem de software" — torre de servidores, terminal, malha de nós
 * conectados e o anel da nuvem por cima.
 */
export function buildTechCloud(
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

  // Torre de servidores (3 racks empilhados)
  for (let i = 0; i < 3; i++) {
    P(
      edges(new THREE.BoxGeometry(1.5, 0.45, 0.9), m.gray),
      [-1.7, 0.4 + i * 0.5, -0.8],
      [-4.8, 0.2 + i * 1.1, -2.6 + i * 0.4],
    )
    // Slots frontais
    for (let s = 0; s < 3; s++) {
      P(
        line(
          [
            new THREE.Vector3(-1.7, 0.28 + i * 0.5 + s * 0.13, -1.25),
            new THREE.Vector3(-1.7, 0.28 + i * 0.5 + s * 0.13, -0.35),
          ],
          m.accent,
        ),
        [0, 0, 0],
        [-4.8, 0.2 + i * 1.1, -2.6 + i * 0.4],
      )
    }
  }

  // Terminal com linhas de "código"
  P(edges(new THREE.BoxGeometry(1.3, 0.85, 0.07), m.gray), [-1.7, 2.15, 0.9], [-4.6, 3.8, 2.8])
  for (let i = 0; i < 3; i++) {
    P(
      line(
        [
          new THREE.Vector3(-2.25, 1.95 - i * 0.24, 0.94),
          new THREE.Vector3(-1.35, 1.95 - i * 0.24, 0.94),
        ],
        m.accent,
      ),
      [0, 0, 0],
      [-4.6, 3.8, 2.8],
    )
  }

  // Anel da nuvem
  P(
    edges(new THREE.TorusGeometry(1.7, 0.07, 8, 40), m.accent),
    [1.3, 1.4, 0.2],
    [3.6, 4.4, 1.6],
    { baseRot: [1.15, 0, 0], explodeRot: [0.4, 0, 0] },
  )

  // Malha de nós conectados
  const nodes = [
    new THREE.Vector3(0.6, 0.5, 1.1),
    new THREE.Vector3(2.3, 0.9, 0.5),
    new THREE.Vector3(1.2, 0.3, -1.2),
    new THREE.Vector3(2.6, 1.6, -0.6),
  ]
  for (let i = 0; i < nodes.length; i++) {
    P(edges(new THREE.OctahedronGeometry(0.17), m.gray), [nodes[i].x, nodes[i].y, nodes[i].z], [
      nodes[i].x * 1.8 + 1.2,
      nodes[i].y + 2.6,
      nodes[i].z * 1.8 - 1.4,
    ])
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      P(
        line([nodes[i], nodes[j]], m.gray),
        [0, 0, 0],
        [0.8, 3.0, 0.6],
        { delay: 0.1 + (i + j) * 0.05 },
      )
    }
    P(
      line([nodes[i], new THREE.Vector3(-0.95, 0.62, -0.8)], m.gray),
      [0, 0, 0],
      [0.4, 2.8, -1.4],
    )
  }

  // Nós luminosos (glow)
  if (m.glow) {
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes)
    P(new THREE.Points(nodeGeo, m.glow), [0, 0, 0], [0, 3.6, 0])
  }
}
