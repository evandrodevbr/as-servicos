'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updatePedidoStatus } from '@/app/actions/pedidos'
import { PedidoDocumentoSection } from '@/components/dashboard/pedido-documento-section'
import { PedidoMidiaSection } from '@/components/dashboard/pedido-midia-section'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PEDIDO_STATUS, type PedidoStatus } from '@/lib/db/schema'
import { SERVICOS_PAGES } from '@/lib/site-data'

export type Pedido = {
  id: number
  codigo: string
  nome: string
  email: string
  telefone: string
  area: string
  mensagem: string
  origem: string
  status: PedidoStatus
  createdAt: Date
}

/** Rótulo da tag de origem exibida no painel. */
export function origemLabel(origem: string): string | null {
  if (origem === 'site' || origem === 'dashboard') return null
  const page = SERVICOS_PAGES.find((p) => p.slug === origem.replace('servicos/', ''))
  return page ? `Página: ${page.title}` : origem
}

const STATUS_LABEL: Record<PedidoStatus, string> = {
  novo: 'Novo',
  em_andamento: 'Em andamento',
  respondido: 'Respondido',
  arquivado: 'Arquivado',
}

const STATUS_VARIANT: Record<PedidoStatus, 'default' | 'secondary' | 'outline'> = {
  novo: 'default',
  em_andamento: 'secondary',
  respondido: 'outline',
  arquivado: 'outline',
}

/**
 * Badge clicável como trigger do menu, em vez do `Select` — o `Select`
 * tinha um badge encaixado dentro do próprio slot de valor, e os dois
 * conjuntos de padding/borda brigavam visualmente. Um botão simples
 * envolvendo o badge evita esse conflito.
 */
function StatusChanger({ pedido }: { pedido: Pedido }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleSelect(status: PedidoStatus) {
    if (status === pedido.status || pending) return
    startTransition(async () => {
      try {
        await updatePedidoStatus(pedido.id, status)
        router.refresh()
      } catch {
        toast.error('Não foi possível atualizar o status.')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        className="cursor-pointer rounded-full outline-none disabled:cursor-wait disabled:opacity-60"
        onClick={(e) => e.stopPropagation()}
      >
        <Badge variant={STATUS_VARIANT[pedido.status]}>
          {STATUS_LABEL[pedido.status]}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {PEDIDO_STATUS.map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleSelect(s)}>
            {STATUS_LABEL[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PedidoDetailDialog({
  pedido,
  onOpenChange,
}: {
  pedido: Pedido | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={!!pedido} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {pedido && (
          <>
            <DialogHeader>
              <DialogTitle>{pedido.codigo}</DialogTitle>
              <DialogDescription>
                Recebido em{' '}
                {format(pedido.createdAt, "d 'de' MMMM 'de' yyyy, HH:mm", {
                  locale: ptBR,
                })}
              </DialogDescription>
            </DialogHeader>

            <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="col-span-2">{pedido.nome}</dd>

              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="col-span-2 break-all">{pedido.email}</dd>

              <dt className="text-muted-foreground">Telefone</dt>
              <dd className="col-span-2">{pedido.telefone}</dd>

              <dt className="text-muted-foreground">Área</dt>
              <dd className="col-span-2">{pedido.area}</dd>

              {origemLabel(pedido.origem) && (
                <>
                  <dt className="text-muted-foreground">Origem</dt>
                  <dd className="col-span-2">
                    <Badge variant="outline">{origemLabel(pedido.origem)}</Badge>
                  </dd>
                </>
              )}

              <dt className="text-muted-foreground">Status</dt>
              <dd className="col-span-2">
                <StatusChanger pedido={pedido} />
              </dd>
            </dl>

            <div className="flex flex-col gap-2 border-t pt-3">
              <span className="text-muted-foreground text-sm">
                Descrição da demanda
              </span>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {pedido.mensagem}
              </p>
            </div>

            <PedidoMidiaSection pedidoId={pedido.id} />
            <PedidoDocumentoSection pedidoId={pedido.id} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Só as colunas essenciais pra escanear a lista — contato e mensagem
 * completos já ficam disponíveis no modal ao clicar na linha (v.
 * `PedidoDetailDialog`). Colunas a mais aqui é o que forçava o scroll
 * horizontal da tabela.
 */
const columns: ColumnDef<Pedido>[] = [
  { accessorKey: 'codigo', header: 'Código' },
  {
    accessorKey: 'nome',
    header: 'Nome',
    cell: ({ row }) => <span className="line-clamp-1">{row.original.nome}</span>,
  },
  {
    accessorKey: 'area',
    header: 'Área',
    cell: ({ row }) => {
      const tag = origemLabel(row.original.origem)
      return (
        <span className="flex flex-col gap-1">
          <span className="line-clamp-1">{row.original.area}</span>
          {tag && (
            <Badge variant="outline" className="w-fit">
              {tag}
            </Badge>
          )}
        </span>
      )
    },
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusChanger pedido={row.original} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Recebido em',
    cell: ({ row }) =>
      format(row.original.createdAt, "d 'de' MMM, HH:mm", { locale: ptBR }),
  },
]

export function PedidosTable({ data }: { data: Pedido[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [selected, setSelected] = useState<Pedido | null>(null)

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <div className="border-border overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 cursor-pointer"
                  onClick={() => setSelected(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground text-center"
                >
                  Nenhum pedido recebido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PedidoDetailDialog
        pedido={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  )
}
