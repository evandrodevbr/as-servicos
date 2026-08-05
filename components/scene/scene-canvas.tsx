'use client'

import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import {
  detectQuality,
  SceneEngine,
  type Quality,
  type SceneVariant,
} from '@/lib/three/engine'

type Props = {
  onReady?: () => void
  /** Variante da cena (home = casa → placa-mãe original). */
  variant?: SceneVariant
  /** true: ocupa o container (hero de página de serviço); false: viewport fixo (home). */
  contained?: boolean
  /** true: progresso do scroll relativo ao hero (min-h-80svh), não à página inteira. */
  heroProgress?: boolean
}

export function SceneCanvas({
  onReady,
  variant = 'home',
  contained = false,
  heroProgress = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [quality, setQuality] = useState<Quality | null>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const q = detectQuality()
    setQuality(q)

    let engine: SceneEngine | null = null
    try {
      engine = new SceneEngine(canvas, q, q === 'static', variant)
    } catch (err) {
      console.log('[v0] WebGL indisponível, usando fallback estático:', err)
      readyRef.current?.()
      return
    }

    const scrollState = { value: 0 }
    const computeProgress = () => {
      if (heroProgress) {
        // transição A→B acontece enquanto o hero (min-h-80svh) está na tela
        const heroH = window.innerHeight * 0.8
        scrollState.value = Math.min(1, Math.max(0, window.scrollY / heroH))
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight
        scrollState.value = max > 0 ? window.scrollY / max : 0
      }
      engine!.targetProgress = scrollState.value
      wrapperRef.current?.setAttribute(
        'data-progress',
        String(Math.round(scrollState.value * 100)),
      )
    }

    const onScroll = () => computeProgress()
    const onResize = () => {
      engine!.resize()
      computeProgress()
    }
    const onPointerMove = (e: PointerEvent) => {
      engine!.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }

    computeProgress()
    engine.start()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    // ---- Sequência de abertura: as peças convergem no espaço ----
    const introTarget = { v: 0 }
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      readyRef.current?.()
    }

    if (q === 'static') {
      engine.intro = 1
      finish()
    } else {
      animate(introTarget, {
        v: 1,
        duration: q === 'low' ? 1400 : 2400,
        ease: 'inOut(2.4)',
        onUpdate: () => {
          if (engine) engine.intro = introTarget.v
        },
        onComplete: finish,
      })
      // libera a interface mesmo que a animação demore
      const t = window.setTimeout(finish, 3200)
      return () => {
        window.clearTimeout(t)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        window.removeEventListener('pointermove', onPointerMove)
        engine?.dispose()
        engine = null
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      engine?.dispose()
      engine = null
    }
  }, [variant])

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none z-0 ${contained ? 'absolute inset-0' : 'fixed inset-0'}`}
      aria-hidden="true"
      data-quality={quality ?? 'detecting'}
      data-variant={variant}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* vinheta: mantém o texto legível sobre a cena */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_92%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,color-mix(in_oklab,var(--background)_70%,transparent)_38%,transparent_62%)]" />
    </div>
  )
}
