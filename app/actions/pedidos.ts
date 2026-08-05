'use server'

import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidos, PEDIDO_STATUS, type PedidoStatus } from '@/lib/db/schema'
import { CONTACT_AREAS } from '@/lib/site-data'

export async function updatePedidoStatus(id: number, status: PedidoStatus) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Não autenticado.')
  if (!PEDIDO_STATUS.includes(status)) throw new Error('Status inválido.')

  await db.update(pedidos).set({ status }).where(eq(pedidos.id, id))
  revalidatePath('/dashboard')
}

export type NovoPedidoState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors?: Partial<Record<'nome' | 'email' | 'telefone' | 'area' | 'mensagem', string>>
}

/** Cria um pedido manualmente a partir do painel — validações idênticas ao
 * formulário das páginas de serviço (`app/actions/servico-contact.ts`),
 * incluindo o fluxo de `codigo` (placeholder único → `AS-{id}`). Sem
 * notificação push: quem criou é o próprio admin. */
export async function createPedido(
  _prev: NovoPedidoState,
  formData: FormData,
): Promise<NovoPedidoState> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Não autenticado.')

  const nome = String(formData.get('nome') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const area = String(formData.get('area') ?? '').trim()
  const mensagem = String(formData.get('mensagem') ?? '').trim()

  const errors: NovoPedidoState['errors'] = {}
  if (nome.length < 2) errors.nome = 'Informe o nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'E-mail inválido.'
  if (telefone.replace(/\D/g, '').length < 10)
    errors.telefone = 'Informe um telefone com DDD.'
  if (!(CONTACT_AREAS as readonly string[]).includes(area))
    errors.area = 'Selecione uma área.'
  if (mensagem.length < 10)
    errors.mensagem = 'Descreva a demanda (mín. 10 caracteres).'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Revise os campos destacados antes de criar.',
      errors,
    }
  }

  const placeholder = `PENDING-${crypto.randomUUID()}`
  const [inserted] = await db
    .insert(pedidos)
    .values({
      codigo: placeholder,
      nome,
      email,
      telefone,
      area,
      mensagem,
      origem: 'dashboard',
    })
    .returning({ id: pedidos.id })

  const codigo = `AS-${inserted.id}`
  await db.update(pedidos).set({ codigo }).where(eq(pedidos.id, inserted.id))
  revalidatePath('/dashboard')

  return { status: 'success', message: `Pedido ${codigo} criado.` }
}
