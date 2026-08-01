'use client'

import { animate, stagger } from 'animejs'
import { Clock, Layers, Percent, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'

const HEADLINE = ['Do projeto', 'à entrega,', 'engenharia e tecnologia', 'sob o mesmo teto.']

/**
 * Diferenciais qualitativos, não estatísticas — por isso viram ícone + texto
 * em vez de um número grande estilizado (que pode ser lido como uma métrica
 * real, tipo "4 anos de mercado" ou "01 = nota máxima").
 */
const DIFFERENTIATORS = [
  { Icon: Layers, label: '4 áreas de engenharia' },
  { Icon: Users, label: 'mesma equipe, do projeto à entrega' },
  { Icon: Percent, label: 'honorário sobre custo de obra' },
  { Icon: Clock, label: 'hora técnica no software' },
]

/**
 * A revelação do texto roda no mount, sincronizada com a duração fixa do
 * preloader (~550ms) em vez de esperar a cena 3D terminar de montar — texto
 * gated por `opacity:0` até a cena 3D ficar pronta derrubava o LCP (elemento
 * com opacity 0 não conta como "pintado" para o Core Web Vitals).
 */
const OVERLAY_EXIT_MS = 550

export function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const played = useRef(false)

  useEffect(() => {
    if (played.current) return
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
      delay: stagger(90, { start: OVERLAY_EXIT_MS }),
      ease: 'out(4)',
    })
    animate(rest, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 900,
      delay: stagger(110, { start: OVERLAY_EXIT_MS + 520 }),
      ease: 'out(3)',
    })
  }, [])

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
              automação e software feitos pela mesma equipe, com precificação
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
          className="reveal-init border-border mt-14 grid grid-cols-2 gap-x-4 gap-y-5 border-t pt-6 sm:grid-cols-4"
        >
          {DIFFERENTIATORS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="text-primary h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="label-tech text-muted-foreground">{label}</span>
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
