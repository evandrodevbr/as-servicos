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
      'SPDA — sistemas de proteção contra descargas',
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
  },
]

export const PORTFOLIO: {
  id: string
  title: string
  area: string
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
    local: 'Zona Sul',
    ano: '2024',
    description:
      'Da alvenaria exposta ao acabamento pronto, com orçamento fechado desde o início — sem reajuste surpresa no meio da obra.',
    image: '/portfolio/reforma-depois.png',
    imageAlt:
      'Sala de apartamento reformada com piso de concreto polido, paredes brancas e caixilhos metálicos pretos',
    compare: {
      image: '/portfolio/reforma-antes.png',
      alt: 'Mesmo apartamento antes da reforma, com paredes de alvenaria expostas e entulho',
    },
  },
  {
    id: 'quadro',
    title: 'Adequação de quadro e SPDA',
    area: 'Engenharia Elétrica',
    local: 'Comercial',
    ano: '2024',
    description:
      'Quadro refeito do zero, circuitos identificados e proteção contra descargas em conformidade — a segurança que não se vê, mas evita o pior.',
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
    local: 'Galpão logístico',
    ano: '2023',
    description:
      'Câmeras posicionadas para cobrir cada ponto cego, rede certificada ponta a ponta e acesso remoto — para acompanhar sem precisar estar lá.',
    image: '/portfolio/cftv.png',
    imageAlt:
      'Rack de rede com patch panels, cabos azuis organizados e switch com LEDs acesos',
  },
  {
    id: 'sistema',
    title: 'Sistema de gestão de obras',
    area: 'Desenvolvimento de Software',
    local: 'Sob encomenda',
    ano: '2025',
    description:
      'Pensada para quem gerencia obra no dia a dia: menos planilha solta, mais clareza de custo e prazo em tempo real.',
    image: '/portfolio/software.png',
    imageAlt:
      'Monitor exibindo painel de software escuro com gráficos e indicadores em azul',
  },
]

export const CONTACT_LINKS = [
  { label: 'WhatsApp', value: '+55 (41) 9984-7511', href: 'https://wa.me/554199847511' },
  { label: 'E-mail', value: 'contato@asservicos.com.br', href: 'mailto:contato@asservicos.com.br' },
  { label: 'LinkedIn', value: 'AS Serviços', href: 'https://www.linkedin.com/company/asilvaservicos' },
]
