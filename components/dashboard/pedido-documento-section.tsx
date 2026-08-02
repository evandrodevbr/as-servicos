'use client'

import { FileText } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { deleteDocumento, getDocumentosForPedido } from '@/app/actions/pedido-documentos'
import { DocumentoUploader } from '@/components/dashboard/documento-uploader'
import { DocumentoViewerDialog } from '@/components/dashboard/documento-viewer-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

type Documento = {
  id: number
  originalName: string
  mimeType: string
  tamanhoBytes: number
  thumbnailFilename: string | null
}

function podeVisualizar(mimeType: string) {
  return mimeType === 'application/pdf' || mimeType === DOCX_MIME
}

export function PedidoDocumentoSection({ pedidoId }: { pedidoId: number }) {
  const [documentos, setDocumentos] = useState<Documento[] | null>(null)
  const [visualizando, setVisualizando] = useState<Documento | null>(null)

  const refresh = useCallback(async () => {
    setDocumentos(await getDocumentosForPedido(pedidoId))
  }, [pedidoId])

  useEffect(() => {
    setDocumentos(null)
    refresh()
  }, [refresh])

  async function handleDelete(id: number) {
    try {
      await deleteDocumento(id)
      await refresh()
    } catch {
      toast.error('Não foi possível apagar.')
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <span className="label-tech text-muted-foreground text-xs">Documentos</span>
      <DocumentoUploader pedidoId={pedidoId} onUploaded={refresh} />

      {documentos === null ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      ) : documentos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum documento enviado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {documentos.map((d) => (
            <div
              key={d.id}
              className="border-border flex flex-col overflow-hidden rounded-md border"
            >
              <button
                type="button"
                onClick={() => podeVisualizar(d.mimeType) && setVisualizando(d)}
                disabled={!podeVisualizar(d.mimeType)}
                className="bg-muted/30 aspect-[3/4] flex w-full items-center justify-center overflow-hidden disabled:cursor-default"
              >
                {d.thumbnailFilename ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/pedidos/documento/${d.id}/thumb`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="text-muted-foreground h-10 w-10" />
                )}
              </button>
              <div className="flex flex-col gap-1 p-2">
                <span
                  className="line-clamp-1 text-xs font-medium"
                  title={d.originalName}
                >
                  {d.originalName}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {(d.tamanhoBytes / 1024).toFixed(0)} KB
                </span>
                <div className="mt-1 flex gap-1">
                  <Button
                    size="xs"
                    variant="outline"
                    nativeButton={false}
                    render={<a href={`/api/pedidos/documento/${d.id}`} download={d.originalName} />}
                  >
                    Baixar
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => handleDelete(d.id)}>
                    Apagar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentoViewerDialog
        documento={visualizando}
        onOpenChange={(open) => !open && setVisualizando(null)}
      />
    </div>
  )
}
