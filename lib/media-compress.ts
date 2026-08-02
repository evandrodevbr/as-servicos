import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import ffmpegPath from 'ffmpeg-static'
import ffprobeStatic from 'ffprobe-static'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)

const MAX_IMAGE_BYTES = 200 * 1024
const MAX_VIDEO_KBPS = 1000
const MIN_VIDEO_KBPS = 200
const QUALITY_STEPS = [80, 65, 50, 35, 20]

/**
 * Alvo final = o menor entre o teto fixo e 50% do tamanho/bitrate
 * original — na prática, fotos e vídeos de celular estão tão acima desses
 * tetos que o teto fixo quase sempre manda; os 50% garantem que um arquivo
 * já pequeno também passe por alguma compressão, nunca é só copiado.
 */
export async function compressImage(
  input: Buffer,
  originalBytes: number,
): Promise<{ buffer: Buffer; ext: 'webp'; mimeType: 'image/webp' }> {
  const targetBytes = Math.min(MAX_IMAGE_BYTES, Math.round(originalBytes * 0.5))
  const meta = await sharp(input).metadata()
  let width = meta.width
  let best: Buffer | null = null

  outer: for (let pass = 0; pass < 4; pass++) {
    for (const quality of QUALITY_STEPS) {
      best = await sharp(input).rotate().resize(width).webp({ quality }).toBuffer()
      if (best.length <= targetBytes) break outer
    }
    width = Math.round((width ?? 1600) * 0.75)
  }

  return { buffer: best!, ext: 'webp', mimeType: 'image/webp' }
}

export async function compressVideo(
  inputPath: string,
  outputPath: string,
  originalBytes: number,
): Promise<void> {
  const durationSeconds = await probeDurationSeconds(inputPath)
  const originalKbps =
    durationSeconds > 0
      ? Math.round((originalBytes * 8) / durationSeconds / 1000)
      : MAX_VIDEO_KBPS
  const targetKbps = Math.max(
    MIN_VIDEO_KBPS,
    Math.min(MAX_VIDEO_KBPS, Math.round(originalKbps * 0.5)),
  )

  await execFileAsync(ffmpegPath as string, [
    '-y',
    '-i',
    inputPath,
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-b:v',
    `${targetKbps}k`,
    '-maxrate',
    `${targetKbps}k`,
    '-bufsize',
    `${targetKbps * 2}k`,
    '-c:a',
    'aac',
    '-b:a',
    '96k',
    outputPath,
  ])
}

async function probeDurationSeconds(inputPath: string): Promise<number> {
  const { stdout } = await execFileAsync(ffprobeStatic.path, [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    inputPath,
  ])
  const seconds = parseFloat(stdout.trim())
  return Number.isFinite(seconds) ? seconds : 0
}
