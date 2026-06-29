export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          share_title: string | null
          share_description: string | null
          timezone: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          share_title?: string | null
          share_description?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          share_title?: string | null
          share_description?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          title: string
          note: string | null
          meal_type: string
          mood: string | null
          location: string | null
          amount: number | null
          currency: string
          occurred_at: string
          is_shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          note?: string | null
          meal_type: string
          mood?: string | null
          location?: string | null
          amount?: number | null
          currency?: string
          occurred_at: string
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          note?: string | null
          meal_type?: string
          mood?: string | null
          location?: string | null
          amount?: number | null
          currency?: string
          occurred_at?: string
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      record_images: {
        Row: {
          id: string
          record_id: string
          storage_path: string
          public_url: string
          width: number | null
          height: number | null
          size_bytes: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          record_id: string
          storage_path: string
          public_url: string
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          storage_path?: string
          public_url?: string
          width?: number | null
          height?: number | null
          size_bytes?: number | null
          sort_order?: number
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
      }
      record_tags: {
        Row: {
          record_id: string
          tag_id: string
        }
        Insert: {
          record_id: string
          tag_id: string
        }
        Update: {
          record_id?: string
          tag_id?: string
        }
      }
      share_links: {
        Row: {
          id: string
          user_id: string
          token: string
          is_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          is_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}
