'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FieldError } from '@/components/forms/field-error'
import { ImagePicker, type UploadedImage } from '@/components/forms/image-picker'
import { MEAL_TYPES } from '@/lib/shared/constants/meal-types'
import { MOODS } from '@/lib/shared/constants/moods'
import { recordFormSchema, type RecordFormValues } from '@/lib/shared/validators/record'
import { apiClient } from '@/lib/client/api-client'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@supabase/ssr'
import type { DbTag, RecordWithImages } from '@/types/record'

interface RecordFormProps {
  userId: string
  tags: DbTag[]
  defaultValues?: RecordWithImages
  mode?: 'create' | 'edit'
}

export function RecordForm({ userId, tags, defaultValues, mode = 'create' }: RecordFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<UploadedImage[]>(
    defaultValues?.images?.map((img) => ({
      storagePath: img.storage_path,
      publicUrl: img.public_url,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
      sizeBytes: img.size_bytes ?? undefined,
      previewUrl: img.public_url,
    })) ?? []
  )

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const defaultOccurredAt = defaultValues?.occurred_at
    ? new Date(defaultValues.occurred_at).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      mealType: (defaultValues?.meal_type as RecordFormValues['mealType']) ?? 'lunch',
      amount: defaultValues?.amount?.toString() ?? '',
      occurredAt: defaultOccurredAt,
      location: defaultValues?.location ?? '',
      note: defaultValues?.note ?? '',
      // 数据库返回 null，但 Zod v4 的 .optional() 只接受 undefined，必须转换
      mood: (defaultValues?.mood ?? undefined) as RecordFormValues['mood'],
      tagIds: defaultValues?.tags?.map((t) => t.id) ?? [],
      isShared: defaultValues?.is_shared ?? true,
    },
  })

  const selectedTagIds = watch('tagIds') ?? []

  async function onSubmit(data: RecordFormValues) {
    if (images.length === 0) {
      toast.error('请至少上传一张图片')
      return
    }

    const payload = {
      ...data,
      images: images.map((img) => ({
        storagePath: img.storagePath,
        publicUrl: img.publicUrl,
        width: img.width,
        height: img.height,
        sizeBytes: img.sizeBytes,
      })),
    }

    try {
      let result
      if (mode === 'edit' && defaultValues) {
        result = await apiClient.patch(`/records/${defaultValues.id}`, payload)
      } else {
        result = await apiClient.post('/records', payload)
      }

      if (result.error) {
        toast.error(result.error.message || '保存失败，请重试')
        return
      }

      toast.success(mode === 'edit' ? '记录已更新' : '记录已保存')
      if (mode === 'edit' && defaultValues) {
        router.push(`/records/${defaultValues.id}`)
      } else {
        router.push('/admin')
      }
      router.refresh()
    } catch (err) {
      console.error('[RecordForm] submit error', err)
      toast.error('保存失败，请检查网络后重试')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-8">
      {/* 图片 */}
      <div>
        <Label className="mb-2 block">
          图片 <span className="text-destructive">*</span>
        </Label>
        <ImagePicker
          value={images}
          onChange={setImages}
          userId={userId}
          disabled={isSubmitting}
        />
        {images.length === 0 && errors.mealType && (
          <p className="mt-1 text-xs text-destructive">请至少上传一张图片</p>
        )}
      </div>

      {/* 标题 */}
      <div>
        <Label htmlFor="title">
          标题 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="今天吃了什么？"
          {...register('title')}
          className="mt-1.5"
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* 餐别 */}
      <div>
        <Label>
          餐别 <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="mealType"
          render={({ field }) => (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {MEAL_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  type="button"
                  onClick={() => field.onChange(mt.value)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    field.value === mt.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  )}
                >
                  {mt.emoji} {mt.label}
                </button>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.mealType?.message} />
      </div>

      {/* 金额 */}
      <div>
        <Label htmlFor="amount">金额（元）</Label>
        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            ¥
          </span>
          <Input
            id="amount"
            placeholder="0.00"
            inputMode="decimal"
            className="pl-7"
            {...register('amount')}
          />
        </div>
        <FieldError message={errors.amount?.message} />
      </div>

      {/* 日期时间 */}
      <div>
        <Label htmlFor="occurredAt">
          日期时间 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="occurredAt"
          type="datetime-local"
          {...register('occurredAt')}
          className="mt-1.5"
        />
        <FieldError message={errors.occurredAt?.message} />
      </div>

      {/* 心情 */}
      <div>
        <Label>心情</Label>
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() =>
                    field.onChange(field.value === m.value ? undefined : m.value)
                  }
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    field.value === m.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  )}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div>
          <Label>标签</Label>
          <Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <div className="mt-1.5 flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const selected = (field.value ?? []).includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        const current = field.value ?? []
                        field.onChange(
                          selected
                            ? current.filter((id) => id !== tag.id)
                            : [...current, tag.id]
                        )
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-sm transition-colors',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary'
                      )}
                      style={
                        !selected && tag.color
                          ? { borderColor: tag.color, color: tag.color }
                          : undefined
                      }
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>
      )}

      {/* 地点 */}
      <div>
        <Label htmlFor="location">地点</Label>
        <Input
          id="location"
          placeholder="在哪里吃的？"
          {...register('location')}
          className="mt-1.5"
        />
        <FieldError message={errors.location?.message} />
      </div>

      {/* 备注 */}
      <div>
        <Label htmlFor="note">备注</Label>
        <Textarea
          id="note"
          placeholder="今天吃得怎么样？"
          rows={3}
          {...register('note')}
          className="mt-1.5 resize-none"
        />
        <FieldError message={errors.note?.message} />
      </div>

      {/* 是否分享 */}
      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <div>
          <p className="text-sm font-medium">显示在分享页</p>
          <p className="text-xs text-muted-foreground">家人和对象可以在分享链接中看到此记录</p>
        </div>
        <Controller
          control={control}
          name="isShared"
          render={({ field }) => (
            <button
              type="button"
              role="switch"
              aria-checked={field.value}
              onClick={() => field.onChange(!field.value)}
              className={cn(
                'relative h-6 w-11 overflow-hidden rounded-full transition-colors',
                field.value ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  field.value ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          )}
        />
      </div>

      {/* 提交 */}
      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? '保存中…' : mode === 'edit' ? '保存修改' : '保存记录'}
      </Button>
    </form>
  )
}
