import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter, Space_Grotesk } from 'next/font/google'
import { OrganizationSchema } from '@/components/seo/organization-schema'
import { Toaster } from '@/components/ui/sonner'
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

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AS Serviços · Engenharia e Tecnologia sob o mesmo teto',
  description:
    'Engenharia civil, elétrica, eletrônica/automação e desenvolvimento de software. Projetos, laudos, automação e sistemas sob encomenda com precificação transparente.',
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
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'AS Serviços — engenharia e tecnologia sob o mesmo teto' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AS Serviços · Do projeto à entrega',
    description:
      'Engenharia multidisciplinar e desenvolvimento de software sob o mesmo teto.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#04192e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`bg-background ${inter.variable} ${grotesk.variable} ${geistMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <a
          href="#conteudo"
          className="label-tech sr-only focus:not-sr-only focus:bg-primary focus:text-primary-foreground focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>
        <OrganizationSchema />
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
