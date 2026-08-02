'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadDocumentos } from '@/app/actions/pedido-documentos'
import { Button } from '@/components/ui/button'

export function DocumentoUploader({
  pedidoId,
  onUploaded,
}: {
  pedidoId: number
  onUploaded: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const submittingRef = useRef(false)
  const [pending, setPending] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (submittingRef.current) return
    submittingRef.current = true
    setPending(true)
    const formData = new FormData()
    for (const file of Array.from(files)) formData.append('files', file)

    try {
      await uploadDocumentos(pedidoId, formData)
      toast.success('Documentos enviados.')
      onUploaded()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao enviar os documentos.')
    } finally {
      setPending(false)
      submittingRef.current = false
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="border-border flex flex-col items-center gap-3 rounded-md border border-dashed p-6">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={pending}
      />
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? 'Enviando…' : 'Selecionar documentos'}
      </Button>
      <p className="text-muted-foreground text-xs">
        PDF, DOC ou DOCX.
      </p>
    </div>
  )
}
