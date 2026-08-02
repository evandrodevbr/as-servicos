'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { pedidos } from '@/lib/db/schema'
import { sendPushToAdmins } from '@/lib/push'
import { CONTACT_AREAS } from '@/lib/site-data'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors?: Partial<Record<'nome' | 'email' | 'telefone' | 'area' | 'mensagem', string>>
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const nome = String(formData.get('nome') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const telefone = String(formData.get('telefone') ?? '').trim()
  const area = String(formData.get('area') ?? '').trim()
  const mensagem = String(formData.get('mensagem') ?? '').trim()

  const errors: ContactState['errors'] = {}
  if (nome.length < 2) errors.nome = 'Informe seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'E-mail inválido.'
  if (telefone.replace(/\D/g, '').length < 10)
    errors.telefone = 'Informe um telefone com DDD.'
  if (!(CONTACT_AREAS as readonly string[]).includes(area))
    errors.area = 'Selecione uma área.'
  if (mensagem.length < 10)
    errors.mensagem = 'Descreva sua demanda (mín. 10 caracteres).'

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Revise os campos destacados antes de enviar.',
      errors,
    }
  }

  // `codigo` definitivo vem do autoincrement do SQLite (sem contador à parte,
  // que seria fonte de corrida entre solicitações concorrentes): insere com
  // um placeholder único, recupera o `id` gerado e atualiza pro valor final.
  const placeholder = `PENDING-${crypto.randomUUID()}`
  const [inserted] = await db
    .insert(pedidos)
    .values({ codigo: placeholder, nome, email, telefone, area, mensagem })
    .returning({ id: pedidos.id })

  const codigo = `AS-${inserted.id}`
  await db.update(pedidos).set({ codigo }).where(eq(pedidos.id, inserted.id))

  try {
    await sendPushToAdmins({
      title: `Novo pedido: ${codigo}`,
      body: `${nome} · ${area}`,
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
