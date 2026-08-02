import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Carrega o `.env` manualmente — sem depender de flag do Node ou de dotenv. */
function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '../.env'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) process.env[match[1]] ??= match[2] ?? ''
    }
  } catch {
    console.error('Não encontrei o arquivo .env na raiz do projeto.')
    process.exit(1)
  }
}

const [, , email, password, name] = process.argv

if (!email || !password) {
  console.error('Uso: pnpm tsx scripts/create-admin.ts <email> <senha> [nome]')
  process.exit(1)
}

async function main() {
  // Import dinâmico: precisa rodar depois de `loadEnv()`, já que `lib/db`
  // lê `process.env.TURSO_DATABASE_URL` assim que o módulo é avaliado.
  const { betterAuth } = await import('better-auth')
  const { drizzleAdapter } = await import('better-auth/adapters/drizzle')
  const { db } = await import('../lib/db')
  const schema = await import('../lib/db/schema')

  /**
   * Instância separada da usada pelo site (`lib/auth.ts`): só aqui o cadastro
   * fica habilitado, pra esse script local criar o(s) administrador(es). A
   * instância pública mantém `disableSignUp: true` sempre — não existe rota
   * de cadastro exposta.
   */
  const seedAuth = betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    emailAndPassword: { enabled: true },
  })

  const result = await seedAuth.api.signUpEmail({
    body: { email, password, name: name ?? email.split('@')[0] },
  })
  console.log('Administrador criado:', result.user.email)
}

loadEnv()
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Falha ao criar administrador:', err)
    process.exit(1)
  })
