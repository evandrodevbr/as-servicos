import Link from 'next/link'
import { Reveal } from '@/components/motion/reveal'
import type { ServicoPage } from '@/lib/site-data'

const TECH_SCOPE = [
  {
    title: 'Criar',
    text: 'Sites e sistemas sob encomenda para a rotina da empresa.',
  },
  {
    title: 'Conectar e automatizar',
    text: 'Integrações entre ferramentas e automação de processos.',
  },
  {
    title: 'Manter a base funcionando',
    text: 'Suporte de TI, redes, cabeamento estruturado, CFTV e controle de acesso.',
  },
] as const

/**
 * Hero das páginas de serviço — a cena 3D da área (SceneCanvas, montada na
 * página) aparece limpa atrás do texto graças à vinheta do canvas; o scroll
 * da página conduz a transição A→B. Título e descrição ficam visíveis desde
 * o SSR (LCP estável); rótulo, escopo e CTAs animam.
 *
 * Na página de Tecnologia, o rótulo usa notação de caminho
 * (`./servicos/tecnologia`) e o escopo aparece em três frentes de atuação.
 */
export function ServicoHero({ page }: { page: ServicoPage }) {
  const isTech = page.themeId === 'tech'

  return (
    <section className="relative flex min-h-[80svh] items-center">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-28 sm:px-8">
        <Reveal>
          <p
            className={`text-primary mb-6 ${
              isTech ? 'font-mono text-xs tracking-[0.12em]' : 'label-tech'
            }`}
          >
            {isTech ? '[ ./servicos/tecnologia ]' : `[ Serviços ] ${page.title}`}
          </p>
        </Reveal>
        <h1 className="font-display max-w-3xl text-balance text-3xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl">
          {page.headline}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed">
          {page.description}
        </p>
        {isTech && (
          <Reveal delay={160} className="tech-scope mt-8 max-w-2xl">
            <div className="tech-scope__head">
              <h2 id="tech-scope-title" className="tech-scope__title">
                Escopo de tecnologia
              </h2>
              <p className="tech-scope__subtitle">
                Do sistema à infraestrutura, tudo precisa funcionar em conjunto.
              </p>
            </div>
            <ul className="tech-scope__items" aria-labelledby="tech-scope-title">
              {TECH_SCOPE.map((item) => (
                <li key={item.title} className="tech-scope__item">
                  <span aria-hidden="true" className="tech-scope__marker" />
                  <div>
                    <h3 className="tech-scope__item-title">{item.title}</h3>
                    <p className="tech-scope__item-text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#contato"
              className="bg-primary text-primary-foreground hover:bg-primary/90 label-tech inline-flex h-12 items-center justify-center px-8 transition-colors focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2"
            >
              {page.cta.label}
            </Link>
            <Link
              href="#servicos"
              className="border-border text-foreground/85 hover:border-primary hover:text-primary label-tech inline-flex h-12 items-center justify-center border px-8 transition-colors"
            >
              Ver serviços ↓
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
