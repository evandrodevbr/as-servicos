'use client'

import { Bell, BellOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { subscribeToPush, unsubscribeFromPush } from '@/app/actions/push-subscription'
import { Button } from '@/components/ui/button'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64Safe)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export function PushToggle() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setSupported(true)

    navigator.serviceWorker.register('/sw.js').then(async (registration) => {
      const existing = await registration.pushManager.getSubscription()
      setSubscribed(!!existing)
    })
  }, [])

  async function enable() {
    if (!VAPID_PUBLIC_KEY) {
      toast.error('Notificações não configuradas neste ambiente.')
      return
    }
    setPending(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        toast.error('Permissão de notificação negada.')
        return
      }
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
      const keys = subscription.toJSON().keys
      if (!keys?.p256dh || !keys.auth) throw new Error('Assinatura sem chaves.')
      await subscribeToPush({
        endpoint: subscription.endpoint,
        keys: { p256dh: keys.p256dh, auth: keys.auth },
      })
      setSubscribed(true)
      toast.success('Notificações ativadas neste navegador.')
    } catch {
      toast.error('Não foi possível ativar as notificações.')
    } finally {
      setPending(false)
    }
  }

  async function disable() {
    setPending(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await unsubscribeFromPush(subscription.endpoint)
        await subscription.unsubscribe()
      }
      setSubscribed(false)
      toast.success('Notificações desativadas neste navegador.')
    } catch {
      toast.error('Não foi possível desativar as notificações.')
    } finally {
      setPending(false)
    }
  }

  if (!supported) return null

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={subscribed ? disable : enable}
    >
      {subscribed ? (
        <>
          <Bell className="text-primary" /> Notificações ativas
        </>
      ) : (
        <>
          <BellOff /> Ativar notificações
        </>
      )}
    </Button>
  )
}
