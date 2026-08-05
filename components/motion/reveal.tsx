'use client'

import { animate, stagger } from 'animejs'
import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'

type RevealProps = {
 children: ReactNode
 className?: string
 as?: ElementType
 /** atraso inicial em ms */
 delay?: number
 /** anima filhos diretos em cascata em vez do próprio elemento */
 stagger?: boolean
 /** distância de deslocamento vertical */
 y?: number
 once?: boolean
 /** proporção mínima visível para iniciar a animação */
 threshold?: number
}

/**
 * Animação de entrada por progressive enhancement: o conteúdo é sempre
 * renderizado visível (SSR/no-JS/imprimindo). Com JS ativo e sem
 * prefers-reduced-motion, o elemento é ocultado via useLayoutEffect antes do
 * primeiro paint e animado quando entra no viewport.
 */
export function Reveal({
 children,
 className,
 as: Tag = 'div',
 delay = 0,
 stagger: useStagger = false,
 y = 28,
 once = true,
 threshold = 0.18,
}: RevealProps) {
 const ref = useRef<HTMLElement | null>(null)

 useLayoutEffect(() => {
  const el = ref.current
  if (!el) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  const targets: Element[] = useStagger ? Array.from(el.children) : [el]

  targets.forEach((t) => {
   ; (t as HTMLElement).style.opacity = '0'
    ; (t as HTMLElement).style.transform = `translateY(${y}px)`
    ; (t as HTMLElement).style.willChange = 'opacity, transform'
  })

  const play = () => {
   animate(targets, {
    opacity: [0, 1],
    translateY: [y, 0],
    duration: 900,
    delay: stagger(90, { start: delay }),
    ease: 'out(3)',
    onComplete: () => {
     targets.forEach((t) => {
      ; (t as HTMLElement).style.willChange = 'auto'
     })
    },
   })
  }

  const io = new IntersectionObserver(
   (entries) => {
    for (const entry of entries) {
     if (entry.isIntersecting) {
      play()
      if (once) io.disconnect()
     }
    }
   },
   { threshold, rootMargin: '0px 0px -8% 0px' },
  )
  io.observe(el)
  return () => io.disconnect()
 }, [delay, once, threshold, useStagger, y])

 return (
  <Tag ref={ref} className={className}>
   {children}
  </Tag>
 )
}
