import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/** 公开路由（游客广场、分享 API）每 IP 每分钟最多请求次数 */
const PUBLIC_ROUTE_LIMIT = 30

let publicRouteRatelimit: Ratelimit | null | undefined

function getPublicRouteRatelimit(): Ratelimit | null {
  if (publicRouteRatelimit !== undefined) return publicRouteRatelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    publicRouteRatelimit = null
    return null
  }

  publicRouteRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
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
 */
export async function checkPublicRouteRateLimit(
  request: Request
): Promise<{ limited: boolean }> {
  const ratelimit = getPublicRouteRatelimit()
  if (!ratelimit) return { limited: false }

  const ip = getClientIp(request)
  const { success } = await ratelimit.limit(`public:${ip}`)
  return { limited: !success }
}
