export const CONTACT_AREAS = [
  'Engenharia Civil',
  'Engenharia Elétrica',
  'Eletrônica / Automação',
  'Desenvolvimento de Software',
  'Não sei / Outro',
] as const

export type AreaId = 'civil' | 'eletrica' | 'eletronica' | 'computacao'

export const AREAS: {
  id: AreaId
  index: string
  title: string
  subtitle: string
  description: string
  items: string[]
  /** Preenchido só quando houver nome e registro reais para publicar. */
  specialist?: { name: string; role: string; registro: string }
  /** Prova externa (fora do PORTFOLIO interno), quando fizer mais sentido linkar direto. */
  externalProof?: { label: string; title: string; meta: string; href: string }
}[] = [
  {
    id: 'civil',
    index: '01',
    title: 'Engenharia Civil',
    subtitle: 'Fundação, estrutura, envoltória',
    description:
      'Da fundação ao acabamento: projetamos, orçamos e acompanhamos a execução com documentação técnica que sustenta cada decisão tomada em obra.',
    items: [
      'Reformas residenciais e comerciais',
      'Projetos estruturais e hidrossanitários',
      'Orçamentos e planilhas de custo',
      'Laudos técnicos e vistorias',
    ],
  },
  {
    id: 'eletrica',
    index: '02',
    title: 'Engenharia Elétrica',
    subtitle: 'Energia, proteção, conformidade',
    description:
      'Dimensionamento de circuitos, proteção contra descargas atmosféricas e laudos que colocam a instalação em conformidade com as normas vigentes.',
    items: [
      'Projetos elétricos residenciais e comerciais',
      'SPDA, sistemas de proteção contra descargas',
      'Adequação e reforma de quadros',
      'Laudos técnicos e ART',
    ],
  },
  {
    id: 'eletronica',
    index: '03',
    title: 'Eletrônica & Automação',
    subtitle: 'Sinal, sensores, controle',
    description:
      'Infraestrutura de sinal e automação: da passagem de cabo ao dispositivo que decide sozinho quando acionar, gravar ou alertar.',
    items: [
      'CFTV e controle de acesso',
      'Cabeamento estruturado e redes',
      'Automação residencial e predial',
      'Prototipagem eletrônica sob demanda',
    ],
  },
  {
    id: 'computacao',
    index: '04',
    title: 'Engenharia da Computação',
    subtitle: 'Software, dados, processo',
    description:
      'A mesma engenharia aplicada ao digital: sistemas sob encomenda, automação de processos e a consultoria para decidir o que realmente precisa ser construído.',
    items: [
      'Sites e sistemas sob encomenda',
      'Automação de processos internos',
      'Integrações e APIs',
      'Consultoria de TI e infraestrutura',
    ],
    externalProof: {
      label: 'Portfólio de desenvolvimento',
      title: 'evandro.dev.br',
      meta: 'projetos pessoais · abrir ↗',
      href: 'https://evandro.dev.br',
    },
  },
]

export const PORTFOLIO: {
  id: string
  title: string
  area: string
  areaId: AreaId
  local: string
  ano: string
  description: string
  image: string
  imageAlt: string
  compare?: { image: string; alt: string }
}[] = [
  {
    id: 'reforma',
    title: 'Reforma integral de apartamento',
    area: 'Engenharia Civil',
    areaId: 'civil',
    local: 'Zona Sul',
    ano: '2024',
    description:
      'Da alvenaria exposta ao acabamento pronto, com orçamento fechado desde o início, sem reajuste surpresa no meio da obra.',
    image: '/portfolio/reforma-depois.jpeg',
    imageAlt:
      'Sala de apartamento reformada com piso de concreto polido, paredes brancas e caixilhos metálicos pretos',
    compare: {
      image: '/portfolio/reforma-antes.jpeg',
      alt: 'Mesmo apartamento antes da reforma, com paredes de alvenaria expostas e entulho',
    },
  },
  {
    id: 'quadro',
    title: 'Adequação de quadro e SPDA',
    area: 'Engenharia Elétrica',
    areaId: 'eletrica',
    local: 'Comercial',
    ano: '2024',
    description:
      'Quadro refeito do zero, circuitos identificados e proteção contra descargas em conformidade. A segurança que não se vê, mas evita o pior.',
    image: '/portfolio/quadro-depois.jpg',
    imageAlt:
      'Quadro de distribuição elétrica novo com disjuntores alinhados e cabeamento organizado em canaletas',
    compare: {
      image: '/portfolio/quadro-antes.jpg',
      alt: 'Quadro elétrico antigo com fiação desorganizada e fusíveis cerâmicos',
    },
  },
  {
    id: 'cftv',
    title: 'CFTV e cabeamento estruturado',
    area: 'Eletrônica & Automação',
    areaId: 'eletronica',
    local: 'Galpão logístico',
    ano: '2023',
    description:
      'Câmeras posicionadas para cobrir cada ponto cego, rede certificada ponta a ponta e acesso remoto, para acompanhar sem precisar estar lá.',
    image: '/portfolio/cftv.webp',
    imageAlt:
      'Rack de rede com patch panels, cabos azuis organizados e switch com LEDs acesos',
  },
  {
    id: 'sistema',
    title: 'Sistema de gestão de obras',
    area: 'Desenvolvimento de Software',
    areaId: 'computacao',
    local: 'Sob encomenda',
    ano: '2025',
    description:
      'Pensada para quem gerencia obra no dia a dia: menos planilha solta, mais clareza de custo e prazo em tempo real.',
    image: '/portfolio/software.webp',
    imageAlt:
      'Monitor exibindo painel de software escuro com gráficos e indicadores em azul',
  },
]

