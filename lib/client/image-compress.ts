const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB，与 Supabase bucket file_size_limit 一致
const INITIAL_QUALITY = 0.85
const MAX_DIMENSION = 1920
const MIN_DIMENSION = 640

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

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }

    img.src = url
  })
}

function scaleDimensions(width: number, height: number, maxDimension: number) {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  if (width > height) {
    return {
      width: maxDimension,
      height: Math.round((height * maxDimension) / width),
    }
  }

  return {
    width: Math.round((width * maxDimension) / height),
    height: maxDimension,
  }
}

function drawImageSource(
  source: CanvasImageSource,
  width: number,
  height: number
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法创建 canvas context')
  }

  ctx.drawImage(source, 0, 0, width, height)
  return canvas
}

function drawToCanvas(img: HTMLImageElement, width: number, height: number) {
  return drawImageSource(img, width, height)
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
  })
}

async function compressCanvasToLimit(canvas: HTMLCanvasElement): Promise<{
  blob: Blob
  width: number
  height: number
}> {
  let currentCanvas = canvas
  let width = canvas.width
  let height = canvas.height

  for (let attempt = 0; attempt < 8; attempt++) {
    const qualities =
      attempt === 0
        ? [INITIAL_QUALITY, 0.72, 0.6, 0.48, 0.36]
        : [0.72, 0.6, 0.48, 0.36, 0.28]

    for (const quality of qualities) {
      const blob = await canvasToBlob(currentCanvas, quality)
      if (blob && blob.size <= MAX_SIZE_BYTES) {
        return { blob, width, height }
      }
    }

    const nextWidth = Math.round(width * 0.85)
    const nextHeight = Math.round(height * 0.85)

    if (nextWidth < MIN_DIMENSION || nextHeight < MIN_DIMENSION) {
      break
    }

    currentCanvas = drawImageSource(currentCanvas, nextWidth, nextHeight)
    width = nextWidth
    height = nextHeight
  }

  throw new Error('图片压缩后仍超过 2MB，请换一张较小的图片')
}

export async function compressImage(file: File): Promise<CompressedImage> {
  if (!isAllowedImageType(file)) {
    throw new Error('不支持的文件格式。请上传 JPG、PNG 或 WebP 图片。')
  }

  const img = await loadImage(file)
  const { width, height } = scaleDimensions(img.naturalWidth, img.naturalHeight, MAX_DIMENSION)
  const canvas = drawToCanvas(img, width, height)
  const { blob, width: finalWidth, height: finalHeight } =
    await compressCanvasToLimit(canvas)

  const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })

  return {
    file: compressedFile,
    width: finalWidth,
    height: finalHeight,
    sizeBytes: blob.size,
  }
}
