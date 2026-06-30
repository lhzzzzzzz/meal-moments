'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldError } from '@/components/forms/field-error'
import { Switch } from '@/components/ui/switch'
import { DatetimePicker } from '@/components/forms/datetime-picker'
import { ImagePicker, type UploadedImage } from '@/components/forms/image-picker'
import { useT } from '@/components/i18n/locale-provider'
import { getMealTypes } from '@/lib/shared/constants/meal-types'
import { getMoods } from '@/lib/shared/constants/moods'
import {
  createRecordFormSchema,
  type RecordFormInput,
  type RecordFormValues,
} from '@/lib/shared/validators/record'
import {
  fromDatetimeLocalValue,
  nowInTimezone,
  toDatetimeLocalValue,
} from '@/lib/shared/formatters/format-datetime-local'
import { translateError } from '@/lib/i18n/t'
import { apiClient } from '@/lib/client/api-client'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@supabase/ssr'
import type { DbTag, RecordWithImages } from '@/types/record'

interface RecordFormProps {
  userId: string
  tags: DbTag[]
  timezone?: string
  defaultValues?: RecordWithImages
  mode?: 'create' | 'edit'
}

export function RecordForm({
  userId,
  tags,
  timezone = 'Australia/Melbourne',
  defaultValues,
  mode = 'create',
}: RecordFormProps) {
  const router = useRouter()
  const t = useT()
  const [advancedOpen, setAdvancedOpen] = useState(false)
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
    ? toDatetimeLocalValue(defaultValues.occurred_at, timezone)
    : nowInTimezone(timezone)

  const defaultMealType = defaultValues?.meal_type as RecordFormValues['mealType'] | undefined
  const initialMealType =
    defaultMealType && defaultMealType.length > 0 ? defaultMealType : undefined

  const formSchema = useMemo(
    () => createRecordFormSchema(timezone, t),
    [timezone, t]
  )

  const mealTypes = useMemo(() => getMealTypes(t), [t])
  const moods = useMemo(() => getMoods(t), [t])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormInput, unknown, RecordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      mealType: initialMealType,
      amount: defaultValues?.amount?.toString() ?? '',
      currency:
        (defaultValues?.currency as RecordFormValues['currency']) ?? 'AUD',
      occurredAt: defaultOccurredAt,
      location: defaultValues?.location ?? '',
      note: defaultValues?.note ?? '',
      mood: (defaultValues?.mood ?? undefined) as RecordFormValues['mood'],
      tagIds: defaultValues?.tags?.map((tag) => tag.id) ?? [],
      isShared: defaultValues?.is_shared ?? true,
    },
  })

  async function onSubmit(data: RecordFormValues) {
    if (images.length === 0) {
      toast.error(t('record.needAtLeastOneImage'))
      return
    }

    const payload = {
      ...data,
      occurredAt: fromDatetimeLocalValue(data.occurredAt, timezone),
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
        toast.error(translateError(t, result.error) || t('record.saveFailed'))
        return
      }

      toast.success(mode === 'edit' ? t('record.recordUpdated') : t('record.recordSaved'))
      if (mode === 'edit' && defaultValues) {
        router.push(`/records/${defaultValues.id}`)
      } else {
        router.push('/admin')
      }
      router.refresh()
    } catch (err) {
      console.error('[RecordForm] submit error', err)
      toast.error(t('record.saveFailedNetwork'))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        if (
          formErrors.occurredAt ||
          formErrors.mealType ||
          formErrors.location ||
          formErrors.note
        ) {
          setAdvancedOpen(true)
        }
      })}
      className="space-y-5 pb-8"
    >
      <div>
        <Label className="mb-2 block">
          {t('record.images')} <span className="text-destructive">*</span>
        </Label>
        <ImagePicker
          value={images}
          onChange={setImages}
          userId={userId}
          disabled={isSubmitting}
        />
        {images.length === 0 && errors.mealType && (
          <p className="mt-1 text-xs text-destructive">{t('record.needAtLeastOneImage')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title">{t('record.title')}</Label>
        <Input
          id="title"
          placeholder={t('record.titlePlaceholder')}
          {...register('title')}
          className="mt-1.5"
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <Label htmlFor="amount">{t('record.amount')}</Label>
        <div className="mt-1.5 flex">
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  size="default"
                  className="h-8 w-18 shrink-0 rounded-l-lg rounded-r-none border-r-0 bg-muted pr-1 pl-2.5 shadow-none focus-visible:z-10 [&_svg]:size-3.5"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="min-w-18"
                >
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="CNY">CNY</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Input
            id="amount"
            placeholder="0.00"
            inputMode="decimal"
            className="rounded-l-none flex-1"
            {...register('amount')}
          />
        </div>
        <FieldError message={errors.amount?.message} />
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          onClick={() => setAdvancedOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          aria-expanded={advancedOpen}
        >
          <span className="text-sm font-medium">{t('record.advancedSettings')}</span>
          <ChevronDown
            size={18}
            className={cn(
              'text-muted-foreground transition-transform duration-200',
              advancedOpen && 'rotate-180'
            )}
          />
        </button>

        {advancedOpen && (
          <div className="space-y-5 border-t border-border px-4 py-4">
            <div>
              <Label>{t('record.mealType')}</Label>
              <Controller
                control={control}
                name="mealType"
                render={({ field }) => (
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {mealTypes.map((mt) => (
                      <button
                        key={mt.value}
                        type="button"
                        onClick={() =>
                          field.onChange(field.value === mt.value ? undefined : mt.value)
                        }
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

            <div>
              <Label htmlFor="occurredAt">
                {t('record.datetime')} <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="occurredAt"
                render={({ field }) => (
                  <DatetimePicker
                    id="occurredAt"
                    value={field.value}
                    onChange={field.onChange}
                    timeZone={timezone}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FieldError message={errors.occurredAt?.message} />
            </div>

            <div>
              <Label>{t('record.mood')}</Label>
              <Controller
                control={control}
                name="mood"
                render={({ field }) => (
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {moods.map((m) => (
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

            {tags.length > 0 && (
              <div>
                <Label>{t('record.tags')}</Label>
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

            <div>
              <Label htmlFor="location">{t('record.location')}</Label>
              <Input
                id="location"
                placeholder={t('record.locationPlaceholder')}
                {...register('location')}
                className="mt-1.5"
              />
              <FieldError message={errors.location?.message} />
            </div>

            <div>
              <Label htmlFor="note">{t('record.note')}</Label>
              <Textarea
                id="note"
                placeholder={t('record.notePlaceholder')}
                rows={3}
                {...register('note')}
                className="mt-1.5 resize-none"
              />
              <FieldError message={errors.note?.message} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">{t('record.showOnSharePage')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('record.showOnSharePageHint')}
                </p>
              </div>
              <Controller
                control={control}
                name="isShared"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting
          ? t('common.saving')
          : mode === 'edit'
            ? t('record.saveChanges')
            : t('record.saveRecord')}
      </Button>
    </form>
  )
}
