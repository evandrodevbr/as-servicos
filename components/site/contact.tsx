'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Reveal } from '@/components/motion/reveal'
import { submitContact, type ContactState } from '@/app/actions/contact'
import { ContactLinksDetail } from '@/components/site/contact-links'
import { CONTACT_AREAS } from '@/lib/site-data'

const initialState: ContactState = { status: 'idle', message: '' }

/** Formata progressivamente enquanto digita: (DDD) fixo 4-4 ou celular 5-4. */
function formatBrazilianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  if (digits.length <= 6) return `(${ddd}) ${rest}`
  if (digits.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
}

const fieldClass =
  'border-border bg-card/85 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full border px-4 py-3 text-sm outline-none backdrop-blur-sm transition-colors focus:ring-2'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring disabled:opacity-60 label-tech inline-flex h-12 items-center justify-center px-8 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {pending ? 'Enviando…' : 'Enviar solicitação'}
    </button>
  )
}

export function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState)

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <Reveal className="border-border border-t pt-10" stagger>
          <p className="label-tech text-primary reveal-init mb-6">
            [ 04 ] Contato
          </p>
          <h2
            id="contato-title"
            className="font-display reveal-init max-w-3xl text-balance text-3xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-5xl"
          >
            Descreva a demanda. Devolvemos um diagnóstico.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-20">
          <Reveal className="flex flex-col gap-10" stagger y={24}>
            <p className="text-muted-foreground reveal-init max-w-md text-base leading-relaxed">
              Atendemos obras, instalações e projetos de software. Quanto mais
              contexto você trouxer, mais preciso é o retorno técnico.
            </p>

            <ContactLinksDetail />

            <div className="reveal-init border-border bg-card/30 border p-6">
              <p className="label-tech text-muted-foreground">Retorno</p>
              <p className="text-foreground mt-3 text-sm leading-relaxed">
                Respondemos em até 1 dia útil. Visitas técnicas são agendadas
                conforme a região e a complexidade do escopo.
              </p>
            </div>
          </Reveal>

          <Reveal y={24}>
            <form action={formAction} className="flex flex-col gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nome" className="label-tech text-muted-foreground">
                    Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={!!state.errors?.nome}
                    aria-describedby={state.errors?.nome ? 'nome-error' : undefined}
                    className={fieldClass}
                  />
                  {state.errors?.nome && (
                    <p id="nome-error" className="text-destructive text-xs">
                      {state.errors.nome}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="telefone"
                    className="label-tech text-muted-foreground"
                  >
                    Telefone
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(11) 90000-0000"
                    required
                    maxLength={15}
                    onChange={(e) => {
                      e.target.value = formatBrazilianPhone(e.target.value)
                    }}
                    aria-invalid={!!state.errors?.telefone}
                    aria-describedby={
                      state.errors?.telefone ? 'telefone-error' : undefined
                    }
                    className={fieldClass}
                  />
                  {state.errors?.telefone && (
                    <p id="telefone-error" className="text-destructive text-xs">
                      {state.errors.telefone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="label-tech text-muted-foreground">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim().toLowerCase()
                  }}
                  aria-invalid={!!state.errors?.email}
                  aria-describedby={state.errors?.email ? 'email-error' : undefined}
                  className={fieldClass}
                />
                {state.errors?.email && (
                  <p id="email-error" className="text-destructive text-xs">
                    {state.errors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="area" className="label-tech text-muted-foreground">
                  Área
                </label>
                <select
                  id="area"
                  name="area"
                  defaultValue=""
                  required
                  aria-invalid={!!state.errors?.area}
                  aria-describedby={state.errors?.area ? 'area-error' : undefined}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Selecione uma área
                  </option>
                  {CONTACT_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {state.errors?.area && (
                  <p id="area-error" className="text-destructive text-xs">
                    {state.errors.area}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="mensagem"
                  className="label-tech text-muted-foreground"
                >
                  Descrição da demanda
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows={5}
                  required
                  placeholder="Ex.: Preciso de um laudo de SPDA para o condomínio onde moro — o atual está vencido e o síndico pediu regularização até o fim do mês."
                  aria-invalid={!!state.errors?.mensagem}
                  aria-describedby={
                    state.errors?.mensagem ? 'mensagem-error' : undefined
                  }
                  className={`${fieldClass} resize-y`}
                />
                {state.errors?.mensagem && (
                  <p id="mensagem-error" className="text-destructive text-xs">
                    {state.errors.mensagem}
                  </p>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-5">
                <SubmitButton />
                <p
                  role="status"
                  aria-live="polite"
                  className={
                    state.status === 'success'
                      ? 'text-primary text-sm'
                      : 'text-destructive text-sm'
                  }
                >
                  {state.message}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
