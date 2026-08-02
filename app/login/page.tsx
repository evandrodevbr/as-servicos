import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/dashboard/login-form'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <div className="flex min-h-svh items-center justify-center p-5">
      <LoginForm />
    </div>
  )
}
