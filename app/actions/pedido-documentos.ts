'use server'

import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoDocumentos } from '@/lib/db/schema'
import { generatePdfThumbnail } from '@/lib/document-preview'
import { PEDIDO_STORAGE_DIR as STORAGE_DIR } from '@/lib/pedido-storage'

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
  await mkdir(STORAGE_DIR, { recursive: true })

  const files = formData.getAll('files').filter((f): f is File => f instanceof File)

  for (const file of files) {
    const ext = ALLOWED_EXT[file.type]
    if (!ext) {
      throw new Error(`Tipo de arquivo não suportado: ${file.name}`)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = randomUUID()
    const filename = `${id}.${ext}`
    await writeFile(path.join(STORAGE_DIR, filename), buffer)

    let thumbnailFilename: string | null = null
    if (file.type === 'application/pdf') {
      try {
        const thumb = await generatePdfThumbnail(buffer)
        thumbnailFilename = `${id}-thumb.webp`
        await writeFile(path.join(STORAGE_DIR, thumbnailFilename), thumb)
      } catch (err) {
        console.error('Falha ao gerar miniatura de PDF:', err)
      }
    }

    await db.insert(pedidoDocumentos).values({
      pedidoId,
      filename,
      originalName: file.name,
      mimeType: file.type,
      tamanhoBytes: buffer.length,
      thumbnailFilename,
    })
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
  await unlink(path.join(STORAGE_DIR, doc.filename)).catch(() => {})
  if (doc.thumbnailFilename) {
    await unlink(path.join(STORAGE_DIR, doc.thumbnailFilename)).catch(() => {})
  }
  revalidatePath('/dashboard')
}
