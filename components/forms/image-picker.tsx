'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<string[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleFiles(files: FileList) {
    const available = maxImages - value.length
    const toProcess = Array.from(files).slice(0, available)
    let accumulated = [...value]

    if (toProcess.length === 0) {
      toast.error(`最多上传 ${maxImages} 张图片`)
      return
    }

    for (const file of toProcess) {
      if (!isAllowedImageType(file)) {
        toast.error(`${file.name} 格式不支持，请上传 JPG、PNG 或 WebP 图片`)
        continue
      }

      const tempId = `${Date.now()}-${Math.random()}`
      setUploading((prev) => [...prev, tempId])

      try {
        const compressed = await compressImage(file)
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
        const message = err instanceof Error ? err.message : '上传失败，请重试'
        toast.error(message)
      } finally {
        setUploading((prev) => prev.filter((id) => id !== tempId))
      }
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index))
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
              alt={`图片 ${idx + 1}`}
              fill
              className="object-cover"
              sizes="120px"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-opacity hover:bg-black/80"
                aria-label="删除图片"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {/* 上传中占位 */}
        {uploading.map((id) => (
          <div
            key={id}
            className="flex aspect-square items-center justify-center rounded-lg bg-muted"
          >
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ))}

        {/* 添加按钮 */}
        {canAdd && !isUploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border',
              'text-muted-foreground transition-colors hover:border-primary hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
            aria-label="添加图片"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
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
