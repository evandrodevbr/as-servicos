import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoDocumentos } from '@/lib/db/schema'
import { getPedidoObject } from '@/lib/pedido-storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return new NextResponse('Não autenticado', { status: 401 })

  const id = Number((await params).id)
  if (!Number.isInteger(id)) return new NextResponse('Inválido', { status: 400 })

  const [doc] = await db
    .select()
    .from(pedidoDocumentos)
    .where(eq(pedidoDocumentos.id, id))
  if (!doc) return new NextResponse('Não encontrado', { status: 404 })

  const object = await getPedidoObject(doc.filename)
  if (!object) return new NextResponse('Arquivo ausente no storage', { status: 404 })

  return new NextResponse(object.body, {
    headers: {
      'Content-Type': object.contentType ?? doc.mimeType,
      'Content-Length': String(object.contentLength ?? doc.tamanhoBytes),
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
