'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, X, Loader2, Camera, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import { useT } from '@/components/i18n/locale-provider'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { compressImage, isAllowedImageType } from '@/lib/client/image-compress'
import { cn } from '@/lib/utils'

export interface UploadedImage {
  storagePath: string
  publicUrl: string
  width?: number
  height?: number
  sizeBytes?: number
  previewUrl: string
}

interface ImagePickerProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  userId: string
  disabled?: boolean
  maxImages?: number
}

export function ImagePicker({
  value,
  onChange,
  userId,
  disabled,
  maxImages = 6,
}: ImagePickerProps) {
  const t = useT()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleFiles(files: FileList) {
    const available = maxImages - value.length
    const toProcess = Array.from(files).slice(0, available)
    let accumulated = [...value]

    if (toProcess.length === 0) {
      toast.error(t('imagePicker.maxImages', { max: maxImages }))
      return
    }

    for (const file of toProcess) {
      if (!isAllowedImageType(file)) {
        toast.error(t('imagePicker.unsupportedFormat', { name: file.name }))
        continue
      }

      const tempId = `${Date.now()}-${Math.random()}`
      setUploading((prev) => [...prev, tempId])

      try {
        const compressed = await compressImage(file, t)
        const timestamp = Date.now()
        const ext = 'jpg'
        const storagePath = `${userId}/${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('record-images')
          .upload(storagePath, compressed.file, {
            contentType: 'image/jpeg',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('record-images')
          .getPublicUrl(storagePath)

        const newImage: UploadedImage = {
          storagePath,
          publicUrl: urlData.publicUrl,
          width: compressed.width,
          height: compressed.height,
          sizeBytes: compressed.sizeBytes,
          previewUrl: URL.createObjectURL(compressed.file),
        }

        accumulated = [...accumulated, newImage]
        onChange(accumulated)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : t('imagePicker.uploadFailed')
        toast.error(message)
      } finally {
        setUploading((prev) => prev.filter((id) => id !== tempId))
      }
    }

    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function openInput(input: 'camera' | 'gallery') {
    setMenuOpen(false)
    requestAnimationFrame(() => {
      if (input === 'camera') {
        cameraInputRef.current?.click()
      } else {
        galleryInputRef.current?.click()
      }
    })
  }

  const isUploading = uploading.length > 0
  const canAdd = value.length < maxImages && !disabled

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {value.map((img, idx) => (
          <div
            key={img.storagePath}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={img.previewUrl || img.publicUrl}
              alt={t('common.imageN', { n: idx + 1 })}
              fill
              className="object-cover"
              sizes="120px"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-opacity hover:bg-black/80"
                aria-label={t('common.removeImage')}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {uploading.map((id) => (
          <div
            key={id}
            className="flex aspect-square items-center justify-center rounded-lg bg-muted"
          >
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ))}

        {canAdd && !isUploading && (
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border',
                'text-muted-foreground transition-colors hover:border-primary hover:text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label={t('common.addImage')}
            >
              <Plus size={24} />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1">
              <button
                type="button"
                onClick={() => openInput('camera')}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted"
              >
                <Camera size={18} className="shrink-0 text-muted-foreground" />
                {t('imagePicker.takePhoto')}
              </button>
              <button
                type="button"
                onClick={() => openInput('gallery')}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted"
              >
                <ImageIcon size={18} className="shrink-0 text-muted-foreground" />
                {t('imagePicker.chooseFromAlbum')}
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <p className="mt-1.5 text-xs text-muted-foreground">
        {value.length}/{maxImages}
      </p>
    </div>
  )
}
