import * as THREE from 'three'

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                            */
/* -------------------------------------------------------------------------- */

export type Quality = 'high' | 'medium' | 'low' | 'static'

const GRAY = 0x9aa0a6
const BLUE = 0x2f6bff
const DIM = 0x4a4f55

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Part = {
  obj: THREE.Object3D
  base: THREE.Vector3
  explode: THREE.Vector3
  scatter: THREE.Vector3
  baseRot: THREE.Euler
  explodeRot: THREE.Euler
  scatterRot: THREE.Euler
  delay: number
}

function edges(
  geo: THREE.BufferGeometry,
  mat: THREE.LineBasicMaterial,
  threshold = 1,
) {
  const e = new THREE.EdgesGeometry(geo, threshold)
  geo.dispose()
  return new THREE.LineSegments(e, mat)
}

/* -------------------------------------------------------------------------- */
/*  Engine                                                                     */
/* -------------------------------------------------------------------------- */

export class SceneEngine {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private root = new THREE.Group()
  private houseGroup = new THREE.Group()
  private boardGroup = new THREE.Group()
  private houseParts: Part[] = []
  private boardParts: Part[] = []
  private materials: THREE.Material[] = []
  private points?: THREE.Points
  private pointsMat?: THREE.PointsMaterial
  private grid?: THREE.LineSegments
  private gridMat?: THREE.LineBasicMaterial

  private matHouseGray!: THREE.LineBasicMaterial
  private matHouseBlue!: THREE.LineBasicMaterial
  private matBoardGray!: THREE.LineBasicMaterial
  private matBoardBlue!: THREE.LineBasicMaterial

  private raf = 0
  private disposed = false
  private quality: Quality
  private reducedMotion: boolean

  /** 0 → 1, driven externally by the intro (anime.js) timeline */
  public intro = 0
  /** 0 → 1 raw scroll progress; smoothed internally */
  public targetProgress = 0
  private progress = 0
  private pointer = new THREE.Vector2(0, 0)
  private pointerTarget = new THREE.Vector2(0, 0)
  private camTmp = new THREE.Vector3()
  private lookTmp = new THREE.Vector3()
  /** cronometragem manual — THREE.Clock está depreciado */
  private lastTime = 0
  private elapsed = 0

