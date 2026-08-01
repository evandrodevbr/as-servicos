import Image from 'next/image'
import { ContactLinksFooter } from '@/components/site/contact-links'

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
            <Image
              src="/logo.png"
              alt="AS Serviços"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
            />
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Engenharia civil, elétrica, eletrônica e de software — um
              profissional qualificado à frente de cada área, sob o mesmo
              teto.
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

          <ContactLinksFooter />
        </div>

        <div className="border-border mt-12 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-tech text-muted-foreground/70">
            © {new Date().getFullYear()} AS Serviços de Engenharia
          </p>
          <p className="label-tech text-muted-foreground/70">
            Responsáveis técnicos com ART em cada projeto
          </p>
        </div>
      </div>
    </footer>
  )
}
