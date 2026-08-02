import { eq } from 'drizzle-orm'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoMidias } from '@/lib/db/schema'
import { PEDIDO_STORAGE_DIR } from '@/lib/pedido-storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return new NextResponse('Não autenticado', { status: 401 })

  const id = Number((await params).id)
  if (!Number.isInteger(id)) return new NextResponse('Inválido', { status: 400 })

  const [midia] = await db.select().from(pedidoMidias).where(eq(pedidoMidias.id, id))
  if (!midia) return new NextResponse('Não encontrado', { status: 404 })

  try {
    const buffer = await readFile(path.join(PEDIDO_STORAGE_DIR, midia.filename))
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': midia.mimeType,
        'Content-Length': String(midia.tamanhoBytes),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Arquivo ausente no disco', { status: 404 })
  }
}
