'use server'

import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidos, PEDIDO_STATUS, type PedidoStatus } from '@/lib/db/schema'

export async function updatePedidoStatus(id: number, status: PedidoStatus) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Não autenticado.')
  if (!PEDIDO_STATUS.includes(status)) throw new Error('Status inválido.')

  await db.update(pedidos).set({ status }).where(eq(pedidos.id, id))
  revalidatePath('/dashboard')
}
