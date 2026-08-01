import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

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
      // `changeFrequency` e `priority` foram deliberadamente omitidos:
      // o Google os ignora desde 2023 (confirmado pela documentação oficial),
      // e mantê-los é apenas ruído/manutenção sem benefício de SEO.
    },
    // Site de página única (App Router, sem rotas adicionais além de `/`).
    // As âncoras de navegação (#areas, #portfolio, #metodo, #contato) NÃO
    // devem virar entradas separadas no sitemap: para o Googlebot elas
    // resolvem para o mesmo recurso `/` (fragmentos de URL são descartados
    // antes do rastreamento), então listá-las criaria URLs duplicadas
    // apontando para o mesmo conteúdo — um antipadrão comum de sitemap.
    // Se o site ganhar rotas reais (ex.: /blog, /servicos/[slug]), adicione
    // uma entrada por rota aqui, mantendo o limite de 50.000 URLs / 50MB por
    // arquivo (dividir com sitemap index se ultrapassar).
  ]
}
