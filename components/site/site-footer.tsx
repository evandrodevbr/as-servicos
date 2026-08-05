import Image from 'next/image'
import Link from 'next/link'
import { ContactLinksFooter } from '@/components/site/contact-links'

const NAV = [
  { href: '/servicos/engenharia-civil', label: 'Civil' },
  { href: '/servicos/engenharia-eletrica', label: 'Elétrica' },
  { href: '/servicos/tecnologia', label: 'Tecnologia' },
  { href: '#contato', label: 'Contato' },
]

export function SiteFooter({
  nav = NAV,
}: {
  /** Navegação do rodapé; default = âncoras da home. */
  nav?: { href: string; label: string }[]
}) {
  return (
    <footer className="border-border bg-background/80 relative border-t backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/logo.webp"
              alt="AS Serviços"
              width={128}
              height={59}
              className="h-9 w-auto object-contain"
            />
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Engenharia civil, elétrica, eletrônica e de software, com um
              profissional qualificado à frente de cada área, sob o mesmo
              teto.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-col gap-1.5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="label-tech text-muted-foreground hover:text-foreground -my-1.5 py-3 transition-colors"
              >
                {n.label}
              </Link>
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
