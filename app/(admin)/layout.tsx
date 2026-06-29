// proxy.ts 已做路由保护（乐观 cookie 检查），
// 这里保留 getUser() 作为服务端安全兜底。
// 因为 React.cache() 缓存了 getCurrentUser()，
// 此调用与同一 render pass 中 page 的调用共享结果，不产生额外网络请求。
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/server/auth/get-current-user'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return <>{children}</>
}
