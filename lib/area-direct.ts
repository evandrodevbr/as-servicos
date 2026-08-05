/**
 * Direcionadores da home — os três caminhos para as páginas de serviço.
 * As cores são as dos temas de cada área (mesmas do CSS, com contraste AA
 * sobre o fundo claro e sobre o fundo dos nós do mapa).
 */
export const AREA_DIRECT = [
  {
    href: '/servicos/engenharia-civil',
    title: 'Engenharia Civil',
    short: 'Civil',
    line: 'Obra, estrutura, BIM, laudos e orçamentos.',
    color: '#A25700',
  },
  {
    href: '/servicos/engenharia-eletrica',
    title: 'Engenharia Elétrica',
    short: 'Elétrica',
    line: 'Projetos, SPDA, quadros e ART.',
    color: '#0063D7',
  },
  {
    href: '/servicos/tecnologia',
    title: 'Engenharia da Computação & Tecnologia',
    short: 'Tecnologia',
    line: 'Software, automação, TI, redes e CFTV.',
    color: '#6952DB',
  },
] as const
