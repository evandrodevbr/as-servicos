import { ContactLinksDetail } from '@/components/site/contact-links'
import { HomeDiagram } from '@/components/site/home-diagram'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteNav } from '@/components/site/site-nav'

/**
 * Home = direcionador: cada área da AS Serviços tem sua própria página
 * (`/servicos/{slug}`) com tema, cena 3D e formulário. A home apresenta o
 * mapa integrado como ponto de partida — título e proposta ficam visíveis
 * desde o SSR (LCP estável, sem depender de hidratação), e a faixa de
 * garantias sustenta a decisão antes do primeiro clique.
 */

const ASSURANCES = [
  {
    code: 'ART',
    title: 'Responsabilidade técnica',
    text: 'Projeto, laudo e obra com profissional registrado e ART em cada entrega.',
  },
  {
    code: '1 DIA',
    title: 'Retorno rápido',
    text: 'Primeira resposta em até 1 dia útil, pelo canal que você escolher.',
  },
  {
    code: '1 EQUIPE',
    title: 'Disciplinas integradas',
    text: 'Civil, elétrica, automação e software sob uma única equipe e um único orçamento.',
  },
]

export default function Page() {
  return (
    <div id="top" data-theme="home" className="bg-background text-foreground min-h-svh">
      <SiteNav ctaLabel="Falar com a equipe" />
      <main id="conteudo">
        <section className="home-hero relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-border border-b pt-20 pb-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div className="max-w-[37rem]">
              <p className="label-tech text-primary mb-8">
                [ AS SERVIÇOS / PRANCHA INTEGRADA ]
              </p>
              <h1 className="font-display max-w-2xl text-balance text-[clamp(2.45rem,4.2vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.03em]">
                <span className="block">Três áreas de atuação. </span>
                <span className="text-primary block">Especialistas em cada área.</span>
              </h1>
              <p className="text-muted-foreground mt-8 max-w-[34rem] text-base leading-relaxed sm:text-lg">
                Escolha uma frente para ver serviços, entregas reais e abrir
                uma solicitação direto com a nossa equipe.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#mapa-areas"
                  className="bg-primary text-primary-foreground label-tech inline-flex min-h-12 items-center gap-4 px-5 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Escolher uma área
                  <span aria-hidden="true" className="text-base leading-none">
                    ↘
                  </span>
                </a>
                <span className="label-tech text-muted-foreground">
                  03 disciplinas coordenadas
                </span>
              </div>
            </div>

            <div id="mapa-areas" className="scroll-mt-20">
              <h2 className="sr-only">Áreas de atuação da AS Serviços</h2>
              <HomeDiagram />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="garantias-home-title"
          className="home-assurances"
        >
          <div className="home-assurances__frame">
            <div className="home-assurances__heading">
              <p id="garantias-home-title">Critérios de entrega</p>
              <span aria-hidden="true">AS // COMPROMISSOS</span>
            </div>
            <div className="home-assurances__grid">
              {ASSURANCES.map((item) => (
                <article key={item.code} className="home-assurances__item">
                  <p className="home-assurances__code">{item.code}</p>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contato"
          aria-labelledby="contato-home-title"
          className="border-border bg-background/55 relative border-t backdrop-blur-sm"
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
              <div className="max-w-md">
                <h2
                  id="contato-home-title"
                  className="font-display text-balance text-2xl leading-[1.1] font-bold tracking-[-0.02em] sm:text-4xl"
                >
                  Prefere falar direto?
                </h2>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  WhatsApp, e-mail ou LinkedIn — respondemos em até 1 dia útil.
                </p>
              </div>
              <ContactLinksDetail />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
