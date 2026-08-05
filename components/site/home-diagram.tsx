import Link from 'next/link'
import type { CSSProperties } from 'react'
import { AREA_DIRECT } from '@/lib/area-direct'

const LAYER_KEYS = ['civil', 'electric', 'tech'] as const
const LAYER_CODES = ['ESTRUTURA · BIM', 'ENERGIA · ART', 'DADOS · AUTOMAÇÃO'] as const

/**
 * THESIS: uma única prancha coordena estrutura, energia e dados; recusa cards
 * isolados como explicação da empresa. OWN-WORLD: fundo técnico claro, planos
 * axonométricos, cotas NTS e acentos por disciplina. STORY: a base civil recebe
 * energia e controle até formar um sistema único. FIRST VIEWPORT: proposta e
 * CTA à esquerda; prancha 2.5D dominante e três acessos reais à direita.
 * FORM: direção 2 escolhida — prancha multidisciplinar 2.5D, estática por
 * padrão, com um único sinal independente e sem vínculo com scroll.
 */
export function HomeDiagram() {
  return (
    <nav
      className="home-plate mx-auto w-full max-w-[760px]"
      aria-label="Áreas de atuação da AS Serviços"
    >
      <div className="home-plate__heading" aria-hidden="true">
        <span>PRANCHA AS · COORDENAÇÃO MULTIDISCIPLINAR</span>
        <span>ESCALA NTS</span>
      </div>

      <div className="home-plate__drawing" aria-hidden="true">
        <svg
          viewBox="0 0 720 500"
          className="home-plate__svg"
          fill="none"
          focusable="false"
        >
          <defs>
            <pattern
              id="home-plate-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 0H0V32"
                className="home-plate__grid-line"
              />
            </pattern>
          </defs>

          <rect width="720" height="500" fill="url(#home-plate-grid)" />

          <g className="home-plate__registration">
            <path d="M16 16H44M16 16V44M676 16H704M704 16V44M16 456V484M16 484H44M704 456V484M676 484H704" />
            <path d="M74 438H628M103 452H599" />
            <path d="M92 424V452M610 424V452" />
          </g>

          <g className="home-plate__connectors">
            <path d="M205 145L160 245L120 340M350 70L340 150L330 230M540 160L590 270L620 365M395 235L410 365L410 480" />
          </g>

          <g className="home-plate__layer home-plate__layer--civil">
            <path
              className="home-plate__plane"
              d="M120 340L330 230L620 365L410 480Z"
            />
            <path d="M120 340V362L410 500V480M410 500L620 387V365" />
            <path d="M187 355L330 280L548 382L404 458Z" />
            <path d="M263 315L481 417M330 280L404 458M187 355L404 458" />
            <path d="M225 375L369 299V398L454 438" />
            <path className="home-plate__detail" d="M147 347L190 325M547 377L593 353" />
            <circle className="home-plate__node" cx="330" cy="280" r="4" />
            <circle className="home-plate__node" cx="404" cy="458" r="4" />
          </g>

          <g className="home-plate__layer home-plate__layer--electric">
            <path
              className="home-plate__plane"
              d="M160 245L340 150L590 270L410 365Z"
            />
            <path d="M205 254L340 183L545 281L410 352Z" />
            <path className="home-plate__route" d="M205 254L302 300L410 244L511 292L545 281" />
            <path className="home-plate__route" d="M340 183V221L410 254V352" />
            <path d="M251 230L273 241V270L251 259ZM474 245L506 260V292L474 277Z" />
            <circle className="home-plate__node" cx="205" cy="254" r="4" />
            <circle className="home-plate__node" cx="302" cy="300" r="4" />
            <circle className="home-plate__node" cx="410" cy="244" r="4" />
            <circle className="home-plate__node" cx="511" cy="292" r="4" />
          </g>

          <g className="home-plate__layer home-plate__layer--tech">
            <path
              className="home-plate__plane"
              d="M205 145L350 70L540 160L395 235Z"
            />
            <path d="M247 149L350 95L498 165L395 219Z" />
            <path d="M271 143L350 181L431 139M350 95V181M247 149L350 181L498 165" />
            <path className="home-plate__route" d="M271 143L350 95L431 139L498 165" />
            <circle className="home-plate__node" cx="271" cy="143" r="5" />
            <circle className="home-plate__node" cx="350" cy="95" r="5" />
            <circle className="home-plate__node" cx="350" cy="181" r="5" />
            <circle className="home-plate__node" cx="431" cy="139" r="5" />
            <circle className="home-plate__node" cx="498" cy="165" r="5" />
          </g>

          <g className="home-plate__spine">
            <path d="M350 95L410 244L404 458" />
            <path className="home-plate__signal" d="M350 95L410 244L404 458" />
            <circle cx="350" cy="95" r="7" />
            <circle cx="410" cy="244" r="7" />
            <circle cx="404" cy="458" r="7" />
          </g>

          <g className="home-plate__annotations">
            <path d="M124 390H64V414" />
            <text x="64" y="432">CIV // BASE CONSTRUÍDA</text>
            <path d="M548 302H651V280" />
            <text x="552" y="269">ELE // ENERGIA DISTRIBUÍDA</text>
            <path d="M486 114H636V92" />
            <text x="492" y="80">TEC // CONTROLE CONECTADO</text>
          </g>
        </svg>
      </div>

      <div className="home-plate__legend">
        {AREA_DIRECT.map((area, index) => {
          const key = LAYER_KEYS[index]

          return (
            <Link
              key={area.href}
              href={area.href}
              className={`home-plate__legend-link home-plate__legend-link--${key}`}
              style={{ '--layer-color': area.color } as CSSProperties}
            >
              <span className="home-plate__legend-meta" aria-hidden="true">
                <span>{LAYER_CODES[index]}</span>
                <span>↗</span>
              </span>
              <strong>{area.short}</strong>
              <span className="home-plate__legend-copy">{area.line}</span>
            </Link>
          )
        })}
      </div>

      <div className="home-plate__footer" aria-hidden="true">
        <span>FÍSICO + ELÉTRICO + DIGITAL</span>
        <span>REV. 01</span>
      </div>
    </nav>
  )
}
