import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { SITE_URL } from '@/lib/site-config'

/**
 * `disableSignUp: true` bloqueia o endpoint de cadastro público
 * (`/api/auth/sign-up/email`) mesmo sem tela de signup no site — o painel
 * é de uso interno, o(s) usuário(s) são criados só via
 * `scripts/create-admin.ts`.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  /**
   * Fixado explicitamente (em vez de depender só de `BETTER_AUTH_URL`):
   * se a env faltar em produção, o Better Auth não trava a build, só avisa
   * no log e passa a derivar a origem confiável a partir do header `Host`
   * da própria requisição — mais frágil do ponto de vista de segurança.
   */
  baseURL: process.env.BETTER_AUTH_URL ?? SITE_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  /**
   * O limite padrão do Better Auth é global (100 req/10s por IP, e só fica
   * ativo em produção por padrão) — não há nada mais restritivo para
   * `/sign-in/email` especificamente, o que deixaria força-bruta de senha
   * praticamente livre. `enabled: true` liga isso também em dev, pra dar
   * pra testar antes do deploy; regra própria, bem mais apertada, pro login.
   */
  rateLimit: {
    enabled: true,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
    },
  },
})
