import { AREAS, CONTACT_LINKS_PLAIN } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'

// E-mail/telefone ficam FORA do JSON-LD de propósito: mesmo sendo dado
// estruturado lido por crawlers legítimos, ele ainda é texto plano no HTML
// bruto servido pelo servidor — e a prioridade aqui é não ter e-mail/telefone
// em texto plano em nenhuma área de código/HTML, só no link já ofuscado que
// o próprio usuário vê na tela (ver components/site/contact-links.tsx).
const linkedin = CONTACT_LINKS_PLAIN.find((c) => c.label === 'LinkedIn')

const serviceNodes = AREAS.map((area) => ({
  '@type': 'Service',
  '@id': `${SITE_URL}/#service-${area.id}`,
  name: area.title,
  serviceType: area.title,
  description: area.description,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  url: `${SITE_URL}/#areas`,
}))

/**
 * `address`/`geo` são deliberadamente omitidos: não há endereço confirmado
 * em nenhum lugar do site/repositório, e inventar um violaria a regra de
 * não usar placeholder. Adicionar assim que a empresa confirmar cidade/UF
 * de atendimento (também habilita rich results de Local Pack/Maps).
 */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#organization`,
      name: 'AS Serviços',
      alternateName: 'AS Serviços de Engenharia',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      description:
        'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software, com um profissional qualificado à frente de cada área. Projetos, laudos, automação e sistemas sob encomenda, com precificação transparente.',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      ...(linkedin ? { sameAs: [linkedin.href] } : {}),
      makesOffer: serviceNodes.map((s) => ({ '@id': s['@id'] })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'AS Serviços',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'AS Serviços · Engenharia e Tecnologia sob o mesmo teto',
      description:
        'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software. Projetos, laudos, automação e sistemas sob encomenda com precificação transparente.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pt-BR',
    },
    ...serviceNodes,
  ],
}
