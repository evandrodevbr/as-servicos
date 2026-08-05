import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SceneCanvas } from '@/components/scene/scene-canvas'
import { ServiceSchema } from '@/components/seo/service-schema'
import { ServicoContact } from '@/components/site/servico-contact'
import { ServicoHero } from '@/components/site/servico-hero'
import { ServicoServicos } from '@/components/site/servico-servicos'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteNav } from '@/components/site/site-nav'
import { SERVICOS_PAGES, SERVICOS_SLUGS, type ServicosSlug } from '@/lib/site-data'

/** Navegação das páginas de serviço: interliga as três áreas + home + contato. */
const SERVICO_NAV = [
  { href: '/', label: 'Início' },
  { href: '/servicos/engenharia-civil', label: 'Civil' },
  { href: '/servicos/engenharia-eletrica', label: 'Elétrica' },
  { href: '/servicos/tecnologia', label: 'Tecnologia' },
  { href: '#contato', label: 'Contato' },
]

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICOS_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug as ServicosSlug
  const page = SERVICOS_PAGES.find((p) => p.slug === slug)
  if (!page) return {}

  const url = `/servicos/${page.slug}`
  return {
    title: `${page.title} · AS Serviços`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.title} · AS Serviços`,
      description: page.description,
      url,
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug as ServicosSlug
  const page = SERVICOS_PAGES.find((p) => p.slug === slug)
  if (!page) notFound()

  return (
    <div data-theme={page.themeId} className="bg-background text-foreground min-h-svh">
      <ServiceSchema page={page} />
      <SiteNav links={SERVICO_NAV} rootHref="/" ctaHref="#contato" />
      <SceneCanvas variant={page.themeId} heroProgress />
      <main id="conteudo">
        <ServicoHero page={page} />
        <ServicoServicos page={page} />
        <ServicoContact page={page} />
      </main>
      <SiteFooter nav={SERVICO_NAV} />
    </div>
  )
}
