'use client'

import { animate } from 'animejs'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SceneCanvas } from '@/components/scene/scene-canvas'

const ReadyContext = createContext(false)
export const useSceneReady = () => useContext(ReadyContext)

export function Experience({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [hidden, setHidden] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const counterRef = useRef<HTMLSpanElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)

  const onReady = useCallback(() => setReady(true), [])

  // contador de carregamento
  useEffect(() => {
    const counter = counterRef.current
    const bar = barRef.current
    if (!counter || !bar) return
    const state = { v: 0 }
    animate(state, {
      v: 100,
      duration: 2200,
      ease: 'out(2)',
      onUpdate: () => {
        counter.textContent = String(Math.round(state.v)).padStart(3, '0')
        bar.style.transform = `scaleX(${state.v / 100})`
      },
    })
  }, [])

  // saída do preloader
  useEffect(() => {
    if (!ready) return
    const overlay = overlayRef.current
    if (!overlay) {
      setHidden(true)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setHidden(true)
      document.body.style.overflow = ''
      return
    }
    animate(overlay, {
      opacity: [1, 0],
      duration: 700,
      delay: 240,
      ease: 'inOut(2)',
      onComplete: () => setHidden(true),
    })
  }, [ready])

  // trava o scroll durante a abertura
  useEffect(() => {
    if (hidden) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [hidden])

  return (
    <ReadyContext.Provider value={ready}>
      <SceneCanvas onReady={onReady} />

      {!hidden && (
        <div
          ref={overlayRef}
          className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Carregando a experiência</span>
          <div className="flex w-56 flex-col gap-4 sm:w-72">
            <div className="flex items-end justify-between">
              <span className="label-tech text-muted-foreground">
                AS Serviços
              </span>
              <span
                ref={counterRef}
                className="font-display text-foreground text-sm tabular-nums"
                aria-hidden="true"
              >
                000
              </span>
            </div>
            <div className="bg-border h-px w-full overflow-hidden">
              <div
                ref={barRef}
                className="bg-primary h-full w-full origin-left scale-x-0"
              />
            </div>
            <span className="label-tech text-muted-foreground/70">
              Montando a cena
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </ReadyContext.Provider>
  )
}
