import { Reveal } from '@/components/motion/reveal'
import { AREAS } from '@/lib/site-data'

export function Areas() {
  return (
    <section id="areas" aria-labelledby="areas-title" className="relative">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="border-border border-t py-24 sm:py-32" stagger>
          <p className="label-tech text-primary reveal-init mb-6">
            [ 01 ] Áreas de atuação
          </p>
          <h2
            id="areas-title"
            className="font-display reveal-init max-w-4xl text-balance text-3xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl"
          >
            Quatro disciplinas, uma engenharia só.
          </h2>
          <p className="text-muted-foreground reveal-init mt-6 max-w-2xl text-base leading-relaxed">
            Não somos fábrica de software nem construtora tradicional. Somos as duas
            coisas juntas, o que permite resolver a obra, a instalação e o sistema
            que controla tudo sem transferir o problema para um terceiro.
          </p>
        </Reveal>
      </div>

      {AREAS.map((area, i) => (
        <article
          key={area.id}
          aria-labelledby={`area-${area.id}`}
          className="relative flex min-h-svh items-center py-20"
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <Reveal
              className={`grid gap-8 lg:grid-cols-12 ${
                i % 2 === 1 ? 'lg:[&>*]:col-start-7' : ''
              }`}
              stagger
            >
              <div
                className={`reveal-init lg:col-span-5 ${i % 2 === 1 ? '' : 'lg:col-start-1'}`}
              >
                <div className="border-border bg-background/55 border p-7 backdrop-blur-sm sm:p-9">
                  <div className="border-border mb-7 flex items-center justify-between border-b pb-5">
                    <span className="font-display text-primary text-sm font-bold tabular-nums">
                      {area.index}
                    </span>
                    <span className="label-tech text-muted-foreground">
                      {area.subtitle}
                    </span>
                  </div>

                  <h3
                    id={`area-${area.id}`}
                    className="font-display text-balance text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-4xl"
                  >
                    {area.title}
                  </h3>

                  <p className="text-muted-foreground mt-5 text-base leading-relaxed">
                    {area.description}
                  </p>

                  <ul className="mt-8 flex flex-col">
                    {area.items.map((item) => (
                      <li
                        key={item}
                        className="border-border text-foreground/85 group flex items-start gap-3 border-t py-3.5 text-sm leading-relaxed"
                      >
                        <span
                          className="bg-primary mt-2 inline-block h-px w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </article>
      ))}
    </section>
  )
}
