import * as THREE from 'three'
import type { Quality } from '../engine'
import { addPart, edges, type Part, type SceneMaterials } from './helpers'

/**
 * Ator B da página de Engenharia Civil: a casa wireframe (ator A) explode e
 * se recompõe como planta baixa técnica — paredes em vista de topo, vãos,
 * eixos e linhas de cota com setas, como uma prancha de projeto.
 */
export function buildCivilPlant(
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

  // Laje / perímetro da planta
  P(edges(new THREE.BoxGeometry(4.6, 0.1, 3.4), m.gray), [0, 0.06, 0], [0, -1.8, 0])

  // Paredes internas (vista de topo)
  P(edges(new THREE.BoxGeometry(0.1, 0.12, 1.5), m.gray), [-1.1, 0.12, 0.4], [-3.8, 1.4, 1.6])
  P(edges(new THREE.BoxGeometry(0.1, 0.12, 1.3), m.gray), [1.3, 0.12, -0.5], [4.0, 1.2, -1.8])
  P(edges(new THREE.BoxGeometry(1.6, 0.12, 0.1), m.gray), [0.1, 0.12, 1.0], [0.4, 1.8, 4.2])

  // Vãos de porta marcados no piso
  P(edges(new THREE.BoxGeometry(0.7, 0.02, 0.08), m.accent), [0.5, 0.02, 1.0], [1.8, 1.6, 3.9])
  P(edges(new THREE.BoxGeometry(0.7, 0.02, 0.08), m.accent), [-1.1, 0.02, 1.15], [-3.6, 1.5, 3.8])

  // Eixos (círculos nos cantos)
  for (const [x, z] of [
    [-2.3, -1.7],
    [2.3, -1.7],
    [-2.3, 1.7],
    [2.3, 1.7],
  ] as const) {
    P(
      edges(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 16), m.gray),
      [x, 0.03, z],
      [x * 1.7, 0.2, z * 1.6],
    )
  }

  // Linhas-guia ligando o perímetro às cotas
  P(line([new THREE.Vector3(-2.3, 0.12, 1.85), new THREE.Vector3(-2.3, 0.12, 2.12)], m.gray), [0, 0, 0], [0, 2.2, 0.6])
  P(line([new THREE.Vector3(2.3, 0.12, 1.85), new THREE.Vector3(2.3, 0.12, 2.12)], m.gray), [0, 0, 0], [0, 2.2, 0.6])

  // Cota horizontal com setas
  const arrow = (x: number, z: number, dir: 1 | -1, mat: THREE.LineBasicMaterial) =>
    line(
      [
        new THREE.Vector3(x, 0.14, z),
        new THREE.Vector3(x - dir * 0.16, 0.14, z - 0.16),
        new THREE.Vector3(x, 0.14, z),
        new THREE.Vector3(x - dir * 0.16, 0.14, z + 0.16),
      ],
      mat,
    )
  P(line([new THREE.Vector3(-2.7, 0.14, 2.14), new THREE.Vector3(2.7, 0.14, 2.14)], m.accent), [0, 0, 0], [0, 2.6, 0.8])
  P(arrow(-2.7, 2.14, 1, m.accent), [0, 0, 0], [0, 2.6, 0.8])
  P(arrow(2.7, 2.14, -1, m.accent), [0, 0, 0], [0, 2.6, 0.8])

  // Cota vertical com setas
  P(line([new THREE.Vector3(-2.78, 0.14, -1.9), new THREE.Vector3(-2.78, 0.14, 1.9)], m.accent), [0, 0, 0], [-1.2, 2.4, 0])
  P(arrow(-2.78, -1.9, 1, m.accent), [0, 0, 0], [-1.2, 2.4, 0])
  P(arrow(-2.78, 1.9, -1, m.accent), [0, 0, 0], [-1.2, 2.4, 0])

  // Norte / carimbo de prancha: quadrado pequeno com linha
  P(edges(new THREE.BoxGeometry(0.5, 0.02, 0.7), m.accent), [2.0, 0.02, 1.5], [5.2, 0.5, 3.2])
}
