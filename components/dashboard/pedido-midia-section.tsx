'use client'

import { CheckSquare, Square, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  classifyMidias,
  deleteMidia,
  getMidiasForPedido,
} from '@/app/actions/pedido-midias'
import { MidiaUploader } from '@/components/dashboard/midia-uploader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { MidiaCategoria, MidiaTipo } from '@/lib/db/schema'

type Midia = {
  id: number
  tipo: MidiaTipo
  categoria: MidiaCategoria | null
  tamanhoBytes: number
}

const CATEGORIA_LABEL: Record<MidiaCategoria, string> = {
  inicio: 'Início de obra',
  meio: 'Meio de obra',
  fim: 'Fim de obra',
}

function MidiaItem({
  midia,
  selected,
  onToggle,
  onDelete,
}: {
  midia: Midia
  selected: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <div className="border-border relative overflow-hidden rounded-md border">
      <button
        type="button"
        onClick={onToggle}
        className="bg-background/80 absolute top-2 left-2 z-10 rounded p-1"
        aria-label={selected ? 'Remover da seleção' : 'Selecionar'}
      >
        {selected ? (
          <CheckSquare className="text-primary h-4 w-4" />
        ) : (
          <Square className="h-4 w-4" />
        )}
      </button>
      <Button
        type="button"
        size="icon-sm"
        variant="destructive"
        onClick={onDelete}
        className="absolute top-2 right-2 z-10"
      >
        <X />
      </Button>
      {midia.tipo === 'imagem' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/pedidos/midia/${midia.id}`}
          alt=""
          className="aspect-square w-full object-cover"
        />
      ) : (
        <video
          src={`/api/pedidos/midia/${midia.id}`}
          controls
          className="aspect-square w-full object-cover"
        />
      )}
      <span className="bg-background/80 absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px]">
        {(midia.tamanhoBytes / 1024).toFixed(0)} KB
      </span>
    </div>
  )
}

function MidiaGrid({
  title,
  items,
  selected,
  onToggle,
  onDelete,
}: {
  title: string
  items: Midia[]
  selected: Set<number>
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="label-tech text-muted-foreground text-xs">{title}</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((m) => (
          <MidiaItem
            key={m.id}
            midia={m}
            selected={selected.has(m.id)}
            onToggle={() => onToggle(m.id)}
            onDelete={() => onDelete(m.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function PedidoMidiaSection({ pedidoId }: { pedidoId: number }) {
  const [midias, setMidias] = useState<Midia[] | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const refresh = useCallback(async () => {
    setMidias(await getMidiasForPedido(pedidoId))
  }, [pedidoId])

  useEffect(() => {
    setMidias(null)
    setSelected(new Set())
    refresh()
  }, [refresh])

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleClassify(categoria: MidiaCategoria) {
    try {
      await classifyMidias([...selected], categoria)
      setSelected(new Set())
      await refresh()
    } catch {
      toast.error('Não foi possível classificar.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMidia(id)
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      await refresh()
    } catch {
      toast.error('Não foi possível apagar.')
    }
  }

  return (
    <div className="flex flex-col gap-5 border-t pt-4">
      <MidiaUploader pedidoId={pedidoId} onUploaded={refresh} />

      {midias === null ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : (
        <>
          {selected.size > 0 && (
            <div className="bg-muted flex flex-wrap items-center gap-2 rounded-md p-2 text-sm">
              <span>{selected.size} selecionado(s)</span>
              <Button size="xs" onClick={() => handleClassify('inicio')}>
                Início
              </Button>
              <Button size="xs" onClick={() => handleClassify('meio')}>
                Meio
              </Button>
              <Button size="xs" onClick={() => handleClassify('fim')}>
                Fim
              </Button>
              <Button size="xs" variant="ghost" onClick={() => setSelected(new Set())}>
                Cancelar
              </Button>
            </div>
          )}

          {midias.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhuma mídia enviada ainda.
            </p>
          )}

          {(() => {
            const semCategoria = midias.filter((m) => !m.categoria)
            return (
              semCategoria.length > 0 && (
                <MidiaGrid
                  title="A classificar"
                  items={semCategoria}
                  selected={selected}
                  onToggle={toggleSelect}
                  onDelete={handleDelete}
                />
              )
            )
          })()}

          {(['inicio', 'meio', 'fim'] as const).map((categoria) => {
            const items = midias.filter((m) => m.categoria === categoria)
            if (items.length === 0) return null
            return (
              <MidiaGrid
                key={categoria}
                title={CATEGORIA_LABEL[categoria]}
                items={items}
                selected={selected}
                onToggle={toggleSelect}
                onDelete={handleDelete}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
