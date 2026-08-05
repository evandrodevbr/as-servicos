'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pedidos } from '@/lib/db/schema'
import { sendPushToAdmins } from '@/lib/push'
import { SERVICOS_PAGES } from '@/lib/site-data'

export type ServicoContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors?: Partial<Record<'nome' | 'email' | 'telefone' | 'mensagem', string>>
}

/**
 * Contato feito pelo formulário da página de serviço. A área é fixa da
 * página (sem select) e o pedido chega ao dashboard com a tag de origem
 * `servicos/{slug}` — o painel mostra "Página de {área}".
 */
export async function submitServicoContact(
  slug: string,
  _prev: ServicoContactState,
  formData: FormData,
): Promise<ServicoContactState> {
  const page = SERVICOS_PAGES.find((p) => p.slug === slug)
  if (!page) return { status: 'error', message: 'Página inválida.' }

  const nome = String(formData.get('nome') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const mensagem = String(formData.get('mensagem') ?? '').trim()

  const errors: ServicoContactState['errors'] = {}
  if (nome.length < 2) errors.nome = 'Informe seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'E-mail inválido.'
  if (telefone.replace(/\D/g, '').length < 10)
    errors.telefone = 'Informe um telefone com DDD.'
  if (mensagem.length < 10)
    errors.mensagem = 'Descreva sua demanda (mín. 10 caracteres).'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Revise os campos destacados antes de enviar.',
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
      area: page.title,
      mensagem,
      origem: `servicos/${page.slug}`,
    })
    .returning({ id: pedidos.id })

  const codigo = `AS-${inserted.id}`
  await db.update(pedidos).set({ codigo }).where(eq(pedidos.id, inserted.id))

  try {
    await sendPushToAdmins({
      title: `Novo pedido: ${codigo}`,
      body: `${nome} · ${page.title}`,
      url: '/dashboard',
    })
  } catch (err) {
    console.error('Falha ao enviar notificação push:', err)
  }

  return {
    status: 'success',
    message: `Recebemos sua mensagem, ${nome.split(' ')[0]}. Seu código de acompanhamento é ${codigo}. Retornamos em até 1 dia útil.`,
  }
}
