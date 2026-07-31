'use client'

import { animate } from 'animejs'
import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { PORTFOLIO } from '@/lib/site-data'

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
              Imagens de referência enquanto o registro fotográfico definitivo dos
              projetos é finalizado.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14 grid gap-px sm:gap-8 lg:grid-cols-2" stagger y={36}>
          {PORTFOLIO.map((item) => (
            <div key={item.id} className="reveal-init">
              <CompareCard item={item} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
