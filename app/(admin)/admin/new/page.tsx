import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PageShell } from '@/components/layout/page-shell'
import { RecordForm } from '@/components/records/record-form'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'
import { getTagsByUser } from '@/lib/server/db/tags'
import { getUserTimezone } from '@/lib/server/db/profiles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '记录一餐 - Meal Moments',
}

export default async function NewRecordPage() {
  const user = await getCurrentUser()
  const [tags, timezone] = await Promise.all([
    getTagsByUser(user!.id),
    getUserTimezone(user!.id),
  ])

  return (
    <PageShell>
      <div className="py-5">
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="返回"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold">记录一餐</h1>
        </div>
        <RecordForm userId={user!.id} tags={tags} timezone={timezone} mode="create" />
      </div>
    </PageShell>
  )
}
