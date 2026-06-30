'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useT } from '@/components/i18n/locale-provider'
import { translateError } from '@/lib/i18n/t'
import { apiClient } from '@/lib/client/api-client'

interface DeleteRecordButtonProps {
  recordId: string
}

export function DeleteRecordButton({ recordId }: DeleteRecordButtonProps) {
  const router = useRouter()
  const t = useT()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const result = await apiClient.delete(`/records/${recordId}`)
    if (result.error) {
      toast.error(translateError(t, result.error) || t('deleteRecord.failed'))
      setLoading(false)
      return
    }
    setOpen(false)
    toast.success(t('record.recordDeleted'))
    router.push('/admin')
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="flex h-9 items-center gap-1.5 rounded-full border border-destructive/30 bg-card px-3 text-sm text-destructive transition-colors hover:bg-destructive/5"
        aria-label={t('common.delete')}
      >
        <Trash2 size={14} />
        {t('common.delete')}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteRecord.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('deleteRecord.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading ? t('deleteRecord.deleting') : t('common.delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