/**
 * WhatsApp e e-mail ficam ofuscados (string invertida + base64) em vez de
 * texto plano, para dificultar a raspagem automatizada por bots de spam
 * que só leem o HTML bruto (regex por "mailto:", "wa.me/", padrão de
 * e-mail etc.). São decodificados apenas no navegador, depois do mount —
 * ver `components/site/contact-links.tsx`.
 *
 * Isso não impede um scraper sofisticado rodando navegador real (se um
 * humano consegue ler, um sistema automatizado com recursos suficientes
 * também consegue) — o objetivo é elevar o custo o bastante pra barrar a
 * maioria dos bots simples de coleta em massa, não fornecer segurança real.
 */
export const OBFUSCATED_CONTACTS = {
  whatsapp: {
    label: 'WhatsApp',
    encodedDisplay: 'NTQ4OC03NzE5OSApMTQoIDU1Kw==',
    encodedDigits: 'NTQ4ODc3MTk5MTQ1NQ==',
  },
  email: {
    label: 'E-mail',
    encoded: 'bW9jLmxpYW1nQHNvY2l2cmVzYS5nbmU=',
  },
}

/** Links que não precisam de ofuscação (não são alvo de spam harvesting). */
export const CONTACT_LINKS_PLAIN = [
  { label: 'LinkedIn', value: 'AS Serviços', href: 'https://www.linkedin.com/company/asilvaservicos' },
]

/* -------------------------------------------------------------------------- */
/*  Páginas de serviço por área (app/servicos/[slug])                          */
/* -------------------------------------------------------------------------- */

export const SERVICOS_SLUGS = [
  'engenharia-civil',
  'engenharia-eletrica',
  'tecnologia',
] as const
export type ServicosSlug = (typeof SERVICOS_SLUGS)[number]

export type ServicoPage = {
  slug: ServicosSlug
  themeId: 'civil' | 'eletrica' | 'tech'
  title: string
  headline: string
  description: string
  services: { titulo: string; texto: string }[]
  /** Áreas da home que alimentam esta página (filtro de portfólio/prova). */
  areaIds: AreaId[]
  /** Prova externa publicável (igual à estrutura de AREAS.externalProof). */
  externalProof?: (typeof AREAS)[number]['externalProof']
  cta: { label: string; texto: string }
}