  constructor(canvas: HTMLCanvasElement, quality: Quality, reducedMotion: boolean) {
    this.quality = quality
    this.reducedMotion = reducedMotion

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: quality === 'high',
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1.35),
    )

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000000, 0.045)

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      120,
    )
    this.camera.position.set(0, 1.6, 10)

    this.scene.add(this.root)
    this.root.add(this.houseGroup, this.boardGroup)

    this.buildMaterials()
    this.buildHouse()
    this.buildBoard()
    this.buildAmbient()

    this.resize()
  }

  /* ------------------------------ construction ---------------------------- */

  private buildMaterials() {
    const mk = (color: number, opacity: number) => {
      const m = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      })
      this.materials.push(m)
      return m
    }
    this.matHouseGray = mk(GRAY, 0.55)
    this.matHouseBlue = mk(BLUE, 0.95)
    this.matBoardGray = mk(GRAY, 0.55)
    this.matBoardBlue = mk(BLUE, 0.95)
  }

  private addPart(
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
  ) {
    const scatterRadius = this.quality === 'low' ? 8 : 14
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

  /** Wireframe house: foundation → walls → roof → elétrica / SPDA */
  private buildHouse() {
    const g = this.matHouseGray
    const b = this.matHouseBlue
    const P = (o: THREE.Object3D, base: [number, number, number], ex: [number, number, number], opt = {}) =>
      this.addPart(this.houseParts, this.houseGroup, o, base, ex, opt)

    // Fundação
    P(edges(new THREE.BoxGeometry(4.8, 0.4, 3.6), g), [0, -1.7, 0], [0, -3.4, 0])
    // Laje
    P(edges(new THREE.BoxGeometry(4.4, 0.14, 3.3), g), [0, -1.42, 0], [0, -2.3, 0])

    // Paredes
    P(edges(new THREE.BoxGeometry(4.4, 2.3, 0.14), g), [0, -0.2, 1.6], [0, -0.1, 4.6], {
      explodeRot: [0.1, 0, 0],
    })
    P(edges(new THREE.BoxGeometry(4.4, 2.3, 0.14), g), [0, -0.2, -1.6], [0, -0.1, -4.6], {
      explodeRot: [-0.1, 0, 0],
    })
    P(edges(new THREE.BoxGeometry(0.14, 2.3, 3.3), g), [-2.2, -0.2, 0], [-5.2, 0.1, 0], {
      explodeRot: [0, 0, 0.12],
    })
    P(edges(new THREE.BoxGeometry(0.14, 2.3, 3.3), g), [2.2, -0.2, 0], [5.2, 0.1, 0], {
      explodeRot: [0, 0, -0.12],
    })

    // Esquadrias
    P(edges(new THREE.BoxGeometry(0.95, 1.7, 0.08), g), [-1.2, -0.55, 1.66], [-1.9, -0.7, 5.6])
    P(edges(new THREE.BoxGeometry(1.1, 0.8, 0.08), g), [0.9, 0.15, 1.66], [1.6, 0.4, 5.4])
    P(edges(new THREE.BoxGeometry(0.08, 0.9, 1.2), g), [-2.24, 0.15, -0.4], [-6.0, 0.5, -0.9])

    // Telhado (duas águas)
    P(edges(new THREE.BoxGeometry(4.9, 0.1, 2.25), g), [0, 1.55, 0.85], [0, 4.3, 2.4], {
      baseRot: [0.42, 0, 0],
      explodeRot: [0.15, 0, 0],
    })
    P(edges(new THREE.BoxGeometry(4.9, 0.1, 2.25), g), [0, 1.55, -0.85], [0, 4.3, -2.4], {
      baseRot: [-0.42, 0, 0],
      explodeRot: [-0.15, 0, 0],
    })
    // Cumeeira
    P(edges(new THREE.BoxGeometry(5.0, 0.09, 0.09), g), [0, 2.02, 0], [0, 5.6, 0])

    // Estrutura: pilares
    for (const [x, z] of [
      [-2.2, 1.6],
      [2.2, 1.6],
      [-2.2, -1.6],
      [2.2, -1.6],
    ] as const) {
      P(
        edges(new THREE.BoxGeometry(0.22, 2.5, 0.22), g),
        [x, -0.2, z],
        [x * 1.9, -0.2, z * 1.9],
      )
    }

    // ---------- Instalação elétrica (azul) ----------
    const conduitPts = [
      new THREE.Vector3(-2.0, 0.9, 1.5),
      new THREE.Vector3(0, 0.9, 1.5),
      new THREE.Vector3(0, 0.9, -1.5),
      new THREE.Vector3(2.0, 0.9, -1.5),
      new THREE.Vector3(2.0, -0.3, -1.5),
    ]
    const conduit = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(conduitPts),
      b,
    )
    P(conduit, [0, 0, 0], [0, 1.6, 0])

    const circuitPts: THREE.Vector3[] = []
    for (let i = 0; i < 9; i++) {
      const x = -2 + (i / 8) * 4
      circuitPts.push(new THREE.Vector3(x, -1.3, -1.4), new THREE.Vector3(x, -1.3, 1.4))
    }
    P(
      new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(circuitPts), b),
      [0, 0, 0],
      [0, -1.1, 0],
    )

    // Quadro de distribuição
    P(edges(new THREE.BoxGeometry(0.5, 0.7, 0.16), b), [-1.9, 0.4, -1.5], [-3.4, 1.6, -3.6])

    // SPDA — captor / para-raios
    const rod = new THREE.Group()
    rod.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 1.1, 0),
        ]),
        b,
      ),
    )
    rod.add(edges(new THREE.OctahedronGeometry(0.13), b))
    ;(rod.children[1] as THREE.Object3D).position.y = 1.15
    P(rod, [1.7, 2.0, 0], [2.6, 5.2, 0])

    // Pontos luminosos (tomadas / luminárias)
    const nodeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.4, 0.9, 1.5),
      new THREE.Vector3(1.4, 0.9, -1.5),
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(1.9, 0.4, 1.5),
    ])
    const nodeMat = new THREE.PointsMaterial({
      color: BLUE,
      size: this.quality === 'low' ? 5 : 7,
      sizeAttenuation: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.materials.push(nodeMat)
    P(new THREE.Points(nodeGeo, nodeMat), [0, 0, 0], [0, 2.4, 0])
  }

  /** Placa-mãe: PCB → CPU → memórias → trilhas → cabos */
  private buildBoard() {
    const g = this.matBoardGray
    const b = this.matBoardBlue
    const P = (o: THREE.Object3D, base: [number, number, number], ex: [number, number, number], opt = {}) =>
      this.addPart(this.boardParts, this.boardGroup, o, base, ex, opt)

    // PCB
    P(edges(new THREE.BoxGeometry(5.2, 0.12, 3.6), g), [0, 0, 0], [0, -1.6, 0])

    // Trilhas (azul) sobre o PCB
    const traces: THREE.Vector3[] = []
    for (let i = 0; i < 14; i++) {
      const z = -1.5 + (i / 13) * 3
      traces.push(new THREE.Vector3(-2.4, 0.07, z), new THREE.Vector3(-0.2, 0.07, z))
      traces.push(new THREE.Vector3(-0.2, 0.07, z), new THREE.Vector3(0.4, 0.07, z * 0.6))
      traces.push(new THREE.Vector3(0.4, 0.07, z * 0.6), new THREE.Vector3(2.4, 0.07, z * 0.6))
    }
    P(
      new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(traces), b),
      [0, 0.02, 0],
      [0, 1.5, 0],
    )

    // CPU + dissipador
    P(edges(new THREE.BoxGeometry(1.15, 0.22, 1.15), b), [-0.9, 0.18, 0.1], [-1.4, 2.6, 0.4])
    for (let i = 0; i < 6; i++) {
      P(
        edges(new THREE.BoxGeometry(1.0, 0.5, 0.07), g),
        [-0.9, 0.6, -0.35 + i * 0.14],
        [-1.4 + (i - 2.5) * 0.15, 3.9 + i * 0.22, 0.4 + (i - 2.5) * 0.3],
        { explodeRot: [0, (i - 2.5) * 0.12, 0] },
      )
    }

    // Memórias
    for (let i = 0; i < 3; i++) {
      P(
        edges(new THREE.BoxGeometry(0.1, 0.85, 2.0), g),
        [1.0 + i * 0.34, 0.5, 0],
        [3.4 + i * 0.9, 1.4 + i * 0.5, -0.4 * i],
        { explodeRot: [0, 0, -0.18 - i * 0.06] },
      )
    }

    // Capacitores
    for (let i = 0; i < 5; i++) {
      const x = -2.0 + i * 0.42
      P(
        edges(new THREE.CylinderGeometry(0.13, 0.13, 0.42, 8), g, 20),
        [x, 0.27, -1.35],
        [x * 1.5 - 0.5, 1.1 + i * 0.28, -3.4],
      )
    }

    // Conectores de borda
    P(edges(new THREE.BoxGeometry(0.9, 0.34, 0.5), g), [-2.0, 0.22, 1.4], [-4.6, 0.6, 3.4])
    P(edges(new THREE.BoxGeometry(0.6, 0.34, 0.5), g), [-0.9, 0.22, 1.4], [-2.0, 0.2, 4.2])

    // Cabos (curvas)
    const cable = (pts: THREE.Vector3[], mat: THREE.LineBasicMaterial) => {
      const curve = new THREE.CatmullRomCurve3(pts)
      const geo = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(this.quality === 'low' ? 24 : 60),
      )
      return new THREE.Line(geo, mat)
    }
    P(
      cable(
        [
          new THREE.Vector3(-2.4, 0.2, 1.2),
          new THREE.Vector3(-1.4, 1.1, 2.0),
          new THREE.Vector3(0.6, 0.7, 1.8),
          new THREE.Vector3(2.3, 0.2, 1.3),
        ],
        b,
      ),
      [0, 0, 0],
      [0.4, 2.6, 2.4],
      { explodeRot: [0.2, 0.3, 0] },
    )
    P(
      cable(
        [
          new THREE.Vector3(-2.3, 0.2, -1.1),
          new THREE.Vector3(-0.8, 0.9, -2.1),
          new THREE.Vector3(1.4, 0.6, -1.9),
          new THREE.Vector3(2.4, 0.2, -1.0),
        ],
        g,
      ),
      [0, 0, 0],
      [-0.4, -2.4, -2.2],
      { explodeRot: [-0.2, -0.3, 0] },
    )

    // Nós luminosos
    const nodeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.9, 0.32, 0.1),
      new THREE.Vector3(1.7, 0.95, 0),
      new THREE.Vector3(-2.0, 0.4, 1.4),
      new THREE.Vector3(2.2, 0.12, -1.4),
    ])
    const nodeMat = new THREE.PointsMaterial({
      color: BLUE,
      size: this.quality === 'low' ? 5 : 8,
      sizeAttenuation: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.materials.push(nodeMat)
    P(new THREE.Points(nodeGeo, nodeMat), [0, 0, 0], [0, 2.2, 0])

    this.boardGroup.position.y = -0.3
  }

  /** Poeira estelar + grid de chão */
  private buildAmbient() {
    const count =
      this.quality === 'high' ? 1400 : this.quality === 'medium' ? 700 : 260
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 42
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24
      pos[i * 3 + 2] = (Math.random() - 0.5) * 34 - 6
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.pointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.022,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
    this.materials.push(this.pointsMat)
    this.points = new THREE.Points(geo, this.pointsMat)
    this.scene.add(this.points)

    // Grid técnico
    const lines: THREE.Vector3[] = []
    const half = 16
    const step = 2
    for (let i = -half; i <= half; i += step) {
      lines.push(new THREE.Vector3(-half, 0, i), new THREE.Vector3(half, 0, i))
      lines.push(new THREE.Vector3(i, 0, -half), new THREE.Vector3(i, 0, half))
    }
    this.gridMat = new THREE.LineBasicMaterial({
      color: DIM,
      transparent: true,
      opacity: 0.18,
    })
    this.materials.push(this.gridMat)
    this.grid = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(lines),
      this.gridMat,
    )
    this.grid.position.y = -3.4
    this.scene.add(this.grid)
  }

  /* --------------------------------- loop --------------------------------- */

  private cameraKeys: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
    { p: 0.0, pos: [0, 1.4, 10.5], look: [0, 0, 0] },
    { p: 0.18, pos: [4.6, 2.2, 8.4], look: [0, 0.1, 0] },
    { p: 0.36, pos: [-4.2, 3.4, 8.6], look: [0, 0.5, 0] },
    { p: 0.52, pos: [0, 6.2, 8.0], look: [0, 0.2, 0] },
    { p: 0.7, pos: [5.4, 2.4, 7.4], look: [0, 0.2, 0] },
    { p: 0.86, pos: [-4.8, 1.6, 8.2], look: [0, 0.2, 0] },
    { p: 1.0, pos: [0, 1.0, 13.0], look: [0, 0, 0] },
  ]

  private sampleCamera(p: number) {
    const keys = this.cameraKeys
    let i = 0
    while (i < keys.length - 2 && p > keys[i + 1].p) i++
    const a = keys[i]
    const bK = keys[i + 1]
    const t = smoothstep(a.p, bK.p, p)
    this.camTmp.set(
      lerp(a.pos[0], bK.pos[0], t),
      lerp(a.pos[1], bK.pos[1], t),
      lerp(a.pos[2], bK.pos[2], t),
    )
    this.lookTmp.set(
      lerp(a.look[0], bK.look[0], t),
      lerp(a.look[1], bK.look[1], t),
      lerp(a.look[2], bK.look[2], t),
    )
  }

  private applyParts(
    parts: Part[],
    explodeAmount: number,
    introAmount: number,
    time: number,
  ) {
    const tmp = new THREE.Vector3()
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const ip = clamp((introAmount - part.delay) / (1 - part.delay))
      const ease = ip * ip * (3 - 2 * ip)

      tmp.copy(part.scatter).lerp(part.base, ease)
      tmp.lerp(part.explode, explodeAmount)

      if (!this.reducedMotion) {
        const f = 0.5 + explodeAmount * 1.6
        tmp.y += Math.sin(time * 0.6 + i * 1.7) * 0.03 * f
        tmp.x += Math.cos(time * 0.5 + i * 2.3) * 0.025 * f
      }
      part.obj.position.copy(tmp)

      part.obj.rotation.set(
        lerp(
          lerp(part.scatterRot.x, part.baseRot.x, ease),
          part.explodeRot.x,
          explodeAmount,
        ),
        lerp(
          lerp(part.scatterRot.y, part.baseRot.y, ease),
          part.explodeRot.y,
          explodeAmount,
        ),
        lerp(
          lerp(part.scatterRot.z, part.baseRot.z, ease),
          part.explodeRot.z,
          explodeAmount,
        ),
      )
    }
  }

  private frame = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.frame)

    const now = performance.now() / 1000
    const dt = Math.min(now - this.lastTime, 0.05)
    this.lastTime = now
    this.elapsed += dt
    const time = this.elapsed

    // suavização do scroll → nunca um salto brusco
    const smoothing = this.reducedMotion ? 1 : 1 - Math.pow(0.0016, dt)
    this.progress += (this.targetProgress - this.progress) * smoothing
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * smoothing * 0.6
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * smoothing * 0.6

    const p = this.progress
    const intro = this.intro

    const isStatic = this.quality === 'static'
    const houseOpacity = 1 - smoothstep(0.44, 0.56, p)
    const boardOpacity = smoothstep(0.46, 0.6, p)
    const houseExplode = isStatic ? 0 : smoothstep(0.08, 0.44, p)
    const boardExplode = isStatic ? 0 : smoothstep(0.6, 0.92, p)

    this.houseGroup.visible = houseOpacity > 0.01
    this.boardGroup.visible = boardOpacity > 0.01

    this.matHouseGray.opacity = 0.55 * houseOpacity * intro
    this.matHouseBlue.opacity = (0.55 + 0.45 * smoothstep(0.2, 0.42, p)) * houseOpacity * intro
    this.matBoardGray.opacity = 0.55 * boardOpacity
    this.matBoardBlue.opacity = (0.6 + 0.4 * smoothstep(0.6, 0.85, p)) * boardOpacity

    if (this.houseGroup.visible)
      this.applyParts(this.houseParts, houseExplode, intro, time)
    if (this.boardGroup.visible)
      this.applyParts(this.boardParts, boardExplode, 1, time)

    // rotação global contínua + parallax de mouse
    this.root.rotation.y = isStatic ? -0.35 : -0.5 + p * 2.4 + this.pointer.x * 0.18
    this.root.rotation.x = this.pointer.y * 0.1 + Math.sin(time * 0.15) * 0.015
    this.root.position.y = -0.2 + Math.sin(time * 0.35) * 0.04
    // desloca a cena para a direita enquanto o texto do hero está em foco
    this.root.position.x = this.lateralShift * (1 - smoothstep(0.12, 0.42, p))

    if (this.points) {
      this.points.rotation.y = time * 0.012 + p * 0.4
      if (this.pointsMat) this.pointsMat.opacity = 0.12 + 0.28 * intro
    }
    if (this.grid && this.gridMat) {
      this.gridMat.opacity = 0.2 * intro * (1 - smoothstep(0.5, 0.75, p))
      this.grid.position.y = -3.4 + p * 1.2
    }

    this.sampleCamera(isStatic ? 0 : p)
    this.camera.position.copy(this.camTmp)
    this.camera.position.x += this.pointer.x * 0.5
    this.camera.position.y += this.pointer.y * 0.3
    this.camera.position.multiplyScalar(this.distanceScale)
    this.camera.lookAt(this.lookTmp)

    this.renderer.render(this.scene, this.camera)
  }

  private distanceScale = 1
  private lateralShift = 0

  /* -------------------------------- public -------------------------------- */

  start() {
    this.lastTime = performance.now() / 1000
    if (!this.raf) this.raf = requestAnimationFrame(this.frame)
  }

  setPointer(x: number, y: number) {
    if (this.reducedMotion) return
    this.pointerTarget.set(x, y)
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / Math.max(h, 1)
    // afasta a câmera em telas estreitas para a cena caber inteira
    this.distanceScale =
      this.camera.aspect < 1 ? 1.7 : this.camera.aspect < 1.4 ? 1.35 : 1.18
    // em telas largas a cena vai para a direita, liberando a coluna de texto
    this.lateralShift = this.camera.aspect >= 1.4 ? 2.2 : 0
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.scene.traverse((o) => {
      const any = o as THREE.Mesh
      if (any.geometry) any.geometry.dispose()
    })
    this.root.traverse((o) => {
      const any = o as THREE.Mesh
      if (any.geometry) any.geometry.dispose()
    })
    this.materials.forEach((m) => m.dispose())
    this.renderer.dispose()
  }
}

/* -------------------------------------------------------------------------- */
/*  Detecção de qualidade                                                      */
/* -------------------------------------------------------------------------- */

export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'static'

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return 'static'

  // WebGL disponível?
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return 'static'
  } catch {
    return 'static'
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { effectiveType?: string; saveData?: boolean }
  }
  const conn = nav.connection
  if (conn?.saveData) return 'static'
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return 'static'

  const cores = navigator.hardwareConcurrency ?? 4
  const mem = nav.deviceMemory ?? 4
  const narrow = window.innerWidth < 768
  const coarse = window.matchMedia('(pointer: coarse)').matches

  if (cores <= 4 || mem <= 4) return narrow ? 'low' : 'medium'
  if (narrow || coarse) return 'medium'
  return 'high'
}
