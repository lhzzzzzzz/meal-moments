import type { Database } from './database'

export type DbRecord = Database['public']['Tables']['records']['Row']
export type DbRecordImage = Database['public']['Tables']['record_images']['Row']
export type DbTag = Database['public']['Tables']['tags']['Row']
export type DbProfile = Database['public']['Tables']['profiles']['Row']
export type DbShareLink = Database['public']['Tables']['share_links']['Row']

export interface RecordWithImages extends DbRecord {
  images: DbRecordImage[]
  tags: DbTag[]
}

export interface RecordListItem {
  id: string
  user_id?: string
  author_name?: string | null
  title: string
  meal_type: string
  mood: string | null
  amount: number | null
  currency: string
  occurred_at: string
  is_shared: boolean
  cover_image: string | null
  tags: Pick<DbTag, 'id' | 'name' | 'color'>[]
  note: string | null
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'midnight_snack'
  | 'snack'
  | 'drink'
  | 'other'

export type Mood =
  | 'happy'
  | 'normal'
  | 'tired'
  | 'satisfied'
  | 'homesick'
  | 'busy'
  | 'other'
