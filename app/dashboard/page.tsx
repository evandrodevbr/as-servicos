import type { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { PedidosTable } from '@/components/dashboard/pedidos-table'
import { NovoPedidoDialog } from '@/components/dashboard/novo-pedido-dialog'
import { PushToggle } from '@/components/dashboard/push-toggle'
import { SignOutButton } from '@/components/dashboard/sign-out-button'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'
import { PEDIDO_STATUS, pedidos, type PedidoStatus } from '@/lib/db/schema'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<PedidoStatus, string> = {
  novo: 'Novo',
  em_andamento: 'Em andamento',
  respondido: 'Respondido',
  arquivado: 'Arquivado',
}

export default async function DashboardPage() {
  const data = await db.select().from(pedidos).orderBy(desc(pedidos.createdAt))

  const countByStatus = Object.fromEntries(
    PEDIDO_STATUS.map((s) => [s, data.filter((p) => p.status === s).length]),
  ) as Record<PedidoStatus, number>

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground text-sm">
            Pedidos recebidos pelo site e registrados internamente.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NovoPedidoDialog />
          <PushToggle />
          <SignOutButton />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card>
          <CardContent className="flex flex-col gap-1 px-4 py-3">
            <span className="text-2xl font-bold tabular-nums">{data.length}</span>
            <span className="text-muted-foreground text-xs">Total</span>
          </CardContent>
        </Card>
        {PEDIDO_STATUS.map((s) => (
          <Card key={s}>
            <CardContent className="flex flex-col gap-1 px-4 py-3">
              <span className="text-2xl font-bold tabular-nums">
                {countByStatus[s]}
              </span>
              <span className="text-muted-foreground text-xs">
                {STATUS_LABEL[s]}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <PedidosTable data={data} />
    </div>
  )
}
