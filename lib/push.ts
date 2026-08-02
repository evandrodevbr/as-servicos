import { eq } from 'drizzle-orm'
import webpush from 'web-push'
import { db } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'
import { SITE_URL } from '@/lib/site-config'

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(`${SITE_URL}`, vapidPublicKey, vapidPrivateKey)
}

export type PushPayload = {
  title: string
  body: string
  url: string
}

/**
 * Notifica todos os administradores inscritos. Assinaturas que voltarem
 * expiradas (404/410 — navegador desativou ou desinstalou) são removidas do
 * banco automaticamente. Nunca lança: falha de push não deve derrubar o
 * fluxo que a chamou (ex.: envio do formulário de contato).
 */
export async function sendPushToAdmins(payload: PushPayload) {
  if (!vapidPublicKey || !vapidPrivateKey) return

  const subscriptions = await db.select().from(pushSubscriptions)
  const body = JSON.stringify(payload)

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
        )
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode
        if (statusCode === 404 || statusCode === 410) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id))
        } else {
          console.error('Falha ao enviar push:', err)
        }
      }
    }),
  )
}
