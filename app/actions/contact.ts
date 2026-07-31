'use server'

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

  // Envio simulado — integrar com e-mail/CRM quando o serviço estiver definido.
  await new Promise((r) => setTimeout(r, 900))
  console.log('[v0] Nova solicitação de contato:', { nome, email, telefone, area })

  return {
    status: 'success',
    message: `Recebemos sua mensagem, ${nome.split(' ')[0]}. Retornamos em até 1 dia útil.`,
  }
}
