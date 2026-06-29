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
import { apiClient } from '@/lib/client/api-client'

interface DeleteRecordButtonProps {
  recordId: string
}

export function DeleteRecordButton({ recordId }: DeleteRecordButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const result = await apiClient.delete(`/records/${recordId}`)
    if (result.error) {
      toast.error(result.error.message || '删除失败')
      setLoading(false)
      return
    }
    setOpen(false)
    toast.success('记录已删除')
    router.push('/admin')
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="flex h-9 items-center gap-1.5 rounded-full border border-destructive/30 bg-card px-3 text-sm text-destructive transition-colors hover:bg-destructive/5"
        aria-label="删除记录"
      >
        <Trash2 size={14} />
        删除
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除这条记录？</AlertDialogTitle>
          <AlertDialogDescription>
            删除后无法恢复，相关图片也会一并删除。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading ? '删除中…' : '删除'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
