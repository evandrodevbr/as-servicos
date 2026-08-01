'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { href: '#areas', label: 'Atuação' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#metodo', label: 'Método' },
  { href: '#contato', label: 'Contato' },
]

export function SiteNav() {
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2"
          aria-label="AS Serviços · início"
        >
          <Image
            src="/logo.png"
            alt="AS Serviços"
            width={40}
            height={40}
            priority
            className="h-9 w-9 object-contain transition-opacity group-hover:opacity-80"
          />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-tech text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground label-tech border px-4 py-2.5 transition-colors"
          >
            Solicitar orçamento
          </a>
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
            {[...LINKS, { href: '#contato', label: 'Solicitar orçamento' }].map(
              (l, i) => (
                <li key={`${l.href}-${i}`} className="border-border border-b last:border-0">
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="label-tech text-foreground hover:text-primary block py-4 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
