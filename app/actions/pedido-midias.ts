'use server'

import { randomUUID } from 'node:crypto'
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoMidias, type MidiaCategoria } from '@/lib/db/schema'
import { compressImage, compressVideo } from '@/lib/media-compress'
import { PEDIDO_STORAGE_DIR as STORAGE_DIR } from '@/lib/pedido-storage'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Não autenticado.')
  return session
}

export async function getMidiasForPedido(pedidoId: number) {
  await requireSession()
  return db
    .select()
    .from(pedidoMidias)
    .where(eq(pedidoMidias.pedidoId, pedidoId))
    .orderBy(pedidoMidias.createdAt)
}

export async function uploadMidias(pedidoId: number, formData: FormData) {
  await requireSession()
  await mkdir(STORAGE_DIR, { recursive: true })

  const files = formData.getAll('files').filter((f): f is File => f instanceof File)

  for (const file of files) {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) continue

    const originalBytes = file.size
    const buffer = Buffer.from(await file.arrayBuffer())
    const id = randomUUID()

    if (isImage) {
      const { buffer: compressed, ext, mimeType } = await compressImage(
        buffer,
        originalBytes,
      )
      const filename = `${id}.${ext}`
      await writeFile(path.join(STORAGE_DIR, filename), compressed)
      await db.insert(pedidoMidias).values({
        pedidoId,
        tipo: 'imagem',
        filename,
        mimeType,
        tamanhoBytes: compressed.length,
      })
    } else {
      const tempPath = path.join(STORAGE_DIR, `${id}.tmp`)
      const filename = `${id}.mp4`
      await writeFile(tempPath, buffer)
      try {
        await compressVideo(tempPath, path.join(STORAGE_DIR, filename), originalBytes)
      } finally {
        await unlink(tempPath).catch(() => {})
      }
      const { size } = await stat(path.join(STORAGE_DIR, filename))
      await db.insert(pedidoMidias).values({
        pedidoId,
        tipo: 'video',
        filename,
        mimeType: 'video/mp4',
        tamanhoBytes: size,
      })
    }
  }

  revalidatePath('/dashboard')
}

export async function classifyMidias(ids: number[], categoria: MidiaCategoria) {
  await requireSession()
  if (ids.length === 0) return
  await db.update(pedidoMidias).set({ categoria }).where(inArray(pedidoMidias.id, ids))
  revalidatePath('/dashboard')
}

export async function deleteMidia(id: number) {
  await requireSession()
  const [midia] = await db.select().from(pedidoMidias).where(eq(pedidoMidias.id, id))
  if (!midia) return

  await db.delete(pedidoMidias).where(eq(pedidoMidias.id, id))
  await unlink(path.join(STORAGE_DIR, midia.filename)).catch(() => {})
  revalidatePath('/dashboard')
}
