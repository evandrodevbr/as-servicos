'use client'

import { animate } from 'animejs'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { PORTFOLIO } from '@/lib/site-data'

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function CompareCard({ item }: { item: (typeof PORTFOLIO)[number] }) {
  const [showBefore, setShowBefore] = useState(false)
  const beforeRef = useRef<HTMLDivElement | null>(null)

  const toggle = useCallback((next: boolean) => {
    setShowBefore(next)
    const el = beforeRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.style.opacity = next ? '1' : '0'
      return
    }
    animate(el, {
      opacity: next ? 1 : 0,
      scale: next ? 1 : 1.04,
      duration: 620,
      ease: 'inOut(2.4)',
    })
  }, [])

  const hasCompare = Boolean(item.compare)

  return (
    <div className="border-border bg-background/55 group flex flex-col border backdrop-blur-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover grayscale-[35%] transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {item.compare && (
          <div
            ref={beforeRef}
            className="absolute inset-0 opacity-0"
            aria-hidden={!showBefore}
          >
            <Image
              src={item.compare.image || '/placeholder.svg'}
              alt={item.compare.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover grayscale-[35%]"
            />
          </div>
        )}

        {/* moldura técnica */}
        <span
          className="border-foreground/20 pointer-events-none absolute inset-3 border"
          aria-hidden="true"
        />

        <span className="label-tech text-muted-foreground/80 bg-background/70 pointer-events-none absolute right-5 bottom-5 px-3 py-1.5 backdrop-blur">
          Imagem ilustrativa
        </span>

        {hasCompare && (
          <button
            type="button"
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}
            onFocus={() => toggle(true)}
            onBlur={() => toggle(false)}
            onClick={() => toggle(!showBefore)}
            aria-pressed={showBefore}
            className="label-tech text-foreground border-border bg-background/85 hover:border-primary hover:text-primary focus-visible:ring-primary absolute bottom-5 left-5 border px-4 py-2.5 backdrop-blur transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            {showBefore ? 'Ver depois' : 'Ver antes'}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="border-border text-muted-foreground label-tech flex items-center justify-between border-b pb-4">
          <span>{item.area}</span>
          <span>
            {item.local} · {item.ano}
          </span>
        </div>
        <h3 className="font-display mt-5 text-xl leading-tight font-bold tracking-[-0.02em] sm:text-2xl">
          {item.title}
        </h3>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  )
}

/**
 * Grid da grade de portfólio.
 *
 * Em telas ≥lg (onde o grid de 2 colunas cabe inteiro numa tela), a seção
 * "gruda" (sticky) por uma faixa maior de scroll e os cards entram conforme
 * o progresso do scroll dentro dela — como um vídeo controlado pelo scroll,
 * em vez do usuário apenas passar pelos cards. Em telas menores o grid
 * empilha em 1 coluna e não caberia inteiro numa tela sem cortar cards, então
 * mantém-se a revelação em cascata de sempre (Reveal ao entrar na viewport).
 */
function PortfolioGrid({ items }: { items: typeof PORTFOLIO }) {
  const [pinned, setPinned] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  /** altura do header fixo (px) — o conteúdo grudado nunca pode entrar embaixo dele */
  const [headerOffset, setHeaderOffset] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const apply = () => setPinned(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const measure = () => setHeaderOffset(header.getBoundingClientRect().height)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // encolhe o grid (mantendo a proporção) para sempre caber no espaço
  // disponível abaixo do header — em vez de estourar e ficar por baixo dele
  useEffect(() => {
    if (!pinned) return
    const sticky = stickyRef.current
    const grid = gridRef.current
    if (!sticky || !grid) return

    const fit = () => {
      grid.style.transform = 'none'
      const avail = sticky.clientHeight
      const needed = grid.scrollHeight
      const scale = needed > avail ? avail / needed : 1
      grid.style.transform = scale < 1 ? `scale(${scale})` : 'none'
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [pinned, headerOffset])

  useEffect(() => {
    if (!pinned) return
    const wrap = wrapRef.current
    if (!wrap) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const raw = total > 0 ? clamp(-rect.top / total) : 0
      const n = cardRefs.current.length
      const span = 1 / n
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const start = i * span
        const end = Math.min(1, start + span * 1.6)
        const ip = smoothstep(start, end, raw)
        el.style.opacity = String(ip)
        el.style.transform = `translateY(${(1 - ip) * 42}px) scale(${0.94 + 0.06 * ip})`
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pinned])

  if (!pinned) {
    return (
      <Reveal className="mt-14 grid gap-px sm:gap-8 lg:grid-cols-2" stagger y={36}>
        {items.map((item) => (
          <div key={item.id} className="reveal-init">
            <CompareCard item={item} />
          </div>
        ))}
      </Reveal>
    )
  }

  return (
    <div
      ref={wrapRef}
      className="relative mt-14"
      style={{ height: `${items.length * 70}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky flex items-center overflow-hidden"
        style={{ top: headerOffset, height: `calc(100vh - ${headerOffset}px)` }}
      >
        <div
          ref={gridRef}
          className="grid w-full origin-center gap-px sm:gap-8 lg:grid-cols-2"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              style={{
                opacity: 0,
                transform: 'translateY(42px) scale(0.94)',
                willChange: 'opacity, transform',
              }}
            >
              <CompareCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Portfolio() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="border-border border-t pt-10" stagger>
          <p className="label-tech text-primary reveal-init mb-6">
            [ 02 ] Portfólio
          </p>
          <div className="reveal-init flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2
              id="portfolio-title"
              className="font-display max-w-3xl text-balance text-3xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl"
            >
              Trabalhos entregues, documentados do início ao fim.
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              O registro fotográfico de cada obra está a caminho. Por enquanto,
              as imagens abaixo ilustram o padrão de entrega — e isso está
              identificado em cada uma delas.
            </p>
          </div>
        </Reveal>

        <PortfolioGrid items={PORTFOLIO} />
      </div>
    </section>
  )
}
