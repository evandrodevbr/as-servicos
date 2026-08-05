'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '/servicos/engenharia-civil', label: 'Civil' },
  { href: '/servicos/engenharia-eletrica', label: 'Elétrica' },
  { href: '/servicos/tecnologia', label: 'Tecnologia' },
  { href: '#contato', label: 'Contato' },
]

type SiteNavProps = {
  /** Navegação da página; default = âncoras da home. */
  links?: { href: string; label: string }[]
  /** Destino do logo (home usa a âncora #top). */
  rootHref?: string
  /** Destino do CTA "Solicitar orçamento". */
  ctaHref?: string
  /** Rótulo do CTA, ajustado ao destino da página. */
  ctaLabel?: string
}

export function SiteNav({
  links = LINKS,
  rootHref = '#top',
  ctaHref = '#contato',
  ctaLabel = 'Solicitar orçamento',
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {open && (
        <div
          className="bg-background/60 fixed inset-0 z-30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Link
            href={rootHref}
            className="group flex items-center gap-2"
            aria-label="AS Serviços · início"
          >
            <span className="relative block h-8 w-16 overflow-hidden" aria-hidden="true">
              <Image
                src="/logo.webp"
                alt=""
                width={128}
                height={59}
                className="h-full w-full object-contain transition-opacity group-hover:opacity-80"
              />
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-tech text-muted-foreground hover:text-primary inline-flex h-11 items-center transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground label-tech inline-flex h-11 items-center border px-5 transition-colors"
            >
              {ctaLabel}
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-foreground border-border flex h-11 w-11 items-center justify-center border md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`bg-foreground absolute left-0 block h-px w-4 transition-transform duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`bg-foreground absolute left-0 block h-px w-4 transition-transform duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>

        <div className="bg-border h-px w-full">
          <div ref={barRef} className="bg-primary h-full w-full origin-left scale-x-0" />
        </div>

        {open && (
          <nav
            id="menu-mobile"
            aria-label="Menu mobile"
            className="bg-background/95 border-border border-b backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col px-5 py-2">
              {[...links, { href: ctaHref, label: ctaLabel }].map(
                (l, i) => (
                  <li key={`${l.href}-${i}`} className="border-border border-b last:border-0">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="label-tech text-foreground hover:text-primary block py-4 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
