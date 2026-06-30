import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  checkPublicRouteRateLimit,
  isPublicRateLimitedPath,
} from '@/lib/server/rate-limit'

const PROTECTED_PREFIXES = ['/admin', '/stats', '/settings', '/records']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRateLimitedPath(pathname)) {
    const { limited } = await checkPublicRouteRateLimit(request)
    if (limited) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { data: null, error: { message: '请求过于频繁，请稍后再试' } },
          { status: 429 }
        )
      }
      return new NextResponse('请求过于频繁，请稍后再试', { status: 429 })
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
