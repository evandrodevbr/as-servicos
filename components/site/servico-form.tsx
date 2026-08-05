'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitServicoContact, type ServicoContactState } from '@/app/actions/servico-contact'
import { formatBrazilianPhone } from '@/lib/format-phone'
import type { ServicoPage } from '@/lib/site-data'

const initialState: ServicoContactState = { status: 'idle', message: '' }

const fieldClass =
  'border-border bg-card/85 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/30 w-full border px-4 py-3 text-sm outline-none transition-colors focus:ring-2'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring label-tech inline-flex h-12 items-center justify-center px-8 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
    >
      {pending ? 'Enviando…' : label}
    </button>
  )
}

/**
 * Formulário da página de serviço — a área é fixa da página (sem select) e o
 * pedido chega ao dashboard com a tag `servicos/{slug}`.
 */
export function ServicoForm({ page }: { page: ServicoPage }) {
  const [state, formAction] = useActionState(
    submitServicoContact.bind(null, page.slug),
    initialState,
  )

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`nome-${page.slug}`} className="label-tech text-muted-foreground">
            Nome
          </label>
          <input
            id={`nome-${page.slug}`}
            name="nome"
            type="text"
            autoComplete="name"
            required
            aria-invalid={!!state.errors?.nome}
            aria-describedby={state.errors?.nome ? `${page.slug}-nome-error` : undefined}
            className={fieldClass}
          />
          {state.errors?.nome && (
            <p id={`${page.slug}-nome-error`} className="text-destructive text-xs">
              {state.errors.nome}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`telefone-${page.slug}`}
            className="label-tech text-muted-foreground"
          >
            Telefone
          </label>
          <input
            id={`telefone-${page.slug}`}
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
              state.errors?.telefone ? `${page.slug}-telefone-error` : undefined
            }
            className={fieldClass}
          />
          {state.errors?.telefone && (
            <p id={`${page.slug}-telefone-error`} className="text-destructive text-xs">
              {state.errors.telefone}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`email-${page.slug}`} className="label-tech text-muted-foreground">
          E-mail
        </label>
        <input
          id={`email-${page.slug}`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          required
          onBlur={(e) => {
            e.target.value = e.target.value.trim().toLowerCase()
          }}
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? `${page.slug}-email-error` : undefined}
          className={fieldClass}
        />
        {state.errors?.email && (
          <p id={`${page.slug}-email-error`} className="text-destructive text-xs">
            {state.errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`mensagem-${page.slug}`}
          className="label-tech text-muted-foreground"
        >
          Descrição da demanda
        </label>
        <textarea
          id={`mensagem-${page.slug}`}
          name="mensagem"
          rows={5}
          required
          placeholder="Ex.: Preciso de um laudo de SPDA para o condomínio onde moro. O atual está vencido e o síndico pediu regularização até o fim do mês."
          aria-invalid={!!state.errors?.mensagem}
          aria-describedby={
            state.errors?.mensagem ? `${page.slug}-mensagem-error` : undefined
          }
          className={`${fieldClass} resize-y`}
        />
        {state.errors?.mensagem && (
          <p id={`${page.slug}-mensagem-error`} className="text-destructive text-xs">
            {state.errors.mensagem}
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-5">
        <SubmitButton label={`Enviar para ${page.title}`} />
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
  )
}
