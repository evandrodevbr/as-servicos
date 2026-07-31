import { Experience } from '@/components/site/experience'
import { SiteNav } from '@/components/site/site-nav'
import { Hero } from '@/components/site/hero'
import { Areas } from '@/components/site/areas'
import { Portfolio } from '@/components/site/portfolio'
import { Method } from '@/components/site/method'
import { Contact } from '@/components/site/contact'
import { SiteFooter } from '@/components/site/site-footer'

export default function Page() {
  return (
    <Experience>
      <SiteNav />
      <main id="conteudo">
        <Hero />
        <Areas />
        <Portfolio />
        <Method />
        <Contact />
      </main>
      <SiteFooter />
    </Experience>
  )
}
