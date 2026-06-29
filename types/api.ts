export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: {
    message: string
    code?: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  records: T[]
  total: number
  nextPage: number | null
}

export interface StatsResponse {
  totalAmount: number
  recordCount: number
  activeDays: number
  amountByMealType: Record<string, number>
  recordsByTag: Record<string, number>
  dailyAmount: { date: string; amount: number }[]
}
