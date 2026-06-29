const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8MB
const COMPRESS_QUALITY = 0.8
const MAX_DIMENSION = 1920

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface CompressedImage {
  file: File
  width: number
  height: number
  sizeBytes: number
}

export function isAllowedImageType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type)
}

export async function compressImage(file: File): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    if (!isAllowedImageType(file)) {
      reject(new Error(`不支持的文件格式。请上传 JPG、PNG 或 WebP 图片。`))
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // 等比缩放
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建 canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('图片压缩失败'))
            return
          }

          if (blob.size > MAX_SIZE_BYTES) {
            reject(new Error(`图片大小不能超过 8MB`))
            return
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          resolve({
            file: compressedFile,
            width,
            height,
            sizeBytes: blob.size,
          })
        },
        'image/jpeg',
        COMPRESS_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }

    img.src = url
  })
}
