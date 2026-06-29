import { createSupabaseAdminClient } from '@/lib/server/supabase/admin'

export const BUCKET = 'record-images'

/**
 * 删除 Storage 中的单张图片（通过 storage_path）。
 * 使用 admin client，因为删除操作需要绕过 RLS。
 */
export async function deleteStorageImage(storagePath: string): Promise<void> {
  const admin = createSupabaseAdminClient()
  const { error } = await admin.storage.from(BUCKET).remove([storagePath])
  if (error) throw error
}

/**
 * 批量删除多张图片。
 */
export async function deleteStorageImages(storagePaths: string[]): Promise<void> {
  if (storagePaths.length === 0) return
  const admin = createSupabaseAdminClient()
  const { error } = await admin.storage.from(BUCKET).remove(storagePaths)
  if (error) throw error
}

/**
 * 获取图片的 signed URL（用于分享页访问私有图片）。
 */
export async function getSignedUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn)
  if (error) throw error
  return data.signedUrl
}

/**
 * 批量生成 signed URLs。
 */
export async function getSignedUrls(
  storagePaths: string[],
  expiresIn = 3600
): Promise<Record<string, string>> {
  if (storagePaths.length === 0) return {}
  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrls(storagePaths, expiresIn)
  if (error) throw error
  return Object.fromEntries(
    (data ?? []).map((item) => [item.path, item.signedUrl])
  )
}
