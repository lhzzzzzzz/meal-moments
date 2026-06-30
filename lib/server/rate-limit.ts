import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/** 公开路由（游客广场、分享 API）每 IP 每分钟最多请求次数 */
const PUBLIC_ROUTE_LIMIT = 30

let publicRouteRatelimit: Ratelimit | null | undefined

export class RateLimitUnavailableError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = 'RateLimitUnavailableError'
  }
}

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || undefined
  }
  return trimmed || undefined
}

/** 读取 Upstash REST 凭证（兼容 Vercel KV 集成的 KV_* 变量名） */
export function getUpstashCredentials():
  | { url: string; token: string }
  | null {
  const url = normalizeEnvValue(
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  )
  const token = normalizeEnvValue(
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  )
  if (!url || !token) return null
  return { url, token }
}

function getPublicRouteRatelimit(): Ratelimit | null {
  if (publicRouteRatelimit !== undefined) return publicRouteRatelimit

  const creds = getUpstashCredentials()
  if (!creds) {
    publicRouteRatelimit = null
    return null
  }

  publicRouteRatelimit = new Ratelimit({
    redis: new Redis({ url: creds.url, token: creds.token }),
    limiter: Ratelimit.slidingWindow(PUBLIC_ROUTE_LIMIT, '1 m'),
    prefix: 'ratelimit:public-route',
  })
  return publicRouteRatelimit
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1'
  }
  return request.headers.get('x-real-ip') || '127.0.0.1'
}

export function isPublicRateLimitedPath(pathname: string): boolean {
  return (
    pathname === '/guest' ||
    pathname.startsWith('/guest/') ||
    pathname.startsWith('/api/v1/share/')
  )
}

/**
 * 对游客广场、分享 API 等公开路由做 IP 限流。
 * 未配置 Upstash 时跳过（便于本地开发）。
 * 已配置但连接失败时抛出 RateLimitUnavailableError，由 proxy 返回明确错误页。
 */
export async function checkPublicRouteRateLimit(
  request: Request
): Promise<{ limited: boolean }> {
  const ratelimit = getPublicRouteRatelimit()
  if (!ratelimit) return { limited: false }

  const ip = getClientIp(request)
  try {
    const { success } = await ratelimit.limit(`public:${ip}`)
    return { limited: !success }
  } catch (error) {
    console.error('[rate-limit] Upstash check failed:', error)
    throw new RateLimitUnavailableError(
      'Upstash Redis 限流不可用。请在 Upstash Console → Redis → REST 复制读写 Token（不要用只读 Token），并写入 Vercel 的 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN。',
      error
    )
  }
}
