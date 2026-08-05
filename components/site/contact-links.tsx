'use client'

import { useLayoutEffect, useState } from 'react'
import { decodeObfuscated } from '@/lib/obfuscate'
import { CONTACT_LINKS_PLAIN, OBFUSCATED_CONTACTS } from '@/lib/site-data'

type ResolvedContact = { label: string; value: string; href: string }

/**
 * Decodifica WhatsApp/e-mail só no navegador (useLayoutEffect roda antes do
 * primeiro paint, então não há flash de placeholder). Enquanto isso, os
 * links ficam com aria-disabled e sem href — nada de texto/mailto em texto
 * plano no HTML servido pelo servidor.
 */
function useResolvedContacts(): ResolvedContact[] | null {
  const [resolved, setResolved] = useState<ResolvedContact[] | null>(null)

  useLayoutEffect(() => {
    const whatsappValue = decodeObfuscated(OBFUSCATED_CONTACTS.whatsapp.encodedDisplay)
    const whatsappDigits = decodeObfuscated(OBFUSCATED_CONTACTS.whatsapp.encodedDigits)
    const email = decodeObfuscated(OBFUSCATED_CONTACTS.email.encoded)

    setResolved([
      {
        label: OBFUSCATED_CONTACTS.whatsapp.label,
        value: whatsappValue,
        href: `https://wa.me/${whatsappDigits}`,
      },
      { label: OBFUSCATED_CONTACTS.email.label, value: email, href: `mailto:${email}` },
      ...CONTACT_LINKS_PLAIN,
    ])
  }, [])

  return resolved
}

/** Variante usada na seção de Contato: rótulo + valor lado a lado. */
export function ContactLinksDetail() {
  const contacts = useResolvedContacts()
  const placeholder = OBFUSCATED_CONTACTS.email.label // só pra manter 3 linhas antes de resolver

  return (
    <dl className="flex flex-col">
      {(contacts ?? [
        { label: OBFUSCATED_CONTACTS.whatsapp.label, value: '', href: '' },
        { label: placeholder, value: '', href: '' },
        ...CONTACT_LINKS_PLAIN,
      ]).map((c) => (
        <div
          key={c.label}
          className="border-border flex items-baseline justify-between gap-6 border-t py-4 last:border-b"
        >
          <dt className="label-tech text-muted-foreground">{c.label}</dt>
          <dd>
            {contacts ? (
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className="text-foreground hover:text-primary text-base font-medium transition-colors"
              >
                {c.value}
              </a>
            ) : (
              <span className="text-muted-foreground text-sm" aria-hidden="true">
                ···
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Variante usada no rodapé: só o rótulo é o texto do link. */
export function ContactLinksFooter() {
  const contacts = useResolvedContacts()

  return (
    <ul className="flex flex-col gap-1.5">
      {(contacts ?? [
        { label: OBFUSCATED_CONTACTS.whatsapp.label, value: '', href: '' },
        { label: OBFUSCATED_CONTACTS.email.label, value: '', href: '' },
        ...CONTACT_LINKS_PLAIN,
      ]).map((c) => (
        <li key={c.label}>
          <a
            href={contacts ? c.href : undefined}
            aria-disabled={!contacts}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
            className="label-tech text-muted-foreground hover:text-primary -my-1.5 block py-3 transition-colors"
          >
            {c.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
