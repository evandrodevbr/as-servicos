import { ORGANIZATION_SCHEMA } from '@/lib/schema-org'

/** Server Component — não gera custo de hidratação. */
export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
    />
  )
}