export const SERVICOS_PAGES: ServicoPage[] = [
  {
    slug: 'engenharia-civil',
    themeId: 'civil',
    title: 'Engenharia Civil',
    headline: 'Da fundação ao acabamento, com documentação que sustenta cada decisão.',
    description:
      'Projetamos, orçamos e acompanhamos a execução da obra com registro técnico em cada etapa — do primeiro levantamento ao laudo final.',
    services: [
      {
        titulo: 'Reformas residenciais e comerciais',
        texto:
          'Projeto, orçamento e acompanhamento de execução, com documentação técnica que registra cada etapa da obra.',
      },
      {
        titulo: 'Projetos estruturais e hidrossanitários',
        texto:
          'Cálculo e detalhamento de estrutura e instalações prediais, prontos para execução e para a ART correspondente.',
      },
      {
        titulo: 'Modelagem e documentação em BIM',
        texto:
          'Representação digital da obra para visualizar soluções, coordenar disciplinas e documentar decisões antes da execução.',
      },
      {
        titulo: 'Orçamentos e planilhas de custo',
        texto:
          'Levantamento de quantitativos e composição de custos que sustentam a decisão de investir antes do primeiro dia de obra.',
      },
      {
        titulo: 'Laudos técnicos e vistorias',
        texto:
          'Diagnóstico documentado de patologias e condições da edificação, com as necessidades de intervenção apontadas uma a uma.',
      },
    ],
    areaIds: ['civil'],
    cta: {
      label: 'Descrever minha obra',
      texto:
        'Reformas, laudos e orçamentos começam por uma descrição. Devolvemos um diagnóstico em até 1 dia útil.',
    },
  },
  {
    slug: 'engenharia-eletrica',
    themeId: 'eletrica',
    title: 'Engenharia Elétrica',
    headline: 'Energia dimensionada, protegida e em conformidade com a norma.',
    description:
      'Dimensionamento de circuitos, proteção contra descargas atmosféricas e laudos que colocam a instalação em conformidade com as normas vigentes.',
    services: [
      {
        titulo: 'Projetos elétricos residenciais e comerciais',
        texto:
          'Dimensionamento de circuitos, cargas e proteções conforme as normas vigentes, com pranchas prontas para execução.',
      },
      {
        titulo: 'SPDA e proteção contra descargas',
        texto:
          'Captor, descidas e aterramento projetados, com laudo que comprova a conformidade da proteção contra raios.',
      },
      {
        titulo: 'Adequação e reforma de quadros',
        texto:
          'Quadros reorganizados com disjuntores dimensionados, circuitos identificados e diagramas atualizados.',
      },
      {
        titulo: 'Laudos técnicos e ART',
        texto:
          'Inspeção documentada da instalação, com não conformidades apontadas e plano de correção priorizado.',
      },
    ],
    areaIds: ['eletrica'],
    cta: {
      label: 'Descrever minha instalação',
      texto:
        'Quadros, SPDA e laudos começam por uma descrição. Devolvemos um diagnóstico em até 1 dia útil.',
    },
  },
  {
    slug: 'tecnologia',
    themeId: 'tech',
    title: 'Engenharia da Computação & Tecnologia',
    headline: 'Sistemas, automação e infraestrutura — a mesma engenharia aplicada ao digital.',
    description:
      'Software sob encomenda, automação de processos, manutenção de TI, redes e CFTV. O que sua empresa roda no dia a dia, construído ou sustentado por quem entende de engenharia.',
    services: [
      {
        titulo: 'Sites e sistemas sob encomenda',
        texto:
          'Do site institucional ao sistema interno com painel administrativo, banco de dados e integrações.',
      },
      {
        titulo: 'Automação de processos internos',
        texto:
          'Tarefas repetitivas transformadas em rotinas: integrações, geração de documentos e fluxos de aprovação.',
      },
      {
        titulo: 'Integrações e APIs',
        texto:
          'Conectar os sistemas que sua empresa já usa — planilhas, ERPs, gateways — sem reconstruir o que funciona.',
      },
      {
        titulo: 'Manutenção de TI e infraestrutura',
        texto:
          'Suporte a computadores, servidores e redes, com foco em empresas pequenas e médias.',
      },
      {
        titulo: 'Cabeamento estruturado e redes',
        texto:
          'Infraestrutura de sinal organizada e documentada: cabeamento, painéis, roteadores e pontos de rede.',
      },
      {
        titulo: 'CFTV e controle de acesso',
        texto:
          'Projeto e instalação de câmeras e controle de acesso, com gravação e alertas configurados.',
      },
    ],
    areaIds: ['eletronica', 'computacao'],
    externalProof: {
      label: 'Portfólio de desenvolvimento',
      title: 'evandro.dev.br',
      meta: 'projetos pessoais · abrir ↗',
      href: 'https://evandro.dev.br',
    },
    cta: {
      label: 'Descrever minha demanda de tecnologia',
      texto:
        'Sistemas, automação e TI começam por uma descrição. Devolvemos um diagnóstico em até 1 dia útil.',
    },
  },
]
