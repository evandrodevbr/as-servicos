import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'
import { SERVICOS_SLUGS } from '@/lib/site-data'

/**
 * Data da última alteração *significativa* de conteúdo (textos, portfólio,
 * áreas de atuação, dados de contato) — não a data do build/deploy.
 *
 * Atualize manualmente sempre que o conteúdo da página mudar de forma
 * relevante. Não usar `new Date()` aqui: isso geraria um `lastmod` diferente
 * a cada build, sem nenhuma mudança real de conteúdo — o que é tratado como
 * sinal de baixa qualidade pelas guidelines do Google (lastmod deve refletir
 * a última mudança significativa, não boilerplate).
 */
const LAST_CONTENT_UPDATE = '2026-08-01'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_UPDATE,
    },
    ...SERVICOS_SLUGS.map((slug) => ({
      url: `${SITE_URL}/servicos/${slug}`,
      lastModified: '2026-08-05',
    })),
  ]
}
