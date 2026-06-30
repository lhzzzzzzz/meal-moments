import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { RecordForm } from '@/components/records/record-form'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { getRecordById } from '@/lib/server/db/records'
import { getTagsByUser } from '@/lib/server/db/tags'
import { getUserTimezone } from '@/lib/server/db/profiles'
import { getTranslator } from '@/lib/i18n/get-locale'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator()
  return { title: `${t('record.editRecord')} - Meal Moments` }
}

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const { t } = await getTranslator()
  const [record, tags, timezone] = await Promise.all([
    getRecordById(id),
    getTagsByUser(user!.id),
    getUserTimezone(user!.id),
  ])

  if (!record || record.user_id !== user!.id) notFound()

  return (
    <PageShell>
      <div className="py-5">
        <div className="mb-5 flex items-center gap-3">
          <Link
            href={`/records/${id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold">{t('record.editRecord')}</h1>
        </div>
        <RecordForm
          userId={user!.id}
          tags={tags}
          timezone={timezone}
          defaultValues={record}
          mode="edit"
        />
      </div>
    </PageShell>
  )
}
