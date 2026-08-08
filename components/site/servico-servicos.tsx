import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { PORTFOLIO, type ServicoPage } from '@/lib/site-data'

/**
 * Lista de serviços da página. Linhas com borda superior e marcador na cor
 * da área — mesma gramática das áreas na home, sem cards aninhados.
 */
export function ServicoServicos({ page }: { page: ServicoPage }) {
 const isTech = page.themeId === 'tech'

 return (
  <section id="servicos" aria-labelledby="servicos-title" className="relative">
   <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
    <Reveal
     className="border-border bg-background/55 backdrop-blur-sm border-t py-24 sm:py-32"
     stagger
     threshold={0.01}
    >
     {isTech && (
      <p className="label-tech text-muted-foreground mb-3">
       Entregas de tecnologia
      </p>
     )}
     <h2
      id="servicos-title"
      className="font-display max-w-3xl text-balance text-2xl leading-[1.1] font-bold tracking-[-0.02em] sm:text-4xl"
     >
      O que entregamos em {page.title}.
     </h2>
     <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed">
      Cada serviço começa por uma descrição da demanda e termina com
      documentação técnica — projeto, laudo ou registro de entrega.
     </p>

     <div className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
      {page.services.map((service, index) => (
       <article key={service.titulo} className="border-border border-t pt-6">
        {isTech && (
         <p className="label-tech text-primary mb-3 font-semibold">
          Entrega {String(index + 1).padStart(2, '0')}
         </p>
        )}
        <h3 className="font-display text-xl font-bold tracking-[-0.01em]">
         {service.titulo}
        </h3>
        <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
         {service.texto}
        </p>
       </article>
      ))}
     </div>

     {PORTFOLIO.filter((p) => page.areaIds.includes(p.areaId)).length > 0 && (
      <div className="mt-20">
       <h3 className="label-tech text-primary">
        Entregas reais desta área
       </h3>
       <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {PORTFOLIO.filter((p) => page.areaIds.includes(p.areaId)).map(
         (item) => (
          <article
           key={item.id}
           className="border-border bg-background/60 border p-6"
          >
           <div className="relative aspect-video overflow-hidden">
            <Image
             src={item.image}
             alt={item.imageAlt}
             fill
             loading={item.id === 'sc-plus' ? 'eager' : 'lazy'}
             sizes="(min-width: 640px) 50vw, 100vw"
             className="object-cover object-top grayscale-[35%]"
            />
           </div>
           <div className="mt-5">
            <p className="label-tech text-muted-foreground">
             {item.local} · {item.ano}
            </p>
            <h4 className="font-display mt-1 text-lg font-bold">
             {item.title}
            </h4>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
             {item.description}
            </p>
            {item.href && (
             <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label-tech text-primary mt-4 inline-flex transition-opacity hover:opacity-70"
             >
              Abrir projeto ↗
             </a>
            )}
           </div>
          </article>
         ),
        )}
       </div>
      </div>
     )}

     {page.externalProof &&
      (isTech ? (
       <a
        href={page.externalProof.href}
        target="_blank"
        rel="noopener noreferrer"
        className="term group mt-16 block max-w-xl transition-opacity hover:opacity-85"
       >
        <div className="term__bar">
         <span className="term__dots" aria-hidden="true">
          <span className="term__dot term__dot--primary" />
          <span className="term__dot" />
          <span className="term__dot" />
         </span>
         <span>{page.externalProof.label}</span>
         <span aria-hidden="true">↗</span>
        </div>
        <div className="term__body">
         <p>
          <span className="term__cmd" aria-hidden="true">
           ${' '}
          </span>
          abrir {page.externalProof.title}
         </p>
         <p className="text-muted-foreground mt-1">
          {page.externalProof.meta}
         </p>
         <p aria-hidden="true" className="term__cursor mt-1" />
        </div>
       </a>
      ) : (
       <a
        href={page.externalProof.href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border group mt-16 flex max-w-xl items-center gap-4 border-t pt-8 transition-opacity hover:opacity-80"
       >
        <span className="bg-primary inline-block h-14 w-1 shrink-0" aria-hidden="true" />
        <span className="flex flex-col gap-1">
         <span className="label-tech text-primary">
          {page.externalProof.label}
         </span>
         <span className="text-foreground text-sm leading-tight font-medium">
          {page.externalProof.title}
         </span>
         <span className="label-tech text-muted-foreground">
          {page.externalProof.meta}
         </span>
        </span>
       </a>
      ))}
    </Reveal>
   </div>
  </section>
 )
}
