'use client'

import { animate, stagger } from 'animejs'
import { useEffect, useRef } from 'react'
import { useSceneReady } from '@/components/site/experience'

const HEADLINE = ['Do projeto', 'à entrega —', 'engenharia e tecnologia', 'sob o mesmo teto.']

export function Hero() {
  const ready = useSceneReady()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const played = useRef(false)

  useEffect(() => {
    if (!ready || played.current) return
    const root = rootRef.current
    if (!root) return
    played.current = true

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line] > span'))
    const rest = Array.from(root.querySelectorAll<HTMLElement>('[data-fade]'))

    if (reduced) {
      ;[...lines, ...rest].forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    animate(lines, {
      opacity: [0, 1],
      translateY: ['110%', '0%'],
      duration: 1100,
      delay: stagger(90),
      ease: 'out(4)',
    })
    animate(rest, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 900,
      delay: stagger(110, { start: 520 }),
      ease: 'out(3)',
    })
  }, [ready])

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-end pt-28 pb-16"
      aria-label="Apresentação"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p
              data-fade
              className="label-tech text-primary reveal-init mb-8 flex items-center gap-3"
            >
              <span className="bg-primary inline-block h-2 w-2" aria-hidden="true" />
              Engenharia multidisciplinar · Brasil
            </p>

            <h1 className="font-display text-balance text-[2.05rem] leading-[1] sm:leading-[0.98] font-bold tracking-[-0.03em] sm:text-6xl lg:text-[5.2rem]">
              {HEADLINE.map((line, i) => (
                <span
                  key={line}
                  data-line
                  className="block overflow-hidden py-[0.06em]"
                >
                  <span
                    className={`reveal-init block ${i === 3 ? 'text-primary' : 'text-foreground'}`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4 lg:pb-4">
            <p
              data-fade
              className="text-muted-foreground reveal-init border-border/60 bg-background/70 max-w-md border-l py-1 pl-5 text-base leading-relaxed backdrop-blur-[2px]"
            >
              Engenheiros e desenvolvedores lado a lado. Obra, instalação elétrica,
              automação e software feitos pela mesma equipe — com precificação
              transparente desde a primeira conversa.
            </p>

            <div data-fade className="reveal-init flex flex-wrap items-center gap-3">
              <a
                href="#contato"
                className="bg-primary text-primary-foreground hover:bg-foreground label-tech px-6 py-4 transition-colors"
              >
                Falar com a equipe
              </a>
              <a
                href="#areas"
                className="border-border text-foreground hover:border-primary hover:text-primary label-tech border px-6 py-4 transition-colors"
              >
                Ver áreas de atuação
              </a>
            </div>
          </div>
        </div>

        <div
          data-fade
          className="reveal-init border-border mt-14 grid grid-cols-2 gap-px border-t pt-6 sm:grid-cols-4"
        >
          {[
            ['04', 'áreas de engenharia'],
            ['01', 'equipe, do projeto à entrega'],
            ['%', 'honorário sobre custo de obra'],
            ['h', 'hora técnica no software'],
          ].map(([k, v]) => (
            <div key={v} className="flex items-baseline gap-3">
              <span className="font-display text-primary text-2xl leading-none font-bold">
                {k}
              </span>
              <span className="label-tech text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="text-muted-foreground/60 label-tech pointer-events-none absolute inset-x-0 bottom-5 mx-auto hidden max-w-[1400px] px-8 lg:block"
        aria-hidden="true"
      >
        Role para desmontar a cena
      </div>
    </section>
  )
}
