import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

/**
 * IMPORTANTE: este domínio está atrás do Cloudflare com o recurso
 * "AI Content Signals" / robots.txt gerenciado ativado na zona. Antes desta
 * mudança, a origem não servia nenhum robots.txt próprio, então o Cloudflare
 * respondia 100% com o arquivo gerenciado dele (sem diretiva `Sitemap:`).
 *
 * Depois de publicar este arquivo, confirme em produção que:
 *   1. `Sitemap: https://asservicos.evandro.dev.br/sitemap.xml` aparece em
 *      GET /robots.txt (o Cloudflare deve *acrescentar* o bloco de Content
 *      Signals ao robots.txt da origem, não substituí-lo — mas isso depende
 *      da configuração da zona e deve ser verificado manualmente);
 *   2. as regras de bloqueio a crawlers de treinamento de IA
 *      (GPTBot, Google-Extended, ClaudeBot, Bytespider, CCBot,
 *      meta-externalagent, Amazonbot, Applebot-Extended) continuam
 *      presentes — hoje elas só existem porque o Cloudflare as injeta;
 *      com um robots.txt de origem, confirme no painel Cloudflare
 *      (Bots > Content Signals / AI Crawl Control) se essa camada
 *      continua ativa ou se precisa ser replicada aqui.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
