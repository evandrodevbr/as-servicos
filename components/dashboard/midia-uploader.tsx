'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadMidias } from '@/app/actions/pedido-midias'
import { Button } from '@/components/ui/button'

export function MidiaUploader({
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
      await uploadMidias(pedidoId, formData)
      toast.success('Arquivos enviados e comprimidos.')
      onUploaded()
    } catch {
      toast.error('Falha ao enviar os arquivos.')
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
        accept="image/*,video/*"
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
        {pending ? 'Comprimindo e enviando…' : 'Selecionar fotos ou vídeos'}
      </Button>
      <p className="text-muted-foreground text-xs">
        Imagens e vídeos são comprimidos automaticamente ao enviar.
      </p>
    </div>
  )
}
