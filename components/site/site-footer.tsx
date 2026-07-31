import { CONTACT_LINKS } from '@/lib/site-data'

const NAV = [
  { href: '#areas', label: 'Áreas' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#metodo', label: 'Método' },
  { href: '#contato', label: 'Contato' },
]

export function SiteFooter() {
  return (
    <footer className="border-border bg-background/80 relative border-t backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-foreground text-lg font-bold tracking-tight">
              AS Serviços
            </p>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Engenharia civil, elétrica, eletrônica e de software sob um único
              responsável técnico.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="label-tech text-muted-foreground hover:text-foreground transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <ul className="flex flex-col gap-3">
            {CONTACT_LINKS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="label-tech text-muted-foreground hover:text-primary transition-colors"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-border mt-12 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-tech text-muted-foreground/70">
            © {new Date().getFullYear()} AS Serviços de Engenharia
          </p>
          <p className="label-tech text-muted-foreground/70">
            Responsável técnico com ART em todos os projetos
          </p>
        </div>
      </div>
    </footer>
  )
}
