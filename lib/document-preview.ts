import { createCanvas } from '@napi-rs/canvas'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const THUMBNAIL_WIDTH = 400

/** Renderiza a 1ª página de um PDF como imagem WebP, pra usar como miniatura. */
export async function generatePdfThumbnail(buffer: Buffer): Promise<Buffer> {
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise
  const page = await doc.getPage(1)

  const baseViewport = page.getViewport({ scale: 1 })
  const scale = THUMBNAIL_WIDTH / baseViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height))
  const context = canvas.getContext('2d')

  /**
   * `@napi-rs/canvas` é um polyfill de `CanvasRenderingContext2D` pro Node,
   * de propósito incompleto (omite APIs só de navegador, tipo
   * `drawFocusIfNeeded`) — é exatamente o que o próprio pdfjs-dist usa
   * internamente em Node (`NodeCanvasFactory`), só que ali sem checagem de
   * tipo. O cast documenta essa incompatibilidade estrutural conhecida.
   */
  await page.render({
    canvas: null,
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise

  return canvas.toBuffer('image/webp')
}
