'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, RefreshCw, Check, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import { apiClient } from '@/lib/client/api-client'
import { cn } from '@/lib/utils'
import type { DbProfile, DbShareLink } from '@/types/record'

interface SettingsFormProps {
  profile: DbProfile | null
  shareLink: DbShareLink | null
  appUrl: string
}

export function SettingsForm({ profile, shareLink, appUrl }: SettingsFormProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [shareTitle, setShareTitle] = useState(profile?.share_title ?? '')
  const [shareDescription, setShareDescription] = useState(profile?.share_description ?? '')
  const [shareEnabled, setShareEnabled] = useState(shareLink?.is_enabled ?? true)
  const [token, setToken] = useState(shareLink?.token ?? '')
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const shareUrl = `${appUrl}/share/${token}`

  async function handleSaveProfile() {
    if (!displayName.trim()) {
      toast.error('展示名不能为空')
      return
    }
    setSaving(true)
    const result = await apiClient.patch('/settings/profile', {
      displayName,
      shareTitle,
      shareDescription,
    })
    setSaving(false)
    if (result.error) {
      toast.error('保存失败')
    } else {
      toast.success('已保存')
      router.refresh()
    }
  }

  async function handleToggleShare() {
    const newEnabled = !shareEnabled
    const result = await apiClient.patch('/settings/share', { isEnabled: newEnabled })
    if (result.error) {
      toast.error('操作失败')
    } else {
      setShareEnabled(newEnabled)
      toast.success(newEnabled ? '分享已开启' : '分享已关闭')
    }
  }

  async function handleRegenerateToken() {
    setRegenerating(true)
    const result = await apiClient.post('/settings/share/regenerate', {})
    setRegenerating(false)
    if (result.error) {
      toast.error('操作失败')
    } else {
      const data = result.data as { token: string }
      setToken(data.token)
      toast.success('分享链接已更新，旧链接已失效')
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6 pb-8">
      {/* 个人信息 */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">个人信息</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="displayName">展示名</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="你的名字"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="shareTitle">分享页标题</Label>
            <Input
              id="shareTitle"
              value={shareTitle}
              onChange={(e) => setShareTitle(e.target.value)}
              placeholder={`${displayName || '我'}的生活记录`}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="shareDescription">分享页描述</Label>
            <Textarea
              id="shareDescription"
              value={shareDescription}
              onChange={(e) => setShareDescription(e.target.value)}
              placeholder="一句话介绍自己的分享页"
              rows={2}
              className="mt-1.5 resize-none"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
            {saving ? '保存中…' : '保存'}
          </Button>
        </div>
      </section>

      {/* 分享设置 */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">分享设置</h2>
        <div className="space-y-3">
          {/* 开关 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">开启分享</p>
              <p className="text-xs text-muted-foreground">关闭后所有分享链接均不可访问</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={shareEnabled}
              onClick={handleToggleShare}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                shareEnabled ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  shareEnabled ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>

          <Separator />

          {/* 分享链接 */}
          <div>
            <Label>分享链接</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={shareEnabled ? shareUrl : '（分享已关闭）'}
                readOnly
                className="text-xs text-muted-foreground"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!shareEnabled}
                aria-label="复制链接"
              >
                {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleRegenerateToken}
            disabled={regenerating}
            className="w-full gap-1.5"
          >
            <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
            {regenerating ? '重新生成中…' : '重新生成链接'}
          </Button>
          <p className="text-xs text-muted-foreground">
            重新生成后旧链接立即失效，请及时将新链接发送给家人。
          </p>
        </div>
      </section>

      {/* 账号 */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">账号</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleLogout}
          className="w-full gap-1.5 text-destructive"
        >
          <LogOut size={14} />
          退出登录
        </Button>
      </section>
    </div>
  )
}
