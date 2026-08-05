import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

/**
 * Armazenamento de mídias e documentos de pedidos no Cloudflare R2 (bucket
 * privado). Substitui o antigo diretório persistente `storage/pedidos/`.
 *
 * Configuração exclusivamente server-side (ver `.env.example`); o client é
 * criado lazy para que builds e ambientes sem credenciais não quebrem.
 * As chaves dos objetos são guardadas nas colunas `filename` e
 * `thumbnailFilename` do banco, no formato `pedidos/{uuid}.{ext}`.
 */

type PedidoObject = {
  body: Buffer
  contentType?: string
  contentLength?: number
}

let client: S3Client | undefined

function getConfig() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error('Cloudflare R2 não está configurado.')
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket }
}

function getClient() {
  if (!client) {
    const { endpoint, accessKeyId, secretAccessKey } = getConfig()
    client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    })
  }

  return client
}

function objectKey(filename: string) {
  const key = filename.startsWith('pedidos/') ? filename : `pedidos/${filename}`
  if (key.startsWith('/') || key.includes('..') || key.includes('\\')) {
    throw new Error('Chave de objeto inválida.')
  }
  return key
}

export async function putPedidoObject(
  filename: string,
  body: Uint8Array,
  contentType: string,
) {
  const { bucket } = getConfig()
  const key = objectKey(filename)
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
  return key
}

export async function getPedidoObject(filename: string): Promise<PedidoObject | null> {
  const { bucket } = getConfig()

  try {
    const response = await getClient().send(
      new GetObjectCommand({ Bucket: bucket, Key: objectKey(filename) }),
    )
    if (!response.Body) return null
    return {
      body: Buffer.from(await response.Body.transformToByteArray()),
      contentType: response.ContentType,
      contentLength: response.ContentLength,
    }
  } catch (error) {
    if (error instanceof NoSuchKey || (error instanceof Error && error.name === 'NoSuchKey')) {
      return null
    }
    throw error
  }
}

export async function deletePedidoObject(filename: string) {
  const { bucket } = getConfig()
  await getClient().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: objectKey(filename) }),
  )
}
