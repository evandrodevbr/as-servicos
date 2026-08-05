'use server'

import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoDocumentos } from '@/lib/db/schema'
import { generatePdfThumbnail } from '@/lib/document-preview'
import { deletePedidoObject, putPedidoObject } from '@/lib/pedido-storage'

const ALLOWED_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Não autenticado.')
  return session
}

export async function getDocumentosForPedido(pedidoId: number) {
  await requireSession()
  return db
    .select()
    .from(pedidoDocumentos)
    .where(eq(pedidoDocumentos.pedidoId, pedidoId))
    .orderBy(pedidoDocumentos.createdAt)
}

export async function uploadDocumentos(pedidoId: number, formData: FormData) {
  await requireSession()

  const files = formData.getAll('files').filter((f): f is File => f instanceof File)

  for (const file of files) {
    const ext = ALLOWED_EXT[file.type]
    if (!ext) {
      throw new Error(`Tipo de arquivo não suportado: ${file.name}`)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = randomUUID()
    const filename = `${id}.${ext}`
    const key = await putPedidoObject(filename, buffer, file.type)

    let thumbnailFilename: string | null = null
    let thumbnailKey: string | null = null
    try {
      if (file.type === 'application/pdf') {
        try {
          const thumb = await generatePdfThumbnail(buffer)
          thumbnailFilename = `${id}-thumb.webp`
          thumbnailKey = await putPedidoObject(thumbnailFilename, thumb, 'image/webp')
        } catch (err) {
          console.error('Falha ao gerar miniatura de PDF:', err)
        }
      }

      await db.insert(pedidoDocumentos).values({
        pedidoId,
        filename: key,
        originalName: file.name,
        mimeType: file.type,
        tamanhoBytes: buffer.length,
        thumbnailFilename: thumbnailKey,
      })
    } catch (error) {
      await deletePedidoObject(key).catch((cleanupError) => {
        console.error('Falha ao limpar objeto R2 após erro no banco:', cleanupError)
      })
      if (thumbnailKey) {
        await deletePedidoObject(thumbnailKey).catch((cleanupError) => {
          console.error('Falha ao limpar miniatura R2 após erro no banco:', cleanupError)
        })
      }
      throw error
    }
  }

  revalidatePath('/dashboard')
}

export async function deleteDocumento(id: number) {
  await requireSession()
  const [doc] = await db
    .select()
    .from(pedidoDocumentos)
    .where(eq(pedidoDocumentos.id, id))
  if (!doc) return

  await db.delete(pedidoDocumentos).where(eq(pedidoDocumentos.id, id))
  await deletePedidoObject(doc.filename).catch((error) => {
    console.error('Falha ao limpar objeto R2:', error)
  })
  if (doc.thumbnailFilename) {
    await deletePedidoObject(doc.thumbnailFilename).catch((error) => {
      console.error('Falha ao limpar miniatura R2:', error)
    })
  }
  revalidatePath('/dashboard')
}
