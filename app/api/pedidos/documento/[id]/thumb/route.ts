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
  if (!doc?.thumbnailFilename) return new NextResponse('Sem miniatura', { status: 404 })

  const object = await getPedidoObject(doc.thumbnailFilename)
  if (!object) return new NextResponse('Arquivo ausente no storage', { status: 404 })

  return new NextResponse(object.body, {
    headers: {
      'Content-Type': 'image/webp',
      'Content-Length': String(object.contentLength ?? object.body.length),
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
