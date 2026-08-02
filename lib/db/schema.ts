import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Tabelas abaixo (user, session, account, verification) seguem o schema
 * padrão exigido pelo Better Auth para o adapter Drizzle/SQLite — ver
 * https://www.better-auth.com/docs/adapters/drizzle
 */
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const PEDIDO_STATUS = ['novo', 'em_andamento', 'respondido', 'arquivado'] as const
export type PedidoStatus = (typeof PEDIDO_STATUS)[number]

/**
 * `codigo` é derivado do autoincrement do próprio SQLite (id), não de um
 * contador mantido à mão — evita corrida de concorrência entre duas
 * solicitações simultâneas. Ver `app/actions/contact.ts` para o fluxo de
 * criação (insere com placeholder único, depois atualiza pro valor final
 * "AS-{id}").
 */
export const pedidos = sqliteTable('pedidos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull().unique(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  telefone: text('telefone').notNull(),
  area: text('area').notNull(),
  mensagem: text('mensagem').notNull(),
  status: text('status', { enum: PEDIDO_STATUS }).notNull().default('novo'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

/** Uma linha por navegador/dispositivo inscrito para notificações push. */
export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const MIDIA_TIPO = ['imagem', 'video'] as const
export type MidiaTipo = (typeof MIDIA_TIPO)[number]

export const MIDIA_CATEGORIA = ['inicio', 'meio', 'fim'] as const
export type MidiaCategoria = (typeof MIDIA_CATEGORIA)[number]

/**
 * Fotos/vídeos de obra amarrados a um pedido, pra segurança jurídica —
 * classificáveis em início/meio/fim (`categoria` nula = ainda não
 * classificado). `filename` é o nome no disco
 * (`storage/pedidos/{uuid}.{ext}`), gerado no servidor — nunca o nome
 * original enviado. Servido só via rota autenticada
 * (`app/api/pedidos/midia/[id]/route.ts`), nunca em `public/`.
 */
export const pedidoMidias = sqliteTable('pedido_midias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pedidoId: integer('pedido_id')
    .notNull()
    .references(() => pedidos.id, { onDelete: 'cascade' }),
  tipo: text('tipo', { enum: MIDIA_TIPO }).notNull(),
  categoria: text('categoria', { enum: MIDIA_CATEGORIA }),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  tamanhoBytes: integer('tamanho_bytes').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

/**
 * Documentos e contratos (PDF/DOCX/DOC) amarrados a um pedido.
 * `thumbnailFilename` só existe pra PDF (miniatura real da 1ª página,
 * gerada em `lib/document-preview.ts`) — nulo pra DOCX/DOC, que mostram
 * um ícone genérico na interface. Mesmo diretório de armazenamento das
 * mídias (`storage/pedidos/`), servido só via rota autenticada
 * (`app/api/pedidos/documento/[id]/route.ts`).
 */
export const pedidoDocumentos = sqliteTable('pedido_documentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pedidoId: integer('pedido_id')
    .notNull()
    .references(() => pedidos.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  tamanhoBytes: integer('tamanho_bytes').notNull(),
  thumbnailFilename: text('thumbnail_filename'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})
