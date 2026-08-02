import path from 'node:path'

/** Fora de `public/` de propósito — ver `lib/db/schema.ts` (pedidoMidias). */
export const PEDIDO_STORAGE_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  'storage',
  'pedidos',
)
