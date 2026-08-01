import { Reveal } from '@/components/motion/reveal'

const STEPS = [
  {
    n: '01',
    t: 'Diagnóstico',
    d: 'Visita técnica ou reunião de escopo. Levantamos o que existe antes de propor o que fazer.',
  },
  {
    n: '02',
    t: 'Projeto e orçamento',
    d: 'Documentação técnica, memorial e planilha aberta de custos, sem valor fechado sem justificativa.',
  },
  {
    n: '03',
    t: 'Execução',
    d: 'Obra, instalação ou desenvolvimento acompanhados pela mesma equipe que projetou.',
  },
  {
    n: '04',
    t: 'Entrega e laudo',
    d: 'Conformidade verificada, documentação final e suporte no período combinado.',
  },
]

export function Method() {
  return (
    <section
      id="metodo"
      aria-labelledby="metodo-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="border-border border-t pt-10" stagger>
          <p className="label-tech text-primary reveal-init mb-6">
            [ 03 ] Como trabalhamos
          </p>
          <h2
            id="metodo-title"
            className="font-display reveal-init max-w-3xl text-balance text-3xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl"
          >
            Precificação transparente, definida antes de começar.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal className="grid gap-8 sm:grid-cols-2" stagger y={30}>
            <div className="border-border reveal-init border p-7 backdrop-blur-sm sm:p-8">
              <span className="label-tech text-muted-foreground">Engenharia</span>
              <p className="font-display text-primary mt-6 text-4xl leading-none font-bold">
                %
              </p>
              <p className="text-foreground mt-4 text-sm leading-relaxed">
                Percentual fixo sobre o custo de obra, acordado em contrato e
                reajustado apenas por índice oficial.
              </p>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Você enxerga exatamente quanto vai para material, mão de obra e
                honorário técnico.
              </p>
            </div>

            <div className="border-border reveal-init border p-7 backdrop-blur-sm sm:p-8">
              <span className="label-tech text-muted-foreground">Software</span>
              <p className="font-display text-primary mt-6 text-4xl leading-none font-bold">
                h
              </p>
              <p className="text-foreground mt-4 text-sm leading-relaxed">
                Hora técnica estimada por etapa, com escopo escrito e limite
                combinado antes do primeiro commit.
              </p>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Se a estimativa mudar, você é avisado antes, não na fatura.
              </p>
            </div>
          </Reveal>

          <Reveal className="flex flex-col" stagger y={22}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="border-border reveal-init flex gap-6 border-t py-6 last:border-b"
              >
                <span className="font-display text-primary w-8 shrink-0 text-sm font-bold tabular-nums">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-foreground text-base font-bold tracking-tight">
                    {s.t}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
