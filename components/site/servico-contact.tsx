import { Reveal } from '@/components/motion/reveal'
import { ServicoForm } from '@/components/site/servico-form'
import type { ServicoPage } from '@/lib/site-data'

/**
 * Seção de contato da página de serviço — o formulário chega ao dashboard
 * com a tag da área (`origem: servicos/{slug}`).
 */
export function ServicoContact({ page }: { page: ServicoPage }) {
  const isTech = page.themeId === 'tech'

  return (
    <section id="contato" aria-labelledby="servico-contato-title" className="relative">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal
          className="border-border bg-background/55 backdrop-blur-sm border-t py-24 sm:py-32"
          stagger
        >
          <p
            className={`text-primary mb-6 ${
              isTech ? 'font-mono text-xs tracking-[0.12em]' : 'label-tech'
            }`}
          >
            {isTech ? '[ POST /contato ]' : `[ Contato ] ${page.title}`}
          </p>
          <h2
            id="servico-contato-title"
            className="font-display max-w-2xl text-balance text-2xl leading-[1.1] font-bold tracking-[-0.02em] sm:text-4xl"
          >
            {page.cta.texto}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed">
            O pedido chega direto ao painel administrativo, identificado como{' '}
            {page.title}. Retornamos em até 1 dia útil.
          </p>

          <div className="mt-12 max-w-2xl">
            <ServicoForm page={page} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
