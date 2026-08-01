import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { OrganizationSchema } from '@/components/seo/organization-schema'
import { SITE_URL } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AS Serviços · Engenharia e Tecnologia sob o mesmo teto',
  description:
    'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software. Projetos, laudos, automação e sistemas sob encomenda com precificação transparente.',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AS Serviços · Do projeto à entrega',
    description:
      'Engenharia multidisciplinar e desenvolvimento de software sob o mesmo teto.',
    url: '/',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`bg-background ${inter.variable} ${grotesk.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <OrganizationSchema />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
