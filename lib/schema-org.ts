import { AREAS, CONTACT_LINKS_PLAIN, OBFUSCATED_CONTACTS } from '@/lib/site-data'
import { SITE_URL } from '@/lib/site-config'
import { decodeObfuscated } from '@/lib/obfuscate'

// O e-mail/telefone aqui ficam em texto plano DE PROPÓSITO: isto é dado
// estruturado (schema.org) lido por crawlers legítimos (Google, Bing) para
// sinais de entidade/negócio local — ofuscar isso derrubaria justamente o
// benefício de SEO que a marcação existe para dar. A ofuscação contra bots
// de spam se aplica só aos links visíveis para humanos (ver
// components/site/contact-links.tsx), não a este dado estruturado.
const email = decodeObfuscated(OBFUSCATED_CONTACTS.email.encoded)
const whatsappDigits = decodeObfuscated(OBFUSCATED_CONTACTS.whatsapp.encodedDigits)
const linkedin = CONTACT_LINKS_PLAIN.find((c) => c.label === 'LinkedIn')

/** Telefone da empresa em E.164, derivado do WhatsApp já existente. */
const TELEPHONE = whatsappDigits ? `+${whatsappDigits}` : undefined

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
        'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software sob um único responsável técnico, com projetos, laudos, automação e sistemas sob encomenda e precificação transparente.',
      ...(email ? { email } : {}),
      ...(TELEPHONE ? { telephone: TELEPHONE } : {}),
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
      name: 'AS Serviços — Engenharia e Tecnologia sob o mesmo teto',
      description:
        'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software. Projetos, laudos, automação e sistemas sob encomenda com precificação transparente.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pt-BR',
    },
    ...serviceNodes,
  ],
}
