export const CONTACT_AREAS = [
 'Engenharia Civil',
 'Engenharia Elétrica',
 'Eletrônica / Automação',
 'Desenvolvimento de Software',
 'Não sei / Outro',
] as const

/** Placeholder da descrição da demanda por área (dashboard). */
export const DEMAND_PLACEHOLDERS: Record<(typeof CONTACT_AREAS)[number], string> = {
 'Engenharia Civil':
  'Ex.: Reforma de banheiro em apartamento; orçamento e acompanhamento de obra.',
 'Engenharia Elétrica': 'Ex.: Laudo de SPDA vencido; condomínio precisa regularizar.',
 'Eletrônica / Automação':
  'Ex.: Automação de portão e iluminação; CFTV com acesso pelo celular.',
 'Desenvolvimento de Software':
  'Ex.: Sistema interno para controlar pedidos e clientes da empresa.',
 'Não sei / Outro': 'Ex.: Descreva sua demanda mesmo sem saber a área — a gente classifica.',
}

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
 href?: string
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
   image: '/portfolio/reforma-depois.jpg',
   imageAlt:
    'Sala de apartamento reformada com piso de concreto polido, paredes brancas e caixilhos metálicos pretos',
   compare: {
    image: '/portfolio/reforma-antes.jpg',
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
   id: 'sevmodaintima',
   title: 'SEV Moda Íntima',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'Portfólio público',
   ano: 'ao vivo',
   description:
    'Site publicado com catálogo e experiência digital para uma marca de moda íntima.',
   image: '/portfolio/technology/sevmodaintima.jpg',
   imageAlt:
    'Página inicial da SEV Moda Íntima com navegação, chamada de coleção e produtos em destaque',
   href: 'https://sevmodaintima.com.br/',
  },
  {
   id: 'nutriscan',
   title: 'NutriScan',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'Portfólio público',
   ano: 'ao vivo',
   description:
    'Aplicação web de nutrição com foco em produto digital e uso offline.',
   image: '/portfolio/technology/nutriscan.jpg',
   imageAlt:
    'Aplicação NutriScan aberta no navegador com interface de análise nutricional',
   href: 'https://nutriscan.evandro.dev.br/',
  },
  {
   id: 'sc-plus',
   title: 'SCPLUS',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'Portfólio público',
   ano: 'ao vivo',
   description:
    'Site institucional para educação, ciência e tecnologia em Garuva-SC.',
   image: '/portfolio/technology/sc-plus.jpg',
   imageAlt:
    'Captura da página inicial da SCPLUS com fundo preto e destaques em verde',
   href: 'https://scplus.evandro.dev.br/',
  },
  {
   id: 'piagentui',
   title: 'PiAgentUI',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'Workspace desktop e web para agentes de IA: sessões, ferramentas MCP, skills e terminal integrados, com app Tauri.',
   image: '/portfolio/technology/piagentui.jpg',
   imageAlt:
    'Interface do PiAgentUI com chat de agente de IA e painel lateral de MCP',
   href: 'https://github.com/evandrodevbr/PiAgentUI',
  },
  {
   id: 'gemininexus',
   title: 'Gemini Nexus',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'Gateway de IA multi-contas para Gemini e Claude com troca automática, analytics de uso e proxy local OpenAI/Anthropic.',
   image: '/portfolio/technology/gemininexus.jpg',
   imageAlt:
    'Dashboard do Gemini Nexus com gráficos de uso de tokens e contas conectadas',
   href: 'https://github.com/evandrodevbr/GeminiNexus',
  },
  {
   id: 'ollahub',
   title: 'OllaHub',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'App desktop para gerenciar modelos Ollama locais: chat, agendamento de tarefas e modo de fundo na bandeja do sistema.',
   image: '/portfolio/technology/ollahub.jpg',
   imageAlt:
    'Card de repositório do OllaHub, app desktop para modelos Ollama',
   href: 'https://github.com/evandrodevbr/OllaHub',
  },
  {
   id: 'localmind',
   title: 'LocalMind',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'Chat com modelos de IA locais no celular — app React Native para LMStudio, 100% offline e sem nuvem.',
   image: '/portfolio/technology/localmind.jpg',
   imageAlt:
    'Card de repositório do LocalMind, app mobile para IA local',
   href: 'https://github.com/evandrodevbr/LocalMind',
  },
  {
   id: 'latebra',
   title: 'latebra',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'Servidor MCP anti-bot para scraping anônimo com evasão em camadas, TLS fingerprinting e rotação de proxies.',
   image: '/portfolio/technology/latebra.jpg',
   imageAlt:
    'Card de repositório do latebra, servidor MCP anti-bot de scraping',
   href: 'https://github.com/evandrodevbr/latebra',
  },
  {
   id: 'orelhia',
   title: 'orelhIA',
   area: 'Desenvolvimento de Software',
   areaId: 'computacao',
   local: 'GitHub',
   ano: '2026',
   description:
    'Servidor MCP de transcrição de áudio local com modelo PT-BR nativo, cache LRU e detecção de voz (VAD).',
   image: '/portfolio/technology/orelhia.jpg',
   imageAlt:
    'Card de repositório do orelhIA, servidor MCP de transcrição de áudio',
   href: 'https://github.com/evandrodevbr/orelhIA',
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
/** Placeholder do campo "Descrição da demanda" no formulário da página. */
placeholder: string
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
  placeholder:
   'Ex.: Quero reformar o banheiro do apartamento e preciso de orçamento e acompanhamento de obra.',
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
  placeholder:
   'Ex.: Preciso de um laudo de SPDA para o condomínio onde moro. O atual está vencido e o síndico pediu regularização até o fim do mês.',
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
  headline: 'Sites, software e sistemas conectados para fazer sua operação avançar.',
  description:
   'Do site publicado ao software sob encomenda, da arquitetura à infraestrutura conectada: construímos e sustentamos tecnologia que sua empresa usa todos os dias.',
  services: [
   {
    titulo: 'Criação de sites e experiências digitais',
    texto:
     'Sites institucionais, páginas de campanha e experiências digitais que apresentam sua empresa com clareza.',
   },
   {
    titulo: 'Engenharia de software e sistemas sob encomenda',
    texto:
     'Sistemas internos e produtos digitais desenhados para a rotina real, com dados, painéis e integrações.',
   },
   {
    titulo: 'Consultoria Next.js',
    texto:
     'Orientação para aplicações Next.js com rotas bem definidas, desempenho, acessibilidade e evolução segura.',
   },
   {
    titulo: 'Arquitetura de software, integrações e APIs',
    texto:
     'Decisões técnicas e conexões entre os sistemas que sua empresa já usa, sem reconstruir o que funciona.',
   },
   {
    titulo: 'Automação desktop com Tauri + Rust',
    texto:
     'Ferramentas desktop leves para automatizar tarefas do ambiente de trabalho e reduzir operações manuais.',
   },
   {
    titulo: 'Hardware + Software + IoT',
    texto:
     'Sistemas conectados que aproximam sensores, dispositivos e software para observar e controlar a operação.',
   },
   {
    titulo: 'Manutenção de TI e redes',
    texto:
     'Suporte a computadores, servidores e infraestrutura de sinal organizada e documentada.',
   },
   {
    titulo: 'CFTV e controle de acesso',
    texto:
     'Projeto e instalação de câmeras e controle de acesso, com gravação e alertas configurados.',
   },
  ],
  areaIds: ['eletronica', 'computacao'],
  placeholder:
   'Ex.: Preciso de um site institucional e de um sistema para controlar os pedidos da minha empresa.',
  externalProof: {
   label: 'Portfólio de desenvolvimento',
   title: 'evandro.dev.br',
   meta: 'projetos pessoais · abrir ↗',
   href: 'https://evandro.dev.br',
  },
  cta: {
   label: 'Descrever minha demanda de tecnologia',
   texto:
    'Sites, software, automação e TI começam por uma descrição. Devolvemos um diagnóstico em até 1 dia útil.',
  },
 },
]
