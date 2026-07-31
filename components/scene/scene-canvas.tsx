'use client'

import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'
import { detectQuality, SceneEngine, type Quality } from '@/lib/three/engine'

type Props = {
  onReady?: () => void
}

export function SceneCanvas({ onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
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
      engine = new SceneEngine(canvas, q, q === 'static')
    } catch (err) {
      console.log('[v0] WebGL indisponível, usando fallback estático:', err)
      readyRef.current?.()
      return
    }

    const scrollState = { value: 0 }
    const computeProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.value = max > 0 ? window.scrollY / max : 0
      engine!.targetProgress = scrollState.value
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
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-quality={quality ?? 'detecting'}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* vinheta: mantém o texto legível sobre a cena */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_92%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,color-mix(in_oklab,var(--background)_70%,transparent)_38%,transparent_62%)]" />
    </div>
  )
}
