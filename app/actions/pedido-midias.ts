'use server'

import { randomUUID } from 'node:crypto'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pedidoMidias, type MidiaCategoria } from '@/lib/db/schema'
import { compressImage, compressVideo } from '@/lib/media-compress'
import { deletePedidoObject, putPedidoObject } from '@/lib/pedido-storage'

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
      const key = await putPedidoObject(filename, compressed, mimeType)
      try {
        await db.insert(pedidoMidias).values({
          pedidoId,
          tipo: 'imagem',
          filename: key,
          mimeType,
          tamanhoBytes: compressed.length,
        })
      } catch (error) {
        await deletePedidoObject(key).catch((cleanupError) => {
          console.error('Falha ao limpar objeto R2 após erro no banco:', cleanupError)
        })
        throw error
      }
    } else {
      const tempDir = await mkdtemp(path.join(tmpdir(), 'asservicos-media-'))
      const inputPath = path.join(tempDir, `${id}.input`)
      const outputPath = path.join(tempDir, `${id}.mp4`)
      try {
        await writeFile(inputPath, buffer)
        await compressVideo(inputPath, outputPath, originalBytes)
        const compressed = await readFile(outputPath)
        const key = await putPedidoObject(`${id}.mp4`, compressed, 'video/mp4')
        try {
          await db.insert(pedidoMidias).values({
            pedidoId,
            tipo: 'video',
            filename: key,
            mimeType: 'video/mp4',
            tamanhoBytes: compressed.length,
          })
        } catch (error) {
          await deletePedidoObject(key).catch((cleanupError) => {
            console.error('Falha ao limpar objeto R2 após erro no banco:', cleanupError)
          })
          throw error
        }
      } finally {
        await rm(tempDir, { recursive: true, force: true })
      }
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
  await deletePedidoObject(midia.filename).catch((error) => {
    console.error('Falha ao limpar objeto R2:', error)
  })
  revalidatePath('/dashboard')
}
