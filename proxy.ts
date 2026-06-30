import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  checkPublicRouteRateLimit,
  isPublicRateLimitedPath,
  RateLimitUnavailableError,
} from '@/lib/server/rate-limit'

function htmlErrorPage(title: string, detail: string, status: number) {
  const body = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; color: #1a1a1a; }
    h1 { font-size: 1.25rem; }
    p { color: #555; max-width: 36rem; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>${detail}</p>
</body>
</html>`
  return new NextResponse(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

const PROTECTED_PREFIXES = ['/admin', '/stats', '/settings', '/records']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRateLimitedPath(pathname)) {
    try {
      const { limited } = await checkPublicRouteRateLimit(request)
      if (limited) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { data: null, error: { message: '请求过于频繁，请稍后再试' } },
            { status: 429 }
          )
        }
        return htmlErrorPage(
          '请求过于频繁',
          '请稍后再试。',
          429
        )
      }
    } catch (error) {
      if (error instanceof RateLimitUnavailableError) {
        console.error('[proxy] rate limit misconfigured:', error.cause ?? error)
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            {
              data: null,
              error: {
                message:
                  '限流服务未正确配置，请联系管理员检查 Upstash Redis 环境变量。',
              },
            },
            { status: 503 }
          )
        }
        return htmlErrorPage(
          '服务暂时不可用',
          '游客广场限流服务未正确配置。请确认 Vercel 中已填写 Upstash REST 读写 Token，并重新部署。',
          503
        )
      }
      throw error
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  // 使用 getSession()（读 cookie，无网络请求）做乐观检查，
  // 并让 Supabase 在需要时自动刷新 access token 写回 cookie。
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getSession() 从 cookie 读取，不发起网络请求，用于乐观路由保护。
  // 真正的安全校验由各 Server Component 内的 getUser() 负责。
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (!session && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (session && pathname.startsWith('/guest')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
}
