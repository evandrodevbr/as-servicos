'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

type DocumentoParaVisualizar = {
  id: number
  mimeType: string
  originalName: string
}

export function DocumentoViewerDialog({
  documento,
  onOpenChange,
}: {
  documento: DocumentoParaVisualizar | null
  onOpenChange: (open: boolean) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const isDocx = documento?.mimeType === DOCX_MIME

  useEffect(() => {
    if (!documento || !isDocx) return
    setError(null)
    let cancelled = false

    async function render() {
      try {
        const [{ renderAsync }, res] = await Promise.all([
          import('docx-preview'),
          fetch(`/api/pedidos/documento/${documento!.id}`),
        ])
        const blob = await res.blob()
        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = ''
        await renderAsync(blob, containerRef.current)
      } catch {
        if (!cancelled) setError('Não foi possível abrir este documento.')
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [documento, isDocx])

  return (
    <Dialog open={!!documento} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[85vh] w-full flex-col sm:max-w-4xl">
        {documento && (
          <>
            <DialogHeader>
              <DialogTitle className="truncate">{documento.originalName}</DialogTitle>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-auto">
              {documento.mimeType === 'application/pdf' ? (
                <iframe
                  src={`/api/pedidos/documento/${documento.id}`}
                  className="h-full w-full"
                  title={documento.originalName}
                />
              ) : isDocx ? (
                <>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <div ref={containerRef} />
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Visualização não disponível para este tipo de arquivo.
                </p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
