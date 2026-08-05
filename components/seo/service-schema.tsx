import type { ServicoPage } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

/**
 * JSON-LD Service da página de serviço. Só dados verificados do produto —
 * sem endereço físico, geo ou avaliações (política do site: nada inventado).
 */
export function ServiceSchema({ page }: { page: ServicoPage }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    serviceType: page.title,
    description: page.description,
    url: `${SITE_URL}/servicos/${page.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'AS Serviços',
      url: SITE_URL,
    },
    areaServed: 'BR',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
