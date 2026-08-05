'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { createPedido, type NovoPedidoState } from '@/app/actions/pedidos'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatBrazilianPhone } from '@/lib/format-phone'
import { CONTACT_AREAS } from '@/lib/site-data'

const initialState: NovoPedidoState = { status: 'idle', message: '' }

const fieldClass =
  'w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Criando…' : 'Criar pedido'}
    </Button>
  )
}

export function NovoPedidoDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [state, formAction] = useActionState(createPedido, initialState)

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message)
      setFormKey((k) => k + 1)
      setOpen(false)
      router.refresh()
    } else if (state.status === 'error') {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Novo pedido
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo pedido</DialogTitle>
          <DialogDescription>
            Registra um pedido internamente, sem passar pelo formulário do site.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={formAction} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="novo-nome">Nome</Label>
              <Input
                id="novo-nome"
                name="nome"
                type="text"
                autoComplete="name"
                required
                aria-invalid={!!state.errors?.nome}
                aria-describedby={state.errors?.nome ? 'novo-nome-error' : undefined}
              />
              {state.errors?.nome && (
                <p id="novo-nome-error" className="text-destructive text-xs">
                  {state.errors.nome}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="novo-telefone">Telefone</Label>
              <Input
                id="novo-telefone"
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
                  state.errors?.telefone ? 'novo-telefone-error' : undefined
                }
              />
              {state.errors?.telefone && (
                <p id="novo-telefone-error" className="text-destructive text-xs">
                  {state.errors.telefone}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="novo-email">E-mail</Label>
            <Input
              id="novo-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="cliente@exemplo.com"
              required
              aria-invalid={!!state.errors?.email}
              aria-describedby={state.errors?.email ? 'novo-email-error' : undefined}
            />
            {state.errors?.email && (
              <p id="novo-email-error" className="text-destructive text-xs">
                {state.errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="novo-area">Área</Label>
            <select
              id="novo-area"
              name="area"
              defaultValue=""
              required
              aria-invalid={!!state.errors?.area}
              aria-describedby={state.errors?.area ? 'novo-area-error' : undefined}
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
              <p id="novo-area-error" className="text-destructive text-xs">
                {state.errors.area}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="novo-mensagem">Descrição da demanda</Label>
            <textarea
              id="novo-mensagem"
              name="mensagem"
              rows={4}
              required
              placeholder="Ex.: Laudo de SPDA vencido; condomínio precisa regularizar."
              aria-invalid={!!state.errors?.mensagem}
              aria-describedby={
                state.errors?.mensagem ? 'novo-mensagem-error' : undefined
              }
              className={`${fieldClass} resize-y py-2`}
            />
            {state.errors?.mensagem && (
              <p id="novo-mensagem-error" className="text-destructive text-xs">
                {state.errors.mensagem}
              </p>
            )}
          </div>

          <div className="mt-2 flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
